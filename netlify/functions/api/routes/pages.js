import express from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db.js";
import { pages } from "../schema.js";
import { requireAuth } from "../middleware.js";

const router = express.Router();
router.use(requireAuth); // All routes here require auth

// Get all pages for user
router.get("/", async (req, res) => {
  try {
    const userPages = await db.select().from(pages).where(eq(pages.userId, req.user.userId));
    res.json({ pages: userPages });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new page
router.post("/", async (req, res) => {
  try {
    const { title, slug } = req.body;
    if (!title || !slug) return res.status(400).json({ error: "Title and slug required" });

    const existingStr = await db.select().from(pages).where(eq(pages.slug, slug));
    if (existingStr.length > 0) return res.status(400).json({ error: "Slug already in use" });

    const newPage = await db.insert(pages).values({
      userId: req.user.userId,
      title,
      slug,
      status: "draft",
      themePreset: "minimal",
      themeOverrides: "{}",
      sections: "[]",
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    res.json({ page: newPage[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get specific page
router.get("/:id", async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const result = await db.select().from(pages).where(and(eq(pages.id, pageId), eq(pages.userId, req.user.userId))).limit(1);
    if (!result.length) return res.status(404).json({ error: "Page not found" });
    
    res.json({ page: result[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update page (auto-save)
router.put("/:id", async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const { title, slug, themePreset, themeOverrides, sections } = req.body;

    const existingPage = await db.select().from(pages).where(and(eq(pages.id, pageId), eq(pages.userId, req.user.userId))).limit(1);
    if (!existingPage.length) return res.status(404).json({ error: "Page not found" });

    // Ensure slug isn't taken by someone else
    if (slug && slug !== existingPage[0].slug) {
      const slugCheck = await db.select().from(pages).where(eq(pages.slug, slug));
      if (slugCheck.length > 0) return res.status(400).json({ error: "Slug already in use" });
    }

    const updated = await db.update(pages).set({
      title: title ?? existingPage[0].title,
      slug: slug ?? existingPage[0].slug,
      themePreset: themePreset ?? existingPage[0].themePreset,
      themeOverrides: typeof themeOverrides === "string" ? themeOverrides : (themeOverrides ? JSON.stringify(themeOverrides) : existingPage[0].themeOverrides),
      sections: typeof sections === "string" ? sections : (sections ? JSON.stringify(sections) : existingPage[0].sections),
      updatedAt: new Date()
    }).where(eq(pages.id, pageId)).returning();

    res.json({ page: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Publish
router.post("/:id/publish", async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const updated = await db.update(pages)
      .set({ status: "published", updatedAt: new Date() })
      .where(and(eq(pages.id, pageId), eq(pages.userId, req.user.userId)))
      .returning();
    if (!updated.length) return res.status(404).json({ error: "Page not found" });
    res.json({ page: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Unpublish
router.post("/:id/unpublish", async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const updated = await db.update(pages)
      .set({ status: "draft", updatedAt: new Date() })
      .where(and(eq(pages.id, pageId), eq(pages.userId, req.user.userId)))
      .returning();
    if (!updated.length) return res.status(404).json({ error: "Page not found" });
    res.json({ page: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
