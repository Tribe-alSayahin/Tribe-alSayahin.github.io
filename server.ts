import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with a generous limit
  app.use(express.json({ limit: "10mb" }));

  // AI Brand Image Generation Route
  app.post("/api/generate-wasm", async (req, res) => {
    try {
      const { camelType, brandId, scene, customPrompt } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "API_KEY_MISSING",
          message: "مفتاح واجهة برمجة التطبيقات (API Key) لـ Gemini غير متوفر. يرجى تفعيله من قائمة الإعدادات > الأسرار (Settings > Secrets) للتمكن من توليد الصور بالذكاء الاصطناعي.",
        });
      }

      // Initialize GoogleGenAI client on-demand (lazy)
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Map brand IDs to precise English visual descriptions for Gemini Imagen
      let brandVisual = "a custom hot brand marking shaped like an open gate (two vertical lines connected by a horizontal bar on top)";
      if (brandId === "classic") {
        brandVisual = "a clean, classic heritage brand mark shaped like an open horizontal bar with two vertical lines hanging from its ends (shaped like an open gate [ or a goalpost) clearly visible on its neck";
      } else if (brandId === "mutraq") {
        brandVisual = "a brand mark shaped like an open gate, with a single additional standalone vertical line (mutraq) placed next to it, branded cleanly on its left neck";
      } else if (brandId === "mighzal") {
        brandVisual = "a brand mark shaped like an open gate with an adjacent spindle mark (shaped like an upside-down T or two crossed lines) high on its neck";
      } else if (brandId === "damah") {
        brandVisual = "a brand mark shaped like an open gate with a small circular dot (damah/tear) branded directly underneath it on its lower neck";
      } else if (brandId === "arqah") {
        brandVisual = "a brand mark shaped like an open gate accompanied by a prominent crossed mark (like a plus sign or cross +) next to it on its middle neck";
      } else if (brandId === "kabsh") {
        brandVisual = "a rare double-gate brand marking consisting of two interlocking open gates (the 'Kabsh' double-gate sign) branded on its shoulder";
      }

      // Construct a high-fidelity image prompt
      const prompt = `A highly detailed, professional award-winning photograph of a majestic, authentic Arabian camel (${camelType}) in the vast, mesmerizing desert of Saudi Arabia during ${scene}. On its left neck, there is a visible, clean, traditional tribal brand (Wasm) depicting: ${brandVisual}. The camel's fur texture, majestic posture, and the deep desert sandy dunes in the background are rendered in photorealistic clarity. Beautiful natural golden-hour lighting, high contrast, cinematic composition, National Geographic style. Absolutely no text, watermarks, or artificial borders in the image. ${customPrompt ? `Additional details: ${customPrompt}` : ""}`;

      console.log("Generating image with prompt:", prompt);

      // Call Gemini Image Generation model (using the standard lite image model)
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let base64Image = "";
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      }

      if (!base64Image) {
        return res.status(500).json({
          error: "GENERATION_FAILED",
          message: "لم يتم العثور على بيانات الصورة في استجابة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
        });
      }

      return res.json({
        success: true,
        imageUrl: `data:image/png;base64,${base64Image}`,
        promptUsed: prompt,
      });

    } catch (error: any) {
      console.error("Error generating brand image:", error);
      
      const errorMessage = error.message || "";
      const isQuotaExceeded = 
        error.status === 429 || 
        error.statusCode === 429 ||
        error.status === "RESOURCE_EXHAUSTED" ||
        errorMessage.includes("429") || 
        errorMessage.includes("quota") || 
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        (error.error && (error.error.code === 429 || error.error.status === "RESOURCE_EXHAUSTED"));

      if (isQuotaExceeded) {
        return res.status(429).json({
          error: "QUOTA_EXCEEDED",
          message: "عذراً، لقد تم تجاوز الحصة المجانية المتاحة لتوليد الصور اليومية من جوجل (Quota Exceeded / 429). يرجى استخدام 'الاستعراض الرقمي المتجهي الفوري' مجاناً وبدون أي قيود، أو تفعيل مفتاح Gemini ذو الخطة المدفوعة من قائمة الإعدادات (Settings > Secrets) بالأعلى.",
        });
      }

      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: error.message || "حدث خطأ غير متوقع أثناء توليد الصورة بالذكاء الاصطناعي.",
      });
    }
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
