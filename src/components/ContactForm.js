import React, { useState } from "react";

const FORM_ENDPOINT = "https://formspree.io/f/mqabbplz";
const teal = "#00ffe0";

const placeholderStyle = `
  ::placeholder { color: ${teal}; opacity: 1; }
  input, textarea { color-scheme: dark; }
`;

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target;
    const data = new FormData(form);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        setSent(true);
        form.reset();
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minWidth: 300,
        color: "#fff",
        fontFamily: "Poppins, Inter, Segoe UI, Arial, sans-serif"
      }}
      autoComplete="off"
    >
      <style>{placeholderStyle}</style>
      <label style={{ fontWeight: 700, fontSize: 18 }}>Contact Drum Sircle</label>
      <input
        type="text"
        name="name"
        required
        placeholder="Your Name"
        style={{
          background: "rgba(0,0,0,0.6)",
          border: `1.5px solid ${teal}`,
          color: "#fff",
          borderRadius: 9,
          padding: "12px 15px",
          fontSize: 16,
          outline: "none"
        }}
        autoComplete="off"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email"
        style={{
          background: "rgba(0,0,0,0.6)",
          border: `1.5px solid ${teal}`,
          color: "#fff",
          borderRadius: 9,
          padding: "12px 15px",
          fontSize: 16,
          outline: "none"
        }}
        autoComplete="off"
      />
      <textarea
        name="message"
        required
        maxLength={1000}
        placeholder="Your Message (max 1000 characters)"
        style={{
          background: "rgba(0,0,0,0.6)",
          border: `1.5px solid ${teal}`,
          color: "#fff",
          borderRadius: 9,
          padding: "12px 15px",
          fontSize: 16,
          outline: "none",
          minHeight: 120
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: teal,
          color: "#111",
          border: "none",
          borderRadius: 22,
          padding: "13px 0",
          fontWeight: 700,
          fontSize: 17,
          cursor: loading ? "wait" : "pointer",
          boxShadow: "0 0 12px #00ffe077",
          marginTop: 4
        }}
      >
        {loading ? "Sending..." : sent ? "Sent! Thank you!" : "Send"}
      </button>
      {error && <div style={{ color: "#f33", marginTop: 4 }}>{error}</div>}

      {/* Socials */}
      <div style={{display: "flex", gap: 20, justifyContent: "center", marginTop: 22}}>
        <a href="https://instagram.com/DrumSircle" target="_blank" rel="noopener noreferrer"
          style={{color: "#00ffe0", fontSize: 23, textDecoration: "none", display: "flex", alignItems: "center", gap: 6}}
          aria-label="Instagram"
        >
          <span style={{fontSize: 27}}>📷</span> IG
        </a>
        <a href="https://youtube.com/DrumSircle" target="_blank" rel="noopener noreferrer"
          style={{color: "#ff2ee8", fontSize: 23, textDecoration: "none", display: "flex", alignItems: "center", gap: 6}}
          aria-label="YouTube"
        >
          <span style={{fontSize: 27}}>▶️</span> YT
        </a>
      </div>
    </form>
  );
}
