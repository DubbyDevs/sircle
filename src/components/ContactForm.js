import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Formspree endpoint (replace with your unique endpoint from formspree.io)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/yourid"; // <-- Replace with your endpoint

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", captcha: "" });
  const [count, setCount] = useState(1000);
  const [submitted, setSubmitted] = useState(false);
  const [captchaOK, setCaptchaOK] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message") setCount(1000 - value.length);
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "captcha" && value.trim() === "10") setCaptchaOK(true);
    else if (name === "captcha") setCaptchaOK(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaOK) return;
    // Send to Formspree
    const data = new FormData(e.target);
    await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    setSubmitted(true);
  };

  if (submitted)
    return (
      <div className="container p-5 text-center text-success" style={{ marginTop: 100 }}>
        <h2>Thank you!</h2>
        <p>Your message has been received. We’ll be in touch soon.</p>
      </div>
    );

  return (
    <div className="container p-5" style={{ marginTop: 100 }}>
      <h1 className="mb-4 text-white">Contact & Booking</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="contactName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="contactEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="contactMessage" className="mb-3">
          <Form.Label>Message / Booking Details</Form.Label>
          <Form.Control
            name="message"
            as="textarea"
            rows={6}
            maxLength={1000}
            required
            value={form.message}
            onChange={handleChange}
          />
          <Form.Text muted>{count} characters remaining</Form.Text>
        </Form.Group>
        <Form.Group controlId="contactCaptcha" className="mb-3">
          <Form.Label>Anti-spam: What is 7 + 3?</Form.Label>
          <Form.Control
            name="captcha"
            type="text"
            required
            value={form.captcha}
            onChange={handleChange}
          />
        </Form.Group>
        <Button
          variant="info"
          type="submit"
          disabled={!captchaOK}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
export default ContactForm;
