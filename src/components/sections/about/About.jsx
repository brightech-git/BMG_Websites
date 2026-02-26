import React, { useRef, useEffect, useState, memo } from 'react';
import './Styles.css';

// Import images directly
import ourStoryImage from '../../../assets/images/store.jpg';
import whyChooseUsImage from '../../../assets/images/store.jpg';
import ourPromiseImage from '../../../assets/images/store.jpg';
// Import new images for mission and vision sections
import missionImage from '../../../assets/images/store.jpg'; // Add your mission image path
import visionImage from '../../../assets/images/store.jpg';   // Add your vision image path

// Import video
// import craftsmanshipVideo from '../../../assets/videos/craft.mp4';

// Memoized Video component with toggle play/pause functionality and accessibility improvements
const CraftsmanshipVideo = memo(() => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      console.error("Video failed to load");
    };

    if (videoElement) {
      videoElement.addEventListener('loadstart', handleLoadStart);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('error', handleError);

      // Try autoplay on mount
      const tryAutoplay = async () => {
        try {
          await videoElement.play();
          setIsPlaying(true);
        } catch (error) {
          //console.log("Autoplay prevented:", error);
          setIsPlaying(false);
        }
      };

      tryAutoplay();

      return () => {
        videoElement.removeEventListener('loadstart', handleLoadStart);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => console.error("Play failed:", error));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePlay();
    }
  };

  return (
    <div className="bmg-video-container">
      {isLoading && (
        <div className="bmg-video-loading">
          <div className="bmg-video-spinner"></div>
          <p>Loading video...</p>
        </div>
      )}
      {/* <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster={productImage}
        aria-label="Craftsmanship video showcasing jewellery making process"
      >
        <source src={craftsmanshipVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div
        className={`bmg-play-button-overlay ${isPlaying ? 'bmg-play-button-overlay-playing' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={isPlaying}
        onClick={togglePlay}
        onKeyDown={handleKeyDown}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        {!isPlaying && (
          <svg className="bmg-play-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
          </svg>
        )}
      </div>
    </div>
  );
});

const BMGAboutUs = () => {
  return (
    <div className="bmg-global">
      {/* <header className="bmg-header">
        <div className="bmg-container">
          <h1 className="bmg-logo" tabIndex={0}>BMG Jewellers</h1>
          <p className="bmg-tagline" tabIndex={0}>Crafting Timeless Elegance Since Our Inception</p>
        </div>
      </header> */}

      <main>
        <div className="bmg-container">
          <section className="bmg-section">
            <h2 className="bmg-section-title">Our Story</h2>
            <div className="bmg-content-wrapper">
              <div className="bmg-text-content">
                <p>
                  BMG Jewellers began as a small, family-run business with a simple goal: to offer high-quality, genuine jewellery to the people of Madurai. What started as a humble endeavour has now grown into a trusted name, recognized for our dedication to craftsmanship, value, and customer care.
                </p>
                <p>
                  In a city known for its cultural richness and historic landmarks, BMG Jewellers has created a legacy of trust by offering fine jewellery that embodies both tradition and modern elegance.
                </p>
                <p>
                  Over the years, we have expanded our offerings while staying true to our core principles of fairness, transparency, and integrity. We take pride in the fact that we have built lasting relationships with our customers, many of whom continue to return to us for their special occasions and jewellery needs.
                </p>
              </div>
              <div className="bmg-image-container">
                <img
                  src={ourStoryImage}
                  alt="BMG Jewellers Heritage Store facade"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' fill='%23f5f5f5'%3E%3Crect width='800' height='450' fill='%23f8f3ed'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23b8860b'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </section>

          <section className="bmg-section">
            <h2 className="bmg-section-title">Our Craftsmanship</h2>
            <div className="bmg-content-wrapper bmg-content-wrapper-reverse">
              <CraftsmanshipVideo />
              <div className="bmg-text-content">
                <p>
                  Our master craftsmen blend traditional techniques with contemporary design, creating pieces that honor heritage while embracing modern aesthetics. Each jewellery item is meticulously crafted with attention to every detail.
                </p>
                <p>
                  We specialize in exquisite gold jewellery, brilliant diamonds, and vibrant precious stones, ensuring that every piece meets our rigorous standards of quality and beauty.
                </p>
                <p>
                  Moreover, every item in our collection is crafted using 92.5 BIS hallmark-certified silver, ensuring purity, quality, and authenticity. This certification not only guarantees the silver's purity but also reflects our commitment to providing products that meet the highest standards in the industry.
                </p>
              </div>
            </div>
          </section>

          <section className="bmg-section">
            <h2 className="bmg-section-title">Why Choose Us</h2>
            <div className="bmg-values-grid">
              <div className="bmg-value-card">
                <div className="bmg-icon" aria-hidden="true">💎</div>
                <h3>Uncompromising Quality</h3>
                <p>We use only the finest materials and employ skilled artisans to create jewellery that stands the test of time.</p>
              </div>
              <div className="bmg-value-card">
                <div className="bmg-icon" aria-hidden="true">🤝</div>
                <h3>Trust & Transparency</h3>
                <p>For generations, we've built relationships based on honesty, with no hidden costs or compromises.</p>
              </div>
              <div className="bmg-value-card">
                <div className="bmg-icon" aria-hidden="true">✨</div>
                <h3>Heritage & Innovation</h3>
                <p>We honor traditional craftsmanship while embracing innovative designs for the modern customer.</p>
              </div>
            </div>
            <div className="bmg-image-container" style={{ marginTop: '50px' }}>
              <img
                src={whyChooseUsImage}
                alt="Exquisite BMG Jewellery Collection on display"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' fill='%23f5f5f5'%3E%3Crect width='800' height='450' fill='%23f8f3ed'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23b8860b'%3EImage not available%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </section>

          {/* Mission Section */}
          <section className="bmg-section bmg-mission-section">
            <h2 className="bmg-section-title">Our Mission</h2>
            <div className="bmg-content-wrapper">
              <div className="bmg-text-content">
                <div className="bmg-mission-statement">
                  <p className="bmg-mission-highlight">
                    At BMG Jewellers, our mission is to make high-quality, beautifully designed jewellery accessible to everyone.
                  </p>
                  <p>
                    We believe in offering our customers genuine products without hidden costs or extra charges.
                    Moreover, every item in our collection is crafted using 92.5 BIS hallmark-certified silver,
                    ensuring purity, quality, and authenticity. This certification not only guarantees the silver's
                    purity but also reflects our commitment to providing products that meet the highest standards
                    in the industry.
                  </p>
                </div>
              </div>
              <div className="bmg-image-container">
                <img
                  src={missionImage}
                  alt="BMG Jewellers Mission - Making quality jewellery accessible"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' fill='%23f5f5f5'%3E%3Crect width='800' height='450' fill='%23f8f3ed'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23b8860b'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="bmg-section bmg-vision-section">
            <h2 className="bmg-section-title">Our Vision</h2>
            <div className="bmg-content-wrapper bmg-content-wrapper-reverse">
              <div className="bmg-image-container">
                <img
                  src={visionImage}
                  alt="BMG Jewellers Vision - Becoming a leading name in jewellery industry"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' fill='%23f5f5f5'%3E%3Crect width='800' height='450' fill='%23f8f3ed'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23b8860b'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="bmg-text-content">
                <div className="bmg-vision-statement">
                  <p className="bmg-vision-highlight">
                    As we continue to grow, our vision is to become a leading name in the jewellery industry,
                    known for our unwavering commitment to quality, transparency, and customer satisfaction.
                  </p>
                  <p>
                    We aim to expand our reach beyond Madurai, bringing our exceptional services and products
                    to customers across South India and beyond, while always maintaining the same personal touch
                    that has defined us since day one.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bmg-section bmg-section-last">
            <h2 className="bmg-section-title">Our Promise</h2>
            <div className="bmg-promise-container">
              <p>
                We promise to continue delivering exceptional value, maintaining the highest standards of craftsmanship,
                and upholding the trust that our customers have placed in us for generations. Your satisfaction is our
                ultimate goal, and we strive to make every interaction with BMG Jewellers a memorable experience.
              </p>
            </div>
            <div className="bmg-image-container" style={{ marginTop: '50px' }}>
              <img
                src={ourPromiseImage}
                alt="BMG Jewellers Craftsmanship Promise emblem"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' fill='%23f5f5f5'%3E%3Crect width='800' height='450' fill='%23f8f3ed'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23b8860b'%3EImage not available%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BMGAboutUs;