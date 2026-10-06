import React, { useState } from "react";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { contactService } from "../services/contactService";
import { useToast } from "../context/ToastContext";

const Contact = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!email) {
      toast.warning("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!message || message.length < 5) {
      toast.warning("Please write a message (at least 5 characters)");
      return;
    }

    setIsLoading(true);
    try {
      const res = await contactService.send({
        email,
        subject: formData.subject.trim() || null,
        message,
      });

      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
        setFormData({ email: "", subject: "", message: "" });
      } else {
        toast.error(res.message || "Failed to send message");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-box">
          <h2 className="contact-title">Reach Out To Us Today</h2>

          <div className="contact-data">
            <div className="contact-information">
              <h3 className="contact-subtitle">Call Us For Instant Support</h3>
              <span className="contact-description">
                <Phone className="icon" /> +212 610781044
              </span>
            </div>

            <div className="contact-information">
              <h3 className="contact-subtitle">Write Us By Mail</h3>
              <span className="contact-description">
                <Mail className="icon" /> elhadanimohamedamine@gmail.com
              </span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-inputs">
            <div className="contact-content">
              <input
                type="email"
                name="email"
                placeholder=" "
                className="contact-input"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <label className="contact-label">Email</label>
            </div>

            <div className="contact-content">
              <input
                type="text"
                name="subject"
                placeholder=" "
                className="contact-input"
                value={formData.subject}
                onChange={handleChange}
                disabled={isLoading}
              />
              <label className="contact-label">Subject</label>
            </div>

            <div className="contact-content contact-area">
              <textarea
                name="message"
                placeholder=" "
                className="contact-input"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isLoading}
              ></textarea>
              <label className="contact-label">Message</label>
            </div>
          </div>

          <button className="contact-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Submit"}
            <ArrowRight className="icon" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;