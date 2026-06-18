import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Default values to include the provided key if env var isn't set
const defaultCloudinaryUrl = process.env.CLOUDINARY_URLS || "cloudinary://537287823387199:O6XsUc8hr6BfKhLOmkR28WwMEBU@dazs1exqq,cloudinary://573613413737429:nTk9Cn1hQ8t81lOTgcBcDJEaeq0@dey5qfznq";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/admin/cloudinary/signature", (req, res) => {
    try {
      const cloudinaryUrlsStr = process.env.CLOUDINARY_URLS || defaultCloudinaryUrl;
      const urls = cloudinaryUrlsStr.split(",").map(s => s.trim()).filter(Boolean);
      
      const sessionCount = parseInt(req.body.uploadCount || "0");
      const accountIndex = sessionCount % urls.length;
      const selectedUrl = urls[accountIndex];

      const match = selectedUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
      if (!match) {
        return res.status(500).json({ error: "Invalid CLOUDINARY_URL format" });
      }

      const [, api_key, api_secret, cloud_name] = match;

      const timestamp = Math.round((new Date).getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request({ timestamp }, api_secret);

      res.json({ timestamp, signature, cloud_name, api_key, accountIndex });
    } catch (error) {
      console.error("Signature error:", error);
      res.status(500).json({ error: "Failed to generate signature" });
    }
  });

  app.post("/api/admin/cloudinary/delete", async (req, res) => {
    try {
      const { public_id, resource_type = 'image', accountIndex = 0 } = req.body;
      if (!public_id) {
        return res.status(400).json({ error: "Missing public_id" });
      }

      const cloudinaryUrlsStr = process.env.CLOUDINARY_URLS || defaultCloudinaryUrl;
      const urls = cloudinaryUrlsStr.split(",").map(s => s.trim()).filter(Boolean);
      const selectedUrl = urls[accountIndex % urls.length] || urls[0];

      const match = selectedUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
      if (!match) return res.status(500).json({ error: "Invalid URL" });
      const [, api_key, api_secret, cloud_name] = match;

      cloudinary.config({
        cloud_name, api_key, api_secret
      });
      
      const result = await cloudinary.uploader.destroy(public_id, { resource_type });
      res.json(result);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
