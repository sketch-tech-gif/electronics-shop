// ContactPage.jsx
// Replace your existing contact/help page with this component.
// Setup required: npm install @emailjs/browser
// Then go to https://emailjs.com, create a free account,
// and replace the 3 placeholders below with your Service ID, Template ID, and Public Key.

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

// ─── EMAILJS CONFIG ────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. "AbCdEfGhIjKlMn"
// ───────────────────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = "254722116713"; // no + sign for wa.me links

export default function ContactPage() {
  const formRef = useRef();
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      formRef.current.reset();
      setSubject("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div style={styles.page}>
      {/* ── LEFT: Contact Info ─────────────────────────────────────── */}
      <div style={styles.infoCol}>

        {/* Office */}
        <InfoCard icon="📍" title="Our Office">
          <p>Vantix Kenya</p>
          <p>Imenti House, Moi Avenue</p>
          <p>Nairobi CBD, Nairobi, Kenya</p>
        </InfoCard>

        {/* Phone */}
        <InfoCard icon="📞" title="Phone">
          <p>+254 722 116 713</p>
          <p style={styles.muted}>Mon–Sat, 8am–8pm</p>
        </InfoCard>

        {/* Email */}
        <InfoCard icon="✉️" title="Email">
          <a href="mailto:sketchtechsolutiona@gmail.com" style={styles.link}>
            sketchtechsolutiona@gmail.com
          </a>
        </InfoCard>

        {/* Working Hours */}
        <InfoCard icon="🕐" title="Working Hours">
          <p>Monday – Friday: 8am – 8pm</p>
          <p>Saturday: 9am – 6pm</p>
          <p>Sunday: 10am – 4pm</p>
        </InfoCard>

        {/* Follow Us + WhatsApp */}
        <InfoCard icon="🌐" title="Follow Us">
          <div style={styles.socialRow}>
            <SocialBtn href="https://facebook.com" label="Facebook" bg="#1877F2" icon={fbSvg} />
            <SocialBtn href="https://instagram.com" label="Instagram" bg="#E1306C" icon={igSvg} />
            <SocialBtn href="https://tiktok.com" label="TikTok" bg="#000" icon={ttSvg} />
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Vantix%20Kenya%2C%20I%20need%20help%20with...`}
            target="_blank"
            rel="noreferrer"
            style={styles.whatsappBtn}
          >
            {waSvg}
            Chat on WhatsApp
          </a>
        </InfoCard>
      </div>

      {/* ── RIGHT: Contact Form ─────────────────────────────────────── */}
      <div style={styles.formCol}>
        <h2 style={styles.formTitle}>Send us a message</h2>

        <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
          {/* Hidden field so EmailJS knows where to send */}
          <input type="hidden" name="to_email" value="sketchtechsolutiona@gmail.com" />

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name <span style={styles.req}>*</span></label>
              <input name="from_name" required placeholder="John Doe" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email Address <span style={styles.req}>*</span></label>
              <input name="reply_to" type="email" required placeholder="you@example.com" style={styles.input} />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Subject <span style={styles.req}>*</span></label>
            <select
              name="subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ ...styles.input, ...styles.select }}
            >
              <option value="" disabled>Select a subject</option>
              <option>Order Inquiry</option>
              <option>Product Question</option>
              <option>Returns & Refunds</option>
              <option>Technical Support</option>
              <option>Other</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Message <span style={styles.req}>*</span></label>
            <textarea
              name="message"
              required
              rows={6}
              placeholder="Tell us how we can help..."
              style={{ ...styles.input, resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              ...styles.submitBtn,
              opacity: status === "sending" ? 0.7 : 1,
              cursor: status === "sending" ? "not-allowed" : "pointer",
            }}
          >
            {status === "sending" ? "Sending…" : "Send Message →"}
          </button>

          {status === "success" && (
            <p style={styles.successMsg}>✅ Message sent! We'll get back to you soon.</p>
          )}
          {status === "error" && (
            <p style={styles.errorMsg}>
              ❌ Something went wrong. Please email us directly at{" "}
              <a href="mailto:sketchtechsolutiona@gmail.com" style={styles.link}>
                sketchtechsolutiona@gmail.com
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* ── Helper components ─────────────────────────────────────────────────────── */
function InfoCard({ icon, title, children }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardIcon}>{icon}</span>
        <strong>{title}</strong>
      </div>
      <div style={styles.cardBody}>{children}</div>
    </div>
  );
}

function SocialBtn({ href, label, bg, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      style={{ ...styles.socialIcon, background: bg }}
    >
      {icon}
    </a>
  );
}

/* ── Inline SVGs ───────────────────────────────────────────────────────────── */
const waSvg = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const fbSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const igSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const ttSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

/* ── Styles ────────────────────────────────────────────────────────────────── */
const styles = {
  page: {
    display: "flex",
    gap: 32,
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 24px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#1a1a2e",
    flexWrap: "wrap",
  },
  infoCol: { flex: "0 0 320px", display: "flex", flexDirection: "column", gap: 16 },
  formCol: { flex: 1, minWidth: 300, background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" },
  card: { background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
  cardHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontWeight: 600, fontSize: 15 },
  cardIcon: { fontSize: 20 },
  cardBody: { paddingLeft: 30, fontSize: 14, color: "#555", lineHeight: "1.8" },
  muted: { color: "#999", fontSize: 13 },
  link: { color: "#3b5bdb", textDecoration: "none", wordBreak: "break-all" },
  socialRow: { display: "flex", gap: 10, marginBottom: 14 },
  socialIcon: { width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" },
  whatsappBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#25D366", color: "#fff", fontWeight: 600, fontSize: 14,
    borderRadius: 8, padding: "10px 16px", textDecoration: "none",
    transition: "background 0.2s",
  },
  formTitle: { fontSize: 22, fontWeight: 700, marginBottom: 24, color: "#1a1a2e" },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  row: { display: "flex", gap: 16, flexWrap: "wrap" },
  field: { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 180 },
  label: { fontSize: 13, fontWeight: 600, color: "#333" },
  req: { color: "#e03131" },
  input: {
    padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd",
    fontSize: 14, outline: "none", transition: "border-color 0.2s",
    fontFamily: "inherit", width: "100%", boxSizing: "border-box",
  },
  select: { appearance: "auto" },
  submitBtn: {
    background: "#3b5bdb", color: "#fff", fontWeight: 700, fontSize: 15,
    border: "none", borderRadius: 10, padding: "14px 24px", cursor: "pointer",
    transition: "background 0.2s",
  },
  successMsg: { color: "#2f9e44", fontWeight: 500, marginTop: 4 },
  errorMsg: { color: "#e03131", fontWeight: 500, marginTop: 4 },
};