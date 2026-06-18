import { v2 as cloudinary } from "cloudinary";

const defaultCloudinaryUrl = process.env.CLOUDINARY_URLS || "cloudinary://537287823387199:O6XsUc8hr6BfKhLOmkR28WwMEBU@dazs1exqq,cloudinary://573613413737429:nTk9Cn1hQ8t81lOTgcBcDJEaeq0@dey5qfznq";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { public_id, resource_type = 'image', accountIndex = 0 } = req.body;
    if (!public_id) {
      return res.status(400).json({ error: "Missing public_id" });
    }

    const cloudinaryUrlsStr = process.env.CLOUDINARY_URLS || defaultCloudinaryUrl;
    const urls = cloudinaryUrlsStr.split(",").map((s: string) => s.trim()).filter(Boolean);
    const selectedUrl = urls[accountIndex % urls.length] || urls[0];

    const match = selectedUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (!match) return res.status(500).json({ error: "Invalid URL" });
    const [, api_key, api_secret, cloud_name] = match;

    cloudinary.config({
      cloud_name, api_key, api_secret
    });
    
    const result = await cloudinary.uploader.destroy(public_id, { resource_type });
    res.status(200).json(result);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
}
