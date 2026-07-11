import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  createSupabaseRequestClient,
  getMissingSupabaseServerEnvKeys,
  isSupabaseServerConfigured,
  verifySupabaseUserRequest,
} from "./src/lib/supabase-server";

const authRouteRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return res.status(429).json({
      error: "RATE_LIMITED",
      message: "تم تجاوز الحد المسموح لمحاولات التحقق من الجلسة. يرجى الانتظار قليلاً ثم إعادة المحاولة.",
    });
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with a generous limit
  app.use(express.json({ limit: "10mb" }));

  app.get("/api/auth/session", authRouteRateLimiter, async (req, res) => {
    if (!isSupabaseServerConfigured()) {
      return res.status(503).json({
        error: "SUPABASE_SERVER_NOT_CONFIGURED",
        message: `إعداد Supabase الخادمي غير مكتمل. المتغيرات الناقصة: ${getMissingSupabaseServerEnvKeys().join("، ")}`,
      });
    }

    const { data: auth, error } = await verifySupabaseUserRequest(req);

    if (error || !auth) {
      return res.status(error?.status ?? 401).json({
        error: "UNAUTHORIZED",
        message: error?.message || "تعذر التحقق من جلسة المستخدم الحالية.",
      });
    }

    const supabase = createSupabaseRequestClient(auth);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({
        error: "USER_LOOKUP_FAILED",
        message: userError?.message || "تعذر جلب بيانات المستخدم الحالية من Supabase.",
      });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email ?? null,
      },
      claims: auth.userClaims,
    });
  });

  // Serve Vite in development, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
