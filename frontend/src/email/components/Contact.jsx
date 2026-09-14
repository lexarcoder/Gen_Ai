import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
  FaPaperPlane,
  FaUser,
  FaTag,
  FaCommentDots,
  FaCheckCircle,
  FaFacebookF,
  FaHome,
} from "react-icons/fa";

import "../style/Contact.scss";
import { useAuth } from "../../hooks/useAuth";

const Contact = () => {
  const { user, profile, handleContact } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (!profile && !user) return;

    const fullName =
      `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();

    setFormData((prev) => ({
      ...prev,
      username: fullName || user?.username || "",
      email: user?.email || profile?.email || "",
    }));
  }, [profile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    setLoading(true);

    try {
      await handleContact(formData);

      setSubmitted(true);

      setFormData({
        username: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 1500);
      
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        <div className="contact-header">
          <Link to="/" className="contact-nav contact-nav--home">
            <FaHome />
          </Link>
          <span className="contact-header__eyebrow">Get in Touch</span>
          <Link to="/profile" className="contact-nav contact-nav--contact">
            <FaUser />
          </Link>
          <h1 className="contact-header__title">Let's Talk</h1>

          <p className="contact-header__subtitle">
            Have a project idea in mind? Let's turn it into something
            exceptional.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div className="info-card glass-card page">
            <div className="info-card__top">
              <div className="info-card__avatar">
                <span>LC</span>
              </div>

              <h2 className="info-card__name">LEXARCODER</h2>

              <p className="info-card__role">Full-Stack Developer</p>
            </div>

            <div className="info-card__divider" />

            <ul className="info-list">
              <li className="info-list__item">
                <span className="info-list__icon">
                  <FaMapMarkerAlt />
                </span>

                <div className="info-list__text">
                  <span className="info-list__label">Address</span>

                  <span className="info-list__value">
                    Haridwar, Uttarakhand, India — 249402
                  </span>
                </div>
              </li>

              <li className="info-list__item">
                <span className="info-list__icon">
                  <FaEnvelope />
                </span>

                <div className="info-list__text">
                  <span className="info-list__label">Email</span>

                  <span className="info-list__value">
                    <a href="mailto:lexarcoder@gmail.com?subject=Hello&body=Hi LexarCoder,">
                      lexarcoder@gmail.com
                    </a>
                  </span>
                </div>
              </li>

              <li className="info-list__item">
                <span className="info-list__icon">
                  <FaPhoneAlt />
                </span>

                <div className="info-list__text">
                  <span className="info-list__label">Phone</span>

                  <span className="info-list__value">+91 896XXXXX78</span>
                </div>
              </li>
            </ul>

            <div className="info-card__divider" />

            <div className="socials">
              <p className="socials__label">Find me on</p>

              <div className="socials__icons">
                <a
                  href="https://github.com/LexarCoder"
                  className="social-btn"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </a>

                <a
                  href="https://www.linkedin.com/feed/"
                  className="social-btn"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn />
                </a>

                <a
                  href="https://www.instagram.com/lexarcoder/"
                  className="social-btn"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>

                <a
                  href="https://www.facebook.com/lexarcoder"
                  className="social-btn"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="https://x.com/NiteshPandey378"
                  className="social-btn"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-card glass-card page">
            <h2 className="form-card__title">Send a Message</h2>

            <p className="form-card__subtitle">
              ✨ Let's turn your "what if" into "look what we built." ✨
            </p>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-fields">
                {/* Full Name */}
                <div className="form-group">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="form-input"
                    placeholder=" "
                    autoComplete="name"
                    minLength={3}
                    maxLength={50}
                    required
                    disabled
                    value={formData.username}
                    onChange={handleChange}
                  />

                  <span className="form-field-icon">
                    <FaUser />
                  </span>

                  <label htmlFor="username" className="form-label">
                    Full Name
                  </label>

                  <span className="form-line" />
                </div>

                {/* Email */}
                <div className="form-group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder=" "
                    autoComplete="email"
                    required
                    disabled
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <span className="form-field-icon">
                    <FaEnvelope />
                  </span>

                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>

                  <span className="form-line" />
                </div>

                {/* Subject */}
                <div className="form-group">
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="form-input"
                    placeholder=" "
                    autoComplete="off"
                    minLength={3}
                    maxLength={100}
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />

                  <span className="form-field-icon">
                    <FaTag />
                  </span>

                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>

                  <span className="form-line" />
                </div>

                {/* Message */}
                <div className="form-group form-group--textarea">
                  <textarea
                    id="message"
                    name="message"
                    className="form-input form-textarea"
                    rows={5}
                    placeholder=" "
                    minLength={10}
                    maxLength={1000}
                    autoComplete="off"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <span className="form-field-icon form-field-icon--ta">
                    <FaCommentDots />
                  </span>

                  <label htmlFor="message" className="form-label">
                    Your Message
                  </label>

                  <span className="form-line" />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`submit-btn ${
                  submitted ? "submit-btn--sent" : ""
                } btn-premium`}
                disabled={loading || submitted}
              >
                <span className="submit-btn__icon">
                  {submitted ? <FaCheckCircle /> : <FaPaperPlane />}
                </span>

                <span className="submit-btn__text">
                  {submitted
                    ? "Message Sent!"
                    : loading
                      ? "Sending..."
                      : "Send Message"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;