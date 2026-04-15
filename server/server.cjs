// ✅ dotenv MUST be first before any other require
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const africastalking = require("africastalking")({
  apiKey: process.env.AT_API_KEY,
username: process.env.AT_USERNAME,});

const sms = africastalking.SMS;

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
// Structure: { [email/phone]: { otp, expiresAt, purpose: "register" | "reset" } }
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

// ── HELPER: Send OTP via SMS ──────────────────────────────────────────────────
async function sendSmsOtp(phone, otp, purpose) {
  const isReset = purpose === "reset";
  await sms.send({
    to: [phone],
    message: isReset
      ? `Your TechStore password reset code is ${otp}. Expires in 5 minutes.`
      : `Your TechStore verification code is ${otp}. Expires in 5 minutes.`,
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
    var { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }

    // ── STRICT DUPLICATE CHECK ────────────────────────────────────────────────
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingEmail) {
        return res.status(400).json({ error: "An account with this email already exists. Please sign in." });
      }
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone) {
        return res.status(400).json({ error: "An account with this phone number already exists. Please sign in." });
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    var key = email || phone;
    var otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[key] = {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      purpose: "register",
    };

    if (phone) {
      try {
        await sendSmsOtp(phone, otp, "register");
        console.log("✅ SMS sent to", phone);
      } catch (smsError) {
        console.error("❌ SMS error:", smsError.message);
      }
    }

    if (email) {
      try {
        await sendEmailOtp(email, otp, "register");
        console.log("✅ Email sent to", email);
      } catch (mailError) {
        console.error("❌ Email error:", mailError.message);
        return res.status(500).json({ error: "Failed to send email. Check EMAIL_USER and EMAIL_PASS in .env" });
      }
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
    var { name, email, phone, password, otp } = req.body;

    if (!name || (!email && !phone) || !password || !otp) {
      return res.status(400).json({ error: "All fields including OTP are required" });
    }

    var key = email || phone;

    // ── STRICT DUPLICATE CHECK (second layer) ─────────────────────────────────
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingEmail) {
        return res.status(400).json({ error: "An account with this email already exists. Please sign in." });
      }
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone) {
        return res.status(400).json({ error: "An account with this phone number already exists. Please sign in." });
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    if (!otpStore[key]) {
      return res.status(400).json({ error: "No OTP found. Please request a new one." });
    }

    if (otpStore[key].purpose !== "register") {
      return res.status(400).json({ error: "Invalid OTP. Please request a new one." });
    }

    if (otpStore[key].otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    if (Date.now() > otpStore[key].expiresAt) {
      delete otpStore[key];
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    delete otpStore[key];

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    var hashed = await bcrypt.hash(password, 12);

    var user = await User.create({
      name: name,
      email: email ? email.toLowerCase().trim() : "",
      phone: phone ? phone.trim() : "",
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
    var { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }

    var user = null;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else if (phone) {
      user = await User.findOne({ phone: phone.trim() });
    }

    if (!user) {
      return res.status(404).json({ error: "No account found with that email or phone number." });
    }

    var key = email || phone;
    var otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[key] = {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      purpose: "reset",
    };

    if (phone) {
      try {
        await sendSmsOtp(phone, otp, "reset");
        console.log("✅ Reset SMS sent to", phone);
      } catch (smsError) {
        console.error("❌ SMS error:", smsError.message);
      }
    }

    if (email) {
      try {
        await sendEmailOtp(email, otp, "reset");
        console.log("✅ Reset email sent to", email);
      } catch (mailError) {
        console.error("❌ Email error:", mailError.message);
        return res.status(500).json({ error: "Failed to send reset email. Check EMAIL_USER and EMAIL_PASS in .env" });
      }
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
    var { email, phone, otp } = req.body;

    if (!otp || (!email && !phone)) {
      return res.status(400).json({ error: "Email/phone and OTP are required" });
    }

    var key = email || phone;

    if (!otpStore[key]) {
      return res.status(400).json({ error: "No OTP found. Please request a new one." });
    }

    if (otpStore[key].purpose !== "reset") {
      return res.status(400).json({ error: "Invalid OTP. Please request a password reset." });
    }

    if (otpStore[key].otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    if (Date.now() > otpStore[key].expiresAt) {
      delete otpStore[key];
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    var user = email
      ? await User.findOne({ email: email.toLowerCase().trim() })
      : await User.findOne({ phone: phone.trim() });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Clear OTP after successful verification
    delete otpStore[key];

    // Issue a short-lived reset token valid for 10 minutes
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
