import express from "express";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import pagesRoutes from "./routes/pages.js";
import publicRoutes from "./routes/public.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Allow cross-origin if needed

// We hook the API endpoints. Since netlify.toml redirects /api/* to /.netlify/functions/api/*,
// our server sees the path as /api/... Let's prefix routes appropriately.
const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/pages", pagesRoutes);
apiRouter.use("/public", publicRoutes);

// Under Netlify Functions this is required to match our router
app.use("/api", apiRouter);

// Fallback for unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: "API route not found", path: req.path });
});

// We must export the handler
export const handler = serverless(app);
