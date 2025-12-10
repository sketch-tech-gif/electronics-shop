const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/products  -> list all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products  -> create a product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error("POST /api/products error:", err);
    // Return detailed error message
    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      res.status(400).json({ message: `${field} already exists. Use a different value.` });
    } else if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message).join(", ");
      res.status(400).json({ message: messages });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

// GET /api/products/:id  -> single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("GET /api/products/:id error:", err.message);
    res.status(400).json({ message: "Invalid ID" });
  }
});

// PUT /api/products/:id  -> update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("PUT /api/products/:id error:", err);
    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      res.status(400).json({ message: `${field} already exists. Use a different value.` });
    } else if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message).join(", ");
      res.status(400).json({ message: messages });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

// DELETE /api/products/:id  -> delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE /api/products/:id error:", err.message);
    res.status(400).json({ message: "Invalid ID" });
  }
});

module.exports = router;
