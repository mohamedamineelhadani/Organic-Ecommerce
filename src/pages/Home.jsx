import React from "react";
import homeImg from "../assets/images/home.png"
import {ArrowDownRight ,Twitter ,Facebook , Instagram } from "lucide-react"
import { Link } from "react-scroll";
const Home = () => {

 
  return (
    <section className="home" id="home">
      <div className="home-container">

        <div className="home-data">
          <h1 className="home-title">
            Pure Taste <br /> Pure Health
          </h1>
          <p className="home-description">
            Welcome to nature's finest selection! We deliver farm-fresh organic vegetables 
            and fruits directly to your doorstep, experience the true taste of purity.
          </p>
          <Link
            to="about" className="more-btn"
            smooth={true}
            duration={600}
            spy={true}
            offset={-75}
          >
            More <ArrowDownRight className="icon" />
          </Link>



        </div>

        <img src={homeImg} alt="" className="home-img" />

        <div className="home-social">
          <div className="home-social-links">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              className="home-social-link"
            >
              <Facebook className="icon" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              className="home-social-link"
            >
              <Instagram className="icon" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              className="home-social-link"
            >
              <Twitter className="icon" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
