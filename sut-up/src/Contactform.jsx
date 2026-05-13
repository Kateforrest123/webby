// ContactForm.jsx
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

// ── Replace these with your EmailJS credentials ──
const SERVICE_ID  = "service_ywb137i";
const TEMPLATE_ID = "template_9ngbj6l";
const PUBLIC_KEY  = "rZ2ztZpS8y8ycITCi";

export default function ContactForm() {
  const formRef = useRef();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleSend = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => setStatus("sent"))
      .catch(() => setStatus("error"));
  };

  return (
    <div className="email-window">

      {/* macOS-style chrome bar */}
      <div className="email-chrome">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span className="chrome-title">You can send me a message here, or email me at kate.forrest@bell.net!</span>
      </div>

      <form ref={formRef} onSubmit={handleSend} className="email-body">

        <div className="email-field">
          <label className="field-label">To:</label>
          <span className="field-static">kate.forrest@bell.net</span>
        </div>

        <div className="email-field">
          <label className="field-label" htmlFor="from_email">From:</label>
          <input
            id="from_email"
            name="from_email"
            type="email"
            className="email-input"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="email-field">
          <label className="field-label" htmlFor="subject">Subject:</label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="email-input"
            required
          />
        </div>

        <textarea
          name="message"
          className="email-input compose-area"
          placeholder="Write your message here..."
          required
        />

        <div className="send-row">
          {status === "sent" ? (
            <p className="sent-msg">Message sent!</p>
          ) : (
            <button type="submit" className="send-btn" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "⟶ Send"}
            </button>
          )}
          {status === "error" && <p className="error-msg">Something went wrong. Try again.</p>}
        </div>

        <p className="email-footer">Delivered securely via EmailJS</p>
      </form>
    </div>
  );
}