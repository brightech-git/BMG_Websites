import React from 'react';
import { FaTag, FaAward, FaLock, FaMoneyBillWave, FaExchangeAlt, FaInfinity } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import './WhyChooseUsStyles.css'
import Footertwo from '../../layouts/Footer';
import HeaderWithAuth from '../../layouts/HeaderWithAuth';

const BMGJewellers = () => {
  return (
    <>
      <HeaderWithAuth />
      <div className="bmg-jewellers">


        {/* Header Section */}
        <header className="header">
          <div className="header-content">


          </div>
        </header>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="container">
            <div className="section-title">
              <h2>Why Choose BMG Jewellers?</h2>
            </div>

            <div className="benefits-grid">
              <BenefitCard
                title="Best Price Guarantee"
                icon={<FaTag />}
                content={[
                  "BMG Jewellers provides unparalleled prices across all product ranges and categories for the benefit of our customers. Whether at our showrooms or online store, we offer real-time market-based pricing for gold and silver.",
                  "Customers are assured of getting valuable returns on their investment when they choose BMG Jewellers for their jewelry needs."
                ]}
              />

              <BenefitCard
                title="Certified Quality"
                icon={<FaAward />}
                content={[
                  "BMG Jewellers is committed to quality, offering BIS 916-hallmarked jewelry that meets strict government standards. Our sophisticated machinery accurately determines the carat value of jewelry through scientific, tamper-proof measurements.",
                  "Every gold and silver item we sell is BIS Hallmarked, with diamond and platinum jewelry accompanied by authenticity certificates."
                ]}
              />

              <BenefitCard
                title="Secure Shopping"
                icon={<FaLock />}
                content={[
                  "BMG Jewellers provides secured shipping across India with all items fully insured against theft, damage, or loss during transit.",
                  "Our operations team ensures prompt deliveries with tamper-proof packaging. Each package is sealed with certificates and every packaging activity is video recorded for quality assurance."
                ]}
              />

              <BenefitCard
                title="100% Refund Policy"
                icon={<FaMoneyBillWave />}
                content={[
                  "Customers are protected with a 100% money-back guarantee for issues with product quality, size, or delivery.",
                  "In rare cases of defects or discrepancies, BMG Jewellers refunds the entire payment including shipping and processing fees directly to your source account."
                ]}
              />

              <BenefitCard
                title="15-Day Return Policy"
                icon={<FaExchangeAlt />}
                content={[
                  "Customer satisfaction is at the heart of BMG Jewellers. If you're not completely satisfied, you can exchange for a different design or return your purchase within 15 days.",
                  "Our flexible return policy ensures you can shop with complete confidence."
                ]}
              />

              <BenefitCard
                title="Lifetime Exchange"
                icon={<FaInfinity />}
                content={[
                  "Stay current with jewelry trends by exchanging your older pieces at any BMG Jewellers showroom for modern designs at appropriate exchange values.",
                  "Our lifetime exchange policy allows you to keep your collection fresh and fashionable."
                ]}
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="about-overlay">
            <div className="container">
              <div className="about-content">
                <h2>Our Legacy</h2>
                <p>BMG Jewellers carries forward a rich tradition of jewelry craftsmanship and customer trust. With decades of experience in the jewelry business, we understand the evolving tastes of our customers while maintaining timeless quality standards.</p>

                <div className="stats">
                  <StatItem number="70+" text="Years in Jewelry Business" />
                  <StatItem number="50+" text="Showrooms Across India" />
                  <StatItem number="2000+" text="Skilled Employees" />
                  <StatItem number="1M+" text="Satisfied Customers" />
                </div>
              </div>
            </div>
          </div>
        </section>


        <Footertwo />
      </div>
    </>
  );
};

// Benefit Card Component
const BenefitCard = ({ title, icon, content }) => {
  return (
    <div className="benefit-card">
      <div className='card-header-container'>
        <span className="card-icon">{icon}</span> <span className="card-header-title">{title}</span>
      </div>
      <div className="card-body-container">

        {content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>

  );
};

// Stat Item Component
const StatItem = ({ number, text }) => {
  return (
    <div className="stat-item">
      <h3>{number}</h3>
      <p>{text}</p>
    </div>
  );
};

export default BMGJewellers;