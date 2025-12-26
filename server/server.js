const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const BASE_URL =
  process.env.BASE_URL || "https://electronics-shop-api-id3m.onrender.com";

// ---------------- Cloudinary config ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- Middleware ----------------
app.use(
  cors({
    origin: [
      "https://faith-electronics.onrender.com",
      "https://faith-electronics-admin.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Electronics Shop API is running");
});

// ---------------- MongoDB ----------------
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set in environment variables");
} else {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
    });
}

// ---------------- Product model ----------------
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
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

// ---------------- Multer + Cloudinary storage ----------------
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ---------------- Routes ----------------

// Image upload endpoint (returns Cloudinary URLs)
app.post("/api/upload", upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const filePaths = req.files.map((file) => file.path); // Cloudinary URLs
    res.json({ urls: filePaths });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Multer error handler
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add new product
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Update product
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------- TEMP: fix old /uploads URLs -------------
/**
 * IMPORTANT:
 * 1. Create Cloudinary URLs for each product image (by re-uploading them),
 *    then build a mapping from old filename -> Cloudinary URL.
 * 2. This endpoint will run ONCE to update MongoDB.
 */
app.post("/api/fix-image-urls", async (req, res) => {
  try {
    const uploadsPrefix =
      "https://electronics-shop-api-id3m.onrender.com/uploads/";

    // Map old filenames to the correct Cloudinary URLs
    // Example (you must fill this from your Cloudinary dashboard):
    const filenameToCloudinary = {
      // "1766649338792-1001533862.jpg":
      //   "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v.../dell-xp360.jpg",
      // "1766649367835-1001533869.jpg":
      //   "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v.../hp-elitebook.jpg",
      // ...
    };

    const products = await Product.find({
      imageUrl: { $regex: "^" + uploadsPrefix },
    });

    let updatedCount = 0;

    for (const product of products) {
      const fileName = product.imageUrl.replace(uploadsPrefix, "").trim();
      const newUrl = filenameToCloudinary[fileName];

      if (!newUrl) {
        // Skip if no mapping yet
        console.warn("No Cloudinary URL mapping for", fileName);
        continue;
      }

      product.imageUrl = newUrl;
      await product.save();
      updatedCount++;
    }

    res.json({
      totalWithUploads: products.length,
      updated: updatedCount,
      message:
        "Fill filenameToCloudinary mapping with real Cloudinary URLs, then call this endpoint once.",
    });
  } catch (err) {
    console.error("fix-image-urls error:", err);
    res.status(500).json({ error: "Failed to fix image URLs" });
  }
});

// ---------------- Start server ----------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`BASE_URL: ${BASE_URL}`);
});
