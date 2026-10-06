import React from "react";
import aboutImg from "../assets/images/about.jpg";
import { ArrowDownRight , Check } from "lucide-react";
import { Link } from "react-scroll";

const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <img src={aboutImg} alt="" className="about-img" />

        <div className="about-data">
          <h2 className="about-title">Why Choose Us?</h2>

          <p className="about-description">
            5 ways we ensure quality, sustainability, and transparency
          </p>

          <div className="about-details">
            <p className="about-details-description">
              <Check className="about-details-icon" />
              100% Certified Organic.
            </p>
            <p className="about-details-description">
              <Check className="about-details-icon" />
              Pesticide-Free Guarantee.
            </p>
            <p className="about-details-description">
              <Check className="about-details-icon" />
              Locally Grown When Possible.
            </p>
            <p className="about-details-description">
              <Check className="about-details-icon" />
              Sustainable Packaging.
            </p>
            <p className="about-details-description">
              <Check className="about-details-icon" />
              Supporting Family Farms.
            </p>
          </div>

          <Link
            className="shop-btn"
            to="products"
            smooth={true}
            duration={600}
            spy={true}
            offset={-75}
          >
            Shop Now
            <ArrowDownRight className="icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;


