import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import "magnific-popup";
import Slider from "react-slick";

import aboutimg from "../../../assets/img/text-block/offer.webp";
import trendy from "../../../assets/img/text-block/trendy.webp";

// Testimonial user images
import user1 from "../../../assets/img/instagram/user1.jpeg";
import user2 from "../../../assets/img/instagram/user3.jpg";
import user3 from "../../../assets/img/instagram/user2.webp";

const testimonials = [
  {
    quote:
      "Risus nec feugiat in fermentum posuere urna nec. Mi bibendum neque egestas congue quisque.",
    name: "Lisha",
    title: "General Manager",
    image: user1,
  },
  {
    quote:
      "Leo in vitae turpis massa sed elementum tempus. Duis ut diam quam nulla porttitor.",
    name: "Rahul Singh",
    title: "Creative Director",
    image: user2,
  },
  {
    quote:
      "Nibh sed pulvinar proin gravida hendrerit. Blandit cursus risus at ultrices mi tempus imperdiet.",
    name: "Nikita Joshi",
    title: "Fashion Blogger",
    image: user3,
  },
];

const featuresposts = [
  { icon: "flaticon-ring", title: "Diamond Ring" },
  { icon: "flaticon-bracelet", title: "Bracelets" },
  { icon: "flaticon-necklace", title: "Necklaces" },
  { icon: "flaticon-bracelet-2", title: "Pendants" },
  { icon: "flaticon-earrings", title: "Earrings" },
];

class About extends Component {
  
  render() {
       const testimonialSettings = {
      dots: true,
      infinite: true,
      speed: 600,
      slidesToShow: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false,
    };

    return (
      <section className="about-section pt-115 pb-115">
        <div className="container">
          {/* Trendy Card */}
          <div className="trendy-card-container mb-60">
            <div className="card-image">
              <img src={trendy} alt="Jewellery Display" />
            </div>
            <div className="card-content">
              <h2 className="card-title">Trendy Design Jewellery</h2>
              <p className="card-desc">
                Discover the allure of Trendy Design Jewellery, where timeless
                elegance meets modern fashion. Our collection is thoughtfully
                crafted for the style-conscious, blending contemporary flair
                with classic charm. Each piece is designed to make a statement —
                whether you're dressing for a special occasion or adding a
                sparkle to your everyday look.
              </p>
              <a
                href="/shop"
                className="shop-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* About Info */}
          <div className="section-title about-title text-center">
            <span className="title-tag">
              since <span>1994</span>
            </span>
            <h2>
              Hello. Our store has been present for over 30 years. We give
              assurance to all customers.
            </h2>
          </div>

          {/* Feature Icons */}
          <ul className="about-features">
            {featuresposts.map((item, i) => (
              <li key={i}>
                <Link to="#">
                  <i className={item.icon} />
                  <i className={"hover-icon " + item.icon} />
                  <span className="title">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* About Text */}
          <div className="about-text-box">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="about-img">
                  <img src={aboutimg} alt="About" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-text">
                  <span>Get 50% Off</span>
                  <h3>Get All Gold Jewelry At 50 Percent, Grab It Now</h3>
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip.
                  </p>
                  <h3>Get All Gold Jewelry At 50 Percent, Grab It Now</h3>

                  {/* 👉 Shop Now Button */}
                  <a
                    href="/shop"
                    className="shop-btn mt-3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* What We Provide Section */}
          <div className="provide-card mb-60">
            {/* Left Text */}
            <div className="provide-text">
              <h2>What We Provide</h2>
              <p>
                Tristique sollicitudin nibh sit amet commodo nulla facilisi
                nullam. Amet mauris commodo quis imperdiet massa tincidunt. Enim
                diam vulputate ut pharetra sit amet. Scelerisque viverra mauris
                in aliquam sem fringilla ut morbi tincidunt. Non diam phasellus
                vestibulum lorem sed risus ultricies tristique. In nibh mauris
                cursus mattis molestie a.
              </p>
            </div>

            {/* Right Progress Bars */}
            <div className="provide-bars">
              <div className="progress-wrapper">
                <div className="progress-label">
                  <span>Bangles</span>
                  <span>75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "75%" }}></div>
                </div>
              </div>

              <div className="progress-wrapper">
                <div className="progress-label">
                  <span>Wedding Rings</span>
                  <span>98%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "98%" }}></div>
                </div>
              </div>

              <div className="progress-wrapper">
                <div className="progress-label">
                  <span>Pendant</span>
                  <span>78%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "78%" }}></div>
                </div>
              </div>
            </div>
          </div>
           <section className="testimonial-section">
          <div className="container">
            <h2 className="testimonial-title">Our Happy Clients Thoughts</h2>
            <Slider {...testimonialSettings} className="testimonial-slider">
              {testimonials.map((item, index) => (
                <div className="testimonial-item" key={index}>
                  <div className="testimonial-quote">“</div>
                  <p className="testimonial-text">{item.quote}</p>
                  <div className="testimonial-profile">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="testimonial-img"
                    />
                    <h5>{item.name}</h5>
                    <span>{item.title}</span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
        </div>
      </section>
    );
  }
}

export default About;
