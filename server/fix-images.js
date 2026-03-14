const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const BASE_URL = "http://localhost:5000";
const uploadsDir = path.join(__dirname, "../uploads");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const productSchema = new mongoose.Schema({
  name: String,
  imageUrl: String
}, { strict: false });

const Product = mongoose.model("Product", productSchema);

async function fixImages() {
  const products = await Product.find();
  let updated = 0;

  for (const product of products) {
    if (product.imageUrl) {
      let filename = product.imageUrl;

      if (filename.startsWith("http")) {
        const parts = filename.split("/uploads/");
        filename = parts[1] || filename;
      }

      const filePath = path.join(uploadsDir, filename);

      // Use placeholder if file missing
      const newUrl = fs.existsSync(filePath)
        ? `${BASE_URL}/uploads/${filename}`
        : `${BASE_URL}/uploads/placeholder.png`;

      if (product.imageUrl !== newUrl) {
        product.imageUrl = newUrl;
        await product.save();
        updated++;
      }
    }
  }

  console.log(`✅ Finished. Updated ${updated} products with placeholder fallback.`);
  process.exit(0);
}

fixImages().catch(err => {
  console.error(err);
  process.exit(1);
});