import React, { useState, useEffect, useRef } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      comment: 'Absolutely stunning jewelry! Exceptional craftsmanship and my wife was overjoyed with the anniversary gift.',
      rating: 5,
      location: 'New York',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      name: 'Michael Chen',
      comment: 'Outstanding customer service! The custom engagement ring exceeded all expectations.',
      rating: 5,
      location: 'California',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      comment: 'Years of purchases and they never disappoint. Quality and elegance in every piece.',
      rating: 5,
      location: 'Texas',
      image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      name: 'David Wilson',
      comment: 'Pearl earrings were more beautiful in person. Fast shipping and perfect packaging.',
      rating: 5,
      location: 'Florida',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 5,
      name: 'Olivia Smith',
      comment: 'Beautiful craftsmanship! Grandmother\'s bracelet restoration handled with exceptional care.',
      rating: 5,
      location: 'Washington',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    },
   
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1;
        }
      }, 30);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span
        key={i}
        className={i < rating ? 'star filled' : 'star'}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  return (
    <section className="testimonials-section" aria-label="Customer testimonials">
      <div className="testimonials-header">
        <h2>What Our Customers Say</h2>
        {/* <p>Discover why thousands trust us with their most precious moments</p> */}
      </div>

      <div
        className="testimonials-container"
        ref={scrollContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="testimonials-track">
          {/* Duplicate testimonials for seamless loop */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="testimonial-card"
            >
              <div className="testimonial-image-container">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} - Happy Customer`}
                  className="testimonial-image"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <div className="rating-overlay">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>

              <div className="testimonial-content">
               

                <div className="testimonial-footer">
                  <div className="customer-info">
                    <h4 className="customer-name">{testimonial.name}</h4>
                    <p className="customer-location">{testimonial.location}</p>
                  </div>
                  <div className="rating-stars">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <blockquote className="testimonial-quotes">
                  "{testimonial.comment}"
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Testimonials;