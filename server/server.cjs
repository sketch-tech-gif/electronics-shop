// ✅ dotenv MUST be first before any other require
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "techstore_secret_key_2024";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", function (req, res) {
  res.json({ message: "TechStore API running OK" });
});

var connectDB = async function () {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB Connection FAILED:", error.message);
  }
};

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(
  "360074851790-0lr673nbbl2mj2jmb2fjb2tdkisbq22c.apps.googleusercontent.com"
);

var userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

var User = mongoose.model("User", userSchema);

// ── OTP STORE ─────────────────────────────────────────────────────────────────
var otpStore = {};

// ── HELPER: Send OTP via Email ────────────────────────────────────────────────
async function sendEmailOtp(email, otp, purpose) {
  const isReset = purpose === "reset";
  await transporter.sendMail({
    from: `"TechStore" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: isReset ? "Reset Your Password" : "Your Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #1a73e8;">TechStore ${isReset ? "Password Reset" : "Verification"}</h2>
        <p>${isReset ? "Use the code below to reset your password." : "Use the code below to verify your account."} It expires in <strong>5 minutes</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #333; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 13px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}

// ── GOOGLE AUTH ───────────────────────────────────────────────────────────────
app.post("/api/auth/google", async function (req, res) {
  try {
    var email = req.body.email;
    var name = req.body.name;

    if (!email) return res.status(400).json({ error: "Invalid Google token" });

    var user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email: email,
        phone: "",
        password: await bcrypt.hash(Math.random().toString(36) + Date.now(), 12),
      });
    }

    var token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("❌ Google auth error:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
});

// ── SEND OTP (Registration) ───────────────────────────────────────────────────
app.post("/api/auth/send-otp", async function (req, res) {
  try {
    var { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({ error: "An account with this email already exists. Please sign in." });
    }

    var otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      purpose: "register",
    };

    try {
      await sendEmailOtp(email, otp, "register");
      console.log("✅ Email sent to", email);
    } catch (mailError) {
      console.error("❌ Email error:", mailError.message);
      return res.status(500).json({ error: "Failed to send email. Check EMAIL_USER and EMAIL_PASS in .env" });
    }

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ send-otp error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ── REGISTER ──────────────────────────────────────────────────────────────────
app.post("/api/auth/register", async function (req, res) {
  try {
    var { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ error: "All fields including OTP are required" });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({ error: "An account with this email already exists. Please sign in." });
    }

    if (!otpStore[email]) {
      return res.status(400).json({ error: "No OTP found. Please request a new one." });
    }

    if (otpStore[email].purpose !== "register") {
      return res.status(400).json({ error: "Invalid OTP. Please request a new one." });
    }

    if (otpStore[email].otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    if (Date.now() > otpStore[email].expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    delete otpStore[email];

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    var hashed = await bcrypt.hash(password, 12);

    var user = await User.create({
      name: name,
      email: email.toLowerCase().trim(),
      phone: "",
      password: hashed,
    });

    var token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("❌ register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ── FORGOT PASSWORD — STEP 1: Send Reset OTP ─────────────────────────────────
app.post("/api/auth/forgot-password", async function (req, res) {
  try {
    var { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    var user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ error: "No account found with that email." });
    }

    var otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      purpose: "reset",
    };

    try {
      await sendEmailOtp(email, otp, "reset");
      console.log("✅ Reset email sent to", email);
    } catch (mailError) {
      console.error("❌ Email error:", mailError.message);
      return res.status(500).json({ error: "Failed to send reset email. Check EMAIL_USER and EMAIL_PASS in .env" });
    }

    res.json({ success: true, message: "Password reset OTP sent successfully" });
  } catch (err) {
    console.error("❌ forgot-password error:", err);
    res.status(500).json({ error: "Failed to send reset OTP" });
  }
});

// ── FORGOT PASSWORD — STEP 2: Verify Reset OTP ───────────────────────────────
app.post("/api/auth/verify-reset-otp", async function (req, res) {
  try {
    var { email, otp } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    if (!otpStore[email]) {
      return res.status(400).json({ error: "No OTP found. Please request a new one." });
    }

    if (otpStore[email].purpose !== "reset") {
      return res.status(400).json({ error: "Invalid OTP. Please request a password reset." });
    }

    if (otpStore[email].otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    if (Date.now() > otpStore[email].expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    var user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    delete otpStore[email];

    var resetToken = jwt.sign(
      { id: user._id, purpose: "reset" },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({ success: true, resetToken: resetToken });
  } catch (err) {
    console.error("❌ verify-reset-otp error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
});

// ── FORGOT PASSWORD — STEP 3: Set New Password ───────────────────────────────
app.post("/api/auth/reset-password", async function (req, res) {
  try {
    var { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: "Reset token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    var decoded;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Reset link has expired. Please start over." });
    }

    if (decoded.purpose !== "reset") {
      return res.status(401).json({ error: "Invalid reset token." });
    }

    var hashed = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    console.log("✅ Password reset for user", decoded.id);

    res.json({ success: true, message: "Password reset successfully. You can now sign in." });
  } catch (err) {
    console.error("❌ reset-password error:", err);
    res.status(500).json({ error: "Password reset failed" });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", async function (req, res) {
  try {
    var email = req.body.email;
    var password = req.body.password;

    var user = await User.findOne({
      $or: [{ email: email }, { phone: email }],
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    var match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    var token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(PORT, "0.0.0.0", function () {
  console.log("Server running on port " + PORT);
});

connectDB();