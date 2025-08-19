import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pauseAutoPlay, setPauseAutoPlay] = useState(false);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      comment: 'The diamond necklace I bought for my anniversary is absolutely stunning! The craftsmanship is exceptional and my wife was overjoyed.',
      rating: 5,
      date: 'March 15, 2023',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 2,
      name: 'Michael Chen',
      comment: 'Excellent customer service and beautiful pieces. The custom engagement ring I ordered was perfect in every detail.',
      rating: 5,
      date: 'January 28, 2023',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      comment: 'I\'ve purchased several pieces from this shop over the years and they never disappoint. Quality and elegance in every piece.',
      rating: 4,
      date: 'December 5, 2022',
      image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 4,
      name: 'David Wilson',
      comment: 'The pearl earrings were even more beautiful in person than online. Fast shipping and excellent packaging.',
      rating: 5,
      date: 'November 20, 2022',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 5,
      name: 'Olivia Smith',
      comment: 'Beautiful craftsmanship and attention to detail. My grandmother\'s bracelet restoration was handled with such care.',
      rating: 5,
      date: 'October 10, 2022',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80'
    }
  ];

  // Memoized navigation functions
  const nextTestimonial = useCallback(() => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  // Auto-play functionality with cleanup
  useEffect(() => {
    if (autoPlay && !isDragging && !pauseAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000);
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, isDragging, pauseAutoPlay, nextTestimonial]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextTestimonial();
      } else if (e.key === 'ArrowLeft') {
        prevTestimonial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextTestimonial, prevTestimonial]);

  const handleTouchStart = (e) => {
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    setIsDragging(true);
    setAutoPlay(false);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextTestimonial();
      } else {
        prevTestimonial();
      }
      setStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span 
        key={i} 
        className={i < rating ? 'star filled' : 'star'}
        aria-hidden="true"
      >
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  const goToTestimonial = (index) => {
    setActiveIndex(index);
    setAutoPlay(false);
    setPauseAutoPlay(true);
    setTimeout(() => {
      setPauseAutoPlay(false);
      setAutoPlay(true);
    }, 10000);
  };

  return (
    <section className="testimonials-page" aria-label="Customer testimonials">
      <div className="testimonials-header">
        <h2>Customer Testimonials</h2>
        <p>Hear what our valued customers say about their experience with our jewelry</p>
      </div>
      
      <div className="testimonials-controls">
        <button 
          className="slider-button prev"
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
        >
          &lt;
        </button>
        
        <div 
          className="testimonials-slider"
          ref={sliderRef}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setPauseAutoPlay(true)}
          onMouseLeave={() => setPauseAutoPlay(false)}
        >
          <div 
            className="testimonial-track"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              transition: isDragging ? 'none' : 'transform 0.5s ease'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`testimonial-slide ${index === activeIndex ? 'active' : ''}`}
                aria-hidden={index !== activeIndex}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${testimonials.length}`}
              >
                <div className="testimonial-card">
                  <div className="client-image">
                    <img 
                      src={testimonial.image} 
                      alt={`Portrait of ${testimonial.name}`} 
                      loading="lazy"
                      width="100"
                      height="100"
                    />
                  </div>
                  <div className="testimonial-content">
                    <div className="rating" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                      {renderStars(testimonial.rating)}
                    </div>
                    <blockquote className="comment">
                      <p>"{testimonial.comment}"</p>
                    </blockquote>
                    <div className="client-info">
                      <h3>{testimonial.name}</h3>
                      <p className="date">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="slider-button next"
          onClick={nextTestimonial}
          aria-label="Next testimonial"
        >
          &gt;
        </button>
      </div>

      <div className="testimonial-indicators">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => goToTestimonial(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;