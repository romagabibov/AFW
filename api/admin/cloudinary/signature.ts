import { v2 as cloudinary } from "cloudinary";

const defaultCloudinaryUrl = process.env.CLOUDINARY_URLS || "cloudinary://537287823387199:O6XsUc8hr6BfKhLOmkR28WwMEBU@dazs1exqq,cloudinary://573613413737429:nTk9Cn1hQ8t81lOTgcBcDJEaeq0@dey5qfznq";

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const cloudinaryUrlsStr = process.env.CLOUDINARY_URLS || defaultCloudinaryUrl;
    const urls = cloudinaryUrlsStr.split(",").map((s: string) => s.trim()).filter(Boolean);
    
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

    res.status(200).json({ timestamp, signature, cloud_name, api_key, accountIndex });
  } catch (error) {
    console.error("Signature error:", error);
    res.status(500).json({ error: "Failed to generate signature" });
  }
}
