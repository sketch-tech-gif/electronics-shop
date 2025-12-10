const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true, // e.g. "Phones", "Laptops"
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Optional sale price (e.g., site-specific selling price)
    salePrice: {
      type: Number,
      min: 0,
      default: null,
    },
    description: {
      type: String,
      trim: true,
    },
    specs: {
      type: String, // can change to object/array later
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);