const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Base URL for this API (used when building full image URLs)
const BASE_URL =
  process.env.BASE_URL || "https://electronics-shop-api-id3m.onrender.com";

// Middleware
app.use(cors());
app.use(express.json());

// Simple health route (so / works on Render)
app.get("/", (req, res) => {
  res.send("Electronics Shop API is running");
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images as static files
app.use("/uploads", express.static(uploadsDir));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: String,
  description: String,
  specs: String,
  imageUrl: String,
  salePrice: Number,
  inStock: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", productSchema);

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Image upload endpoint
app.post("/api/upload", upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Build full HTTPS URLs for each uploaded file
    const filePaths = req.files.map(
      (file) => `${BASE_URL}/uploads/${file.filename}`
    );

    res.json({ urls: filePaths });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// FIX IMAGE URLS ROUTE - FIXES localhost references in DB
app.post("/api/fix-image-urls", async (req, res) => {
  try {
    // Find products where imageUrl still has localhost
    const products = await Product.find({ imageUrl: /localhost/ });

    let updated = 0;
    for (const product of products) {
      if (product.imageUrl && product.imageUrl.includes("localhost")) {
        product.imageUrl = product.imageUrl.replace(
          /http:\/\/localhost:\d+/g,
          BASE_URL
        );
        await product.save();
        updated++;
      }
    }

    res.json({
      success: true,
      message: `Fixed ${updated} product image URLs`,
      baseUrl: BASE_URL,
      totalChecked: products.length,
    });
  } catch (err) {
    console.error("Fix image URLs error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all products - fix image URLs on the fly
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();

    const fixedProducts = products.map((product) => {
      const productObj = product.toObject();

      if (productObj.imageUrl) {
        // If imageUrl is just a filename or relative path, prepend BASE_URL
        if (!productObj.imageUrl.startsWith("http")) {
          productObj.imageUrl = `${BASE_URL}/uploads/${productObj.imageUrl}`;
        }
      }

      return productObj;
    });

    res.json(fixedProducts);
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

// Catch multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`BASE_URL: ${BASE_URL}`);
});
