import React from 'react';
import { Link } from 'react-router-dom';
import ctabg from '../../../assets/img/category/img1.jpg';
import './Cta.css';

const Cta = () => {
  return (
    <section className="cta-section position-relative overflow-hidden">
      <div
        className="cta-background position-absolute w-100 h-100"
        style={{ backgroundImage: `url(${ctabg})` }}
        aria-hidden="true"
      />
      <div className="cta-overlay position-absolute w-100 h-100" />
      <div className="container position-relative py-4">
        <div className="row justify-content-start">
          <div className="col-12 col-lg-6">
            <div className="cta-content text-white p-3 p-md-4">
              <h2 className="cta-title mb-3">
                Exclusive Artworks
              </h2>
              <p className="cta-text mb-4">
                Discover our curated collection of unique artworks crafted by talented artists. Each piece tells a story, blending creativity with timeless elegance. Elevate your space with art that inspires.
              </p>
              <Link
                to="/shop"
                className="cta-btn btn btn-primary"
                aria-label="Explore our exclusive artworks"
              >
                Shop Now
                <i className="fas fa-arrow-right ms-2" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;