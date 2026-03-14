const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || "https://faith-electronics.onrender.com";

// ---------------- Cloudinary config ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- Middleware ----------------
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Serve local uploads folder if needed
app.use("/uploads", express.static("uploads"));

// ---------------- Health Check ----------------
app.get("/", (req, res) => {
  res.json({ message: "Electronics Shop API running ✅" });
});

// ---------------- MongoDB Connection ----------------
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set in .env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection FAILED:", error.message);
    process.exit(1);
  }
};

// ---------------- Product Model ----------------
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    description: { type: String, trim: true },
    specs: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    salePrice: { type: Number, min: 0, default: null },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

// ---------------- Cloudinary Storage ----------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "faith-electronics",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ---------------- API Routes ----------------

// Upload product images
app.post("/api/upload", upload.array("images", 5), (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: "No files uploaded" });
    const urls = req.files.map((file) => file.path);
    res.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().lean();

    // Placeholder image if product has no image
    const PLACEHOLDER_IMAGE =
      "https://res.cloudinary.com/dr2u0jpvn/image/upload/v1773492892/placeholder_a1dh9w.jpg";

    const productsWithImages = products.map((p) => ({
      ...p,
      imageUrl: p.imageUrl || PLACEHOLDER_IMAGE,
    }));

    res.json(productsWithImages);
  } catch (error) {
    console.error("Products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create new product
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Update product
app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- START SERVER ----------------
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 BASE_URL: ${BASE_URL}`);
  });
}).catch((error) => {
  console.error("Server startup failed:", error);
});