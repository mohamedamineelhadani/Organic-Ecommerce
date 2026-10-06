import React from "react";
import { Phone , Mail , ArrowRight } from "lucide-react";
const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-box">
          <h2 className="contact-title">Reach Out To Us Today</h2>

          <div className="contact-data">
            <div className="contact-information">
              <h3 className="contact-subtitle">Call Us For Instant Support</h3>
              <span className="contact-description">
                <Phone className="icon"  />
                +212 610781044
              </span>
            </div>

            <div className="contact-information">
              <h3 className="contact-subtitle">Write Us By Mail</h3>
              <span className="contact-description">
                <Mail className="icon" />
                elhadanimohamedamine@gmail.com
              </span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={(e)=> e.preventDefault()}>
          <div className="contact-inputs">
            <div className="contact-content">
              <input type="email" placeholder=" " className="contact-input" />
              <label for="" className="contact-label">
                Email
              </label>
            </div>

            <div className="contact-content">
              <input type="text" placeholder=" " className="contact-input" />
              <label for="" className="contact-label">
                Subject
              </label>
            </div>

            <div className="contact-content contact-area">
              <textarea
                name="message"
                placeholder=" "
                className="contact-input"
              ></textarea>
              <label for="" className="contact-label">
                Message
              </label>
            </div>
          </div>

          <button className="contact-btn">
            Submit
            <ArrowRight className="icon" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
