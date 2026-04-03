import express from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db.js";
import { pages, contactSubmissions } from "../schema.js";

const router = express.Router();

// Get published page by slug
router.get("/pages/:slug", async (req, res) => {
  try {
    const result = await db.select().from(pages).where(and(eq(pages.slug, req.params.slug), eq(pages.status, "published"))).limit(1);
    if (!result.length) return res.status(404).json({ error: "Page not found" });
    
    res.json({ page: result[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Increment page views
router.post("/pages/:slug/view", async (req, res) => {
  try {
    const result = await db.select().from(pages).where(and(eq(pages.slug, req.params.slug), eq(pages.status, "published"))).limit(1);
    if (!result.length) return res.status(404).json({ error: "Page not found" });

    const page = result[0];
    await db.update(pages).set({ views: page.views + 1, updatedAt: new Date() }).where(eq(pages.id, page.id));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Submit contact form
router.post("/pages/:slug/contact", async (req, res) => {
  try {
    const result = await db.select().from(pages).where(and(eq(pages.slug, req.params.slug), eq(pages.status, "published"))).limit(1);
    if (!result.length) return res.status(404).json({ error: "Page not found" });

    const page = result[0];
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await db.insert(contactSubmissions).values({
      pageId: page.id,
      name,
      email,
      message,
      createdAt: new Date()
    });

    res.json({ success: true, message: "Message sent" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
