// FILE: models/Product.js
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
      required: true,
      trim: true,
      // e.g. "Phones", "Laptops", "Tablets", "Accessories", "Audio", "Cameras", "Gaming"
    },
    brand: {
      type: String,
      trim: true,
    },

    // ── Pricing (always stored in Kenya Shillings) ────────────────────────────
    currency: {
      type: String,
      default: "KES",       // ← default is KES; never changes for Vantix Kenya
      enum: ["KES"],        // lock it to KES only — remove enum if you go multi-currency later
      uppercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      // Store in KES. Example: 154999 means KES 154,999
    },
    salePrice: {
      type: Number,
      min: 0,
      default: null,
      // Optional discounted price in KES
    },

    // ── Product details ───────────────────────────────────────────────────────
    description: {
      type: String,
      trim: true,
    },
    specs: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },

    // ── Inventory & display ───────────────────────────────────────────────────
    inStock: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      enum: ["Best Seller", "Top Rated", "New", "Sale", "Hot Deal", "Popular", "In Stock", "Pro Pick", "Editor's Choice", null],
      default: null,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ── Virtual: discount percentage ──────────────────────────────────────────────
productSchema.virtual("discountPercent").get(function () {
  if (this.salePrice && this.price > 0) {
    return Math.round((1 - this.salePrice / this.price) * 100);
  }
  return 0;
});

// ── Helper: format price as "KES 154,999" ────────────────────────────────────
productSchema.methods.formattedPrice = function () {
  return "KES " + this.price.toLocaleString("en-KE");
};
productSchema.methods.formattedSalePrice = function () {
  if (!this.salePrice) return null;
  return "KES " + this.salePrice.toLocaleString("en-KE");
};

module.exports = mongoose.model("Product", productSchema);