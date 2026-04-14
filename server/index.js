const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const passport = require("passport");
require("./passport");

const app = express();
const PORT = process.env.PORT || 5000;

const BASE_URL = "https://electronics-shop-api-id3m.onrender.com";

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// =====================
// AUTH CONFIG
// =====================
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// =====================
// OTP STORE (in-memory)
// Use Redis in production for multi-instance deployments
// =====================
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

// =====================
// MONGODB CONNECT
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// =====================
// USER MODEL
// =====================
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, sparse: true, unique: true },
    phone:    { type: String, sparse: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    role:     { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// =====================
// AUTH ROUTES
// =====================

// ── SEND OTP ──────────────────────────────────────────────────────────────────
app.post("/api/auth/send-otp", async (req, res) => {
  const { type, email, phone } = req.body;

  if (!type || (!email && !phone)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if already registered
  try {
    if (type === "email" && email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: "Email is already registered" });
    }
    if (type === "phone" && phone) {
      const exists = await User.findOne({ phone });
      if (exists) return res.status(400).json({ error: "Phone number is already registered" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }

  const otp       = generateOTP();
  const key       = email || phone;
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(key, { otp, expiresAt });

  // ── Send via Email ──────────────────────────────────────────────────────────
  if (type === "email") {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from:    `"TechStore" <${process.env.EMAIL_USER}>`,
        to:      email,
        subject: "Your TechStore Verification Code",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
            <div style="text-align:center;margin-bottom:24px">
              <div style="background:#1d4ed8;display:inline-block;padding:12px 20px;border-radius:10px">
                <span style="color:white;font-size:20px;font-weight:800;letter-spacing:1px">TechStore</span>
              </div>
            </div>
            <h2 style="color:#111827;font-size:20px;margin-bottom:8px">Verify your email address</h2>
            <p style="color:#6b7280;font-size:14px;margin-bottom:24px">
              Use the code below to complete your registration. This code expires in <strong>10 minutes</strong>.
            </p>
            <div style="background:#f3f4f6;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px">
              <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#1d4ed8">${otp}</span>
            </div>
            <p style="color:#9ca3af;font-size:12px;text-align:center">
              If you did not request this, you can safely ignore this email.
            </p>
          </div>
        `,
      });

      return res.json({ message: "OTP sent to email" });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ error: "Failed to send email. Check your EMAIL_USER and EMAIL_PASS environment variables." });
    }
  }

  // ── Send via SMS (Twilio) ───────────────────────────────────────────────────
  if (type === "phone") {
    // Uncomment and configure when you have Twilio credentials:
    // try {
    //   const twilio = require("twilio");
    //   const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    //   await client.messages.create({
    //     body: `Your TechStore verification code is: ${otp}. Expires in 10 minutes.`,
    //     from: process.env.TWILIO_PHONE,
    //     to:   phone,
    //   });
    //   return res.json({ message: "OTP sent to phone" });
    // } catch (err) {
    //   console.error("SMS send error:", err);
    //   return res.status(500).json({ error: "Failed to send SMS" });
    // }

    // Temporary: log to console until Twilio is configured
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
    return res.json({ message: "OTP sent to phone (check server logs in dev)" });
  }

  return res.status(400).json({ error: "Invalid type. Use 'email' or 'phone'" });
});

// ── REGISTER (verifies OTP then creates user) ─────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    if (!name || !password || !otp || (!email && !phone)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const key    = email || phone;
    const record = otpStore.get(key);

    // OTP checks
    if (!record) {
      return res.status(400).json({ error: "OTP not found. Please request a new code." });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(key);
      return res.status(400).json({ error: "OTP expired. Please request a new code." });
    }
    if (record.otp !== String(otp)) {
      return res.status(400).json({ error: "Invalid code. Please try again." });
    }

    // OTP is valid — consume it
    otpStore.delete(key);

    // Check duplicate again (race condition safety)
    if (email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: "Email is already registered" });
    }
    if (phone) {
      const exists = await User.findOne({ phone });
      if (exists) return res.status(400).json({ error: "Phone number is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email:      email    || undefined,
      phone:      phone    || undefined,
      password:   hashedPassword,
      isVerified: true,
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET PROFILE (protected) ───────────────────────────────────────────────────
app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ── GOOGLE OAUTH CALLBACK ─────────────────────────────────────────────────────
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    res.redirect(`http://localhost:5173/login?token=${user.token}`);
  }
);

// ── GOOGLE LOGIN (from frontend token) ────────────────────────────────────────
app.post("/api/auth/google", async (req, res) => {
  try {
    const { email, name } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, isVerified: true });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// PRODUCT SYSTEM
// =====================
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  sku:         { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  brand:       String,
  description: String,
  specs:       String,
  imageUrl:    String,
  salePrice:   Number,
  inStock:     { type: Boolean, default: true },
});

const Product = mongoose.model("Product", productSchema);

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/api/upload", upload.array("images", 5), (req, res) => {
  const filePaths = req.files.map(
    (file) => `${BASE_URL}/uploads/${file.filename}`
  );
  res.json({ urls: filePaths });
});

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.put("/api/products/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// =====================
// SERVER START
// =====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`BASE_URL: ${BASE_URL}`);
});