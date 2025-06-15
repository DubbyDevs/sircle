import React, { useState } from "react";
import "./Contact.css";

function getRandomMath() {
  // Random 5-15 plus 1-9
  const a = Math.floor(Math.random() * 11) + 5;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, result: a + b };
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", captcha: "" });
  const [math, setMath] = useState(getRandomMath());
  const [charCount, setCharCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "message") setCharCount(value.length);
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    // Validate
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("All fields are required.");
      return;
    }
    if (form.message.length > 1000) {
      setError("Message too long.");
      return;
    }
    if (parseInt(form.captcha, 10) !== math.result) {
      setError("Incorrect captcha answer.");
      setMath(getRandomMath());
      setForm({ ...form, captcha: "" });
      return;
    }
    // Save to localStorage
    const prev = JSON.parse(localStorage.getItem("drumsircle-contact") || "[]");
    localStorage.setItem("drumsircle-contact", JSON.stringify([...prev, {
      ...form,
      date: new Date().toISOString()
    }]));
    setSuccess(true);
    setForm({ name: "", email: "", message: "", captcha: "" });
    setCharCount(0);
    setMath(getRandomMath());
  };

  return (
    <section className="contact-form-section">
      <h2>Booking / Contact Drum Sircle</h2>
      {success && <div className="success-msg">Thank you! Your message was sent.</div>}
      <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
        <label>
          Name
          <input
            name="name"
            type="text"
            maxLength={100}
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Message/Booking Details
          <textarea
            name="message"
            rows={6}
            maxLength={1000}
            value={form.message}
            onChange={handleChange}
            required
          />
          <span className="char-count">{charCount}/1000</span>
        </label>
        <label>
          Captcha: What is {math.a} + {math.b}?
          <input
            name="captcha"
            type="text"
            value={form.captcha}
            onChange={handleChange}
            required
            inputMode="numeric"
            autoComplete="off"
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="send-btn" type="submit">Send Booking Request</button>
      </form>
    </section>
  );
}

export default Contact;
