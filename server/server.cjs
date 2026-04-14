const africastalking = require("africastalking")({
  apiKey: process.env.AT_API_KEY,
  username: "sandbox", // change to your username in production
});

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

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

app.get("/", function(req, res) {
  res.json({ message: "TechStore API running OK" });
});

var connectDB = async function() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB Connection FAILED:", error.message);
  }
};

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client("360074851790-0lr673nbbl2mj2jmb2fjb2tdkisbq22c.apps.googleusercontent.com");

var userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: "" },
  phone: { type: String, trim: true, default: "" },
  password: { type: String, required: true },
}, { timestamps: true });

var User = mongoose.model("User", userSchema);

// ── OTP STORE ─────────────────────────────
var otpStore = {};

// ── GOOGLE AUTH ───────────────────────────
app.post("/api/auth/google", async function(req, res) {
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

    var token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });

  } catch (error) {
    res.status(500).json({ error: "Google authentication failed" });
  }
});

// ── SEND OTP ─────────────────────────────
app.post("/api/auth/send-otp", async function(req, res) {
  try {
    var { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }

    var key = email || phone;
    var otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[key] = {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    // 📱 SEND SMS
    if (phone) {
      try {
        await sms.send({
          to: [phone],
          message: `Your TechStore verification code is ${otp}`,
        });
      } catch (smsError) {
        console.log("SMS error:", smsError.message);
      }
    }

    // 📧 SEND EMAIL
    if (email) {
      try {
        await transporter.sendMail({
          from: `"TechStore" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Your Verification Code",
          html: `
            <h2>TechStore Verification</h2>
            <p>Your OTP code is:</p>
            <h1>${otp}</h1>
            <p>This code expires in 5 minutes.</p>
          `,
        });
      } catch (mailError) {
        console.log("Email error:", mailError.message);
      }
    }

    console.log("OTP for", key, ":", otp);

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ── REGISTER ─────────────────
app.post("/api/auth/register", async function(req, res) {
  try {
    var { name, email, phone, password, otp } = req.body;

    if (!name || (!email && !phone) || !password || !otp) {
      return res.status(400).json({ error: "All fields including OTP are required" });
    }

    var key = email || phone;

    if (!otpStore[key]) {
      return res.status(400).json({ error: "No OTP found. Request again." });
    }

    if (otpStore[key].otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > otpStore[key].expiresAt) {
      delete otpStore[key];
      return res.status(400).json({ error: "OTP expired" });
    }

    delete otpStore[key];

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    var exists = await User.findOne({
      $or: [
        { email: email || null },
        { phone: phone || null }
      ]
    });

    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    var hashed = await bcrypt.hash(password, 12);

    var user = await User.create({
      name: name,
      email: email || "",
      phone: phone || "",
      password: hashed
    });

    var token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });

  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// ── LOGIN ─────────────────────────────
app.post("/api/auth/login", async function(req, res) {
  try {
    var email = req.body.email;
    var password = req.body.password;

    var user = await User.findOne({
      $or: [{ email: email }, { phone: email }]
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    var match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    var token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });

  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(PORT, "0.0.0.0", function() {
  console.log("Server running on port " + PORT);
});

connectDB();