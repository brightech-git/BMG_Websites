import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Ruler,
  Info,
  Sparkles,
  ArrowRight,
  Hand,
  Target,
  Star,
  ChevronDown,
  ChevronUp,
  Download,
  Check
} from "lucide-react";
import "./RingStyles.css";

const RingSizeGuide = () => {
  const [activeTab, setActiveTab] = useState("guide");
  const [animateCards, setAnimateCards] = useState(false);
  const [selectedSize, setSelectedSize] = useState(6); // Default to size 6
  const [expandedTips, setExpandedTips] = useState({});
  
  const chartRef = useRef(null);

  // Trigger entrance animation
  useEffect(() => {
    const timeout = setTimeout(() => setAnimateCards(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  // Master data for ring sizes
  const ringSizes = useMemo(
    () => [
      { india: 6, us: 3.75, uk: "H½", diameter: 14.9, circumference: 46.8, popularity: 5 },
      { india: 7, us: 4, uk: "I½", diameter: 15.3, circumference: 48.0, popularity: 8 },
      { india: 8, us: 4.5, uk: "K", diameter: 15.7, circumference: 49.3, popularity: 12 },
      { india: 9, us: 5, uk: "L", diameter: 16.1, circumference: 50.6, popularity: 15 },
      { india: 10, us: 5.25, uk: "M", diameter: 16.5, circumference: 51.8, popularity: 18 },
      { india: 11, us: 5.75, uk: "N", diameter: 16.9, circumference: 53.1, popularity: 20 },
      { india: 12, us: 6, uk: "O", diameter: 17.3, circumference: 54.4, popularity: 25 },
      { india: 13, us: 6.5, uk: "P", diameter: 17.7, circumference: 55.7, popularity: 22 },
      { india: 14, us: 7, uk: "Q", diameter: 18.1, circumference: 57.0, popularity: 18 },
      { india: 15, us: 7.5, uk: "R", diameter: 18.5, circumference: 58.3, popularity: 15 },
      { india: 16, us: 8, uk: "S", diameter: 18.9, circumference: 59.5, popularity: 12 },
      { india: 17, us: 8.5, uk: "T", diameter: 19.3, circumference: 60.8, popularity: 8 },
      { india: 18, us: 9, uk: "U", diameter: 19.7, circumference: 62.1, popularity: 5 },
    ],
    []
  );

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/ring-size-guide.pdf";
    link.download = "ring-size-guide.pdf";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleTip = (index) => {
    setExpandedTips(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const tabAnimation = {
    transform: animateCards ? "translateY(0)" : "translateY(20px)",
    opacity: animateCards ? 1 : 0,
    transition: "all 0.6s ease-out",
  };

  return (
    <div className="ring-container">
      <div className="ring-content">
        {/* Header */}
        <header className="ring-header" style={tabAnimation}>
          <div className="header-icon" aria-hidden="true">
            <Sparkles className="icon-large" />
          </div>
          <h1 className="main-title">Professional Ring Sizing Guide</h1>
          <p className="header-description">
            Discover your perfect fit with our comprehensive measurement system and expert recommendations
          </p>
        </header>

        {/* Tabs Navigation */}
        <nav
          className="navigation-container"
          role="tablist"
          aria-label="Ring size guide tabs"
        >
          <div className="nav-tabs">
            {[
              { id: "guide", label: "Measurement Guide", icon: Hand },
              { id: "chart", label: "Size Chart", icon: Ruler },
              { id: "tips", label: "Expert Tips", icon: Target },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                className={`nav-tab ${activeTab === id ? "nav-tab-active" : ""}`}
                onClick={() => {
                  setActiveTab(id);
                  // Scroll to chart when selected
                  if (id === "chart" && chartRef.current) {
                    setTimeout(() => {
                      chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }}
              >
                <Icon className="tab-icon" aria-hidden="true" />
                {label}
                {activeTab === id && <div className="tab-highlight" />}
              </button>
            ))}
          </div>
        </nav>

        {/* Tab Panels */}
        <section className="tab-content-container">
          {/* --- GUIDE TAB --- */}
          {activeTab === "guide" && (
            <div className="guide-content" style={tabAnimation}>
              <div className="professional-intro">
                <h2>Professional Ring Measurement Techniques</h2>
                <p>Follow these expert methods to determine your perfect ring size with precision</p>
              </div>
              
              <div className="guide-grid">
                <section className="guide-card">
                  <h3 className="guide-card-title">
                    <Hand className="guide-card-icon" aria-hidden="true" />
                    Standard Measurement Protocol
                  </h3>
                  <ol className="steps-container">
                    {[
                      "Measure your finger at the end of the day when fingers are typically at their largest",
                      "Ensure your hands are at normal body temperature (cold fingers can measure up to half a size smaller)",
                      "Wrap a flexible measuring tape or piece of paper around the base of your finger",
                      "Mark the point where the tape or paper overlaps to form a complete circle",
                      "Measure the length in millimeters and match to our size chart",
                      "Repeat measurement 2-3 times to ensure accuracy",
                    ].map((text, idx) => (
                      <li key={idx} className="step-item">
                        <div className={`step-number step-${idx + 1}`}>
                          {idx + 1}
                        </div>
                        <p className="step-text">{text}</p>
                      </li>
                    ))}
                  </ol>
                  
                  <div className="measurement-note">
                    <Info className="note-icon" />
                    <p><strong>Professional Note:</strong> For wider bands (over 6mm), consider going up half a size for optimal comfort.</p>
                  </div>
                </section>

                {/* Quick Reference */}
                <section className="guide-card">
                  <div className="visual-guide">
                    <div className="visual-content">
                      <div className="finger-icon-container">
                        <div className="finger-visual">
                          <div className="finger"></div>
                          <div className="ring-visual"></div>
                        </div>
                        <div className="measurement-line"></div>
                      </div>
                      <h4 className="visual-title">Measurement Points</h4>
                      <p className="visual-description">
                        Measure the circumference at the base of your finger where the ring will sit
                      </p>
                    </div>
                  </div>
                  
                  <div className="reference-section">
                    <h5 className="reference-title">Size Classification System</h5>
                    <ul className="reference-list">
                      {[
                        { size: "Petite Fingers", range: "India 6-8", desc: "Circumference: 46.8-49.3 mm", class: "petite" },
                        { size: "Slender Fingers", range: "India 9-11", desc: "Circumference: 50.6-53.1 mm", class: "slender" },
                        { size: "Standard Fingers", range: "India 12-14", desc: "Circumference: 54.4-57.0 mm", class: "standard" },
                        { size: "Full Fingers", range: "India 15-18", desc: "Circumference: 58.3-62.1 mm", class: "full" },
                      ].map((item) => (
                        <li key={item.size} className={`reference-item ${item.class}`}>
                          <span className="reference-size">{item.size}</span>
                          <span className="reference-range">{item.range}</span>
                          <span className="reference-desc">{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="professional-tip">
                    <Star className="tip-icon" />
                    <p>For knuckles significantly larger than your finger base, measure both and choose a size between them</p>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* --- CHART TAB --- */}
          {activeTab === "chart" && (
            <div className="chart-card" style={tabAnimation} ref={chartRef}>
              <div className="chart-header">
                <h2 className="chart-title">Professional Ring Size Reference Chart</h2>
                <p className="chart-description">
                  Comprehensive sizing data for precision fitting - all measurements in standard units
                </p>
              </div>

              {/* Visual Size Chart */}
              <div className="visual-size-chart">
                <div className="size-chart-container ring-chart">
                  {ringSizes.map((size, index) => (
                    <div 
                      key={size.india}
                      className={`size-item ring-item ${selectedSize === index ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(index)}
                    >
                      <div className="size-visual">
                        <div 
                          className="ring-circle" 
                          style={{ 
                            width: `${20 + index * 2}px`,
                            height: `${20 + index * 2}px`
                          }}
                        ></div>
                        <div className="size-label">{size.india}</div>
                      </div>
                      <div className="size-details">
                        <div className="size-header">
                          <span className="india-size">India: {size.india}</span>
                          <span className="size-conversion">
                            US: {size.us} | UK: {size.uk}
                          </span>
                        </div>
                        <div className="size-measurements">
                          <div className="measurement">
                            <span className="measurement-label">Diameter:</span>
                            <span className="measurement-value">{size.diameter} mm</span>
                          </div>
                          <div className="measurement">
                            <span className="measurement-label">Circumference:</span>
                            <span className="measurement-value">{size.circumference} mm</span>
                          </div>
                        </div>
                        <div className="popularity-indicator">
                          <div className="popularity-label">Prevalence:</div>
                          <div className="popularity-bar">
                            <div 
                              className="popularity-fill"
                              style={{ width: `${size.popularity}%` }}
                            ></div>
                            <span className="popularity-text">{size.popularity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Size Details */}
              {selectedSize !== null && (
                <div className="selected-size-details">
                  <h3>Recommended For You</h3>
                  <div className="size-recommendation">
                    <div className="recommendation-visual">
                      <div 
                        className="recommended-ring"
                        style={{ 
                          width: `${25 + selectedSize * 2}px`,
                          height: `${25 + selectedSize * 2}px`
                        }}
                      ></div>
                      <Hand className="recommendation-hand" />
                    </div>
                    <div className="recommendation-info">
                      <h4>Size India {ringSizes[selectedSize].india} (US: {ringSizes[selectedSize].us})</h4>
                      <p>Perfect for finger circumference of {ringSizes[selectedSize].circumference}mm</p>
                      <div className="recommendation-tips">
                        <div className="recommendation-tip">
                          <strong>Fit:</strong> {selectedSize < 4 ? 'Petite' : selectedSize > 10 ? 'Full' : 'Standard'}
                        </div>
                        <div className="recommendation-tip">
                          <strong>Prevalence:</strong> {ringSizes[selectedSize].popularity}% of our customers
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Size Comparison Guide */}
              <div className="size-comparison">
                <h3 className="comparison-title">Visual Size Comparison</h3>
                <div className="comparison-visual ring-comparison">
                  <div className="finger-visual-comparison">
                    <div className="finger-comparison">
                      {ringSizes.slice(4, 10).map((size, index) => (
                        <div 
                          key={index}
                          className="ring-overlay"
                          style={{ 
                            width: `${22 + index * 2}px`,
                            height: `${22 + index * 2}px`,
                            opacity: 0.8 - (index * 0.1)
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="comparison-labels">
                    <div className="comparison-label small">India 8-10 (Petite)</div>
                    <div className="comparison-label medium">India 11-13 (Standard)</div>
                    <div className="comparison-label large">India 14-16 (Full)</div>
                  </div>
                </div>
              </div>

              {/* Professional Guidance */}
              <aside className="professional-guidance">
                <div className="guidance-content">
                  <Info className="guidance-icon" />
                  <div>
                    <h4 className="guidance-title">Professional Fitting Guidance</h4>
                    <p className="guidance-description">
                      For optimal fit: Match your finger circumference measurement to the closest size in the chart. 
                      Consider ring width - wider bands may require going up half a size. 
                      The prevalence percentage indicates how commonly each size is purchased.
                    </p>
                    <div className="guidance-tips">
                      <div className="guidance-tip">
                        <strong>Standard Fit:</strong> Choose exact circumference match
                      </div>
                      <div className="guidance-tip">
                        <strong>Comfort Fit:</strong> Add 0.5mm to circumference measurement
                      </div>
                      <div className="guidance-tip">
                        <strong>Knuckle Consideration:</strong> Size between knuckle and base measurements
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* --- TIPS Tab --- */}
          {activeTab === "tips" && (
            <div className="tips-container" style={tabAnimation}>
              <div className="tips-header">
                <h2 className="tips-title">Master Jeweler's Ring Fitting Techniques</h2>
                <p className="tips-subtitle">
                  Professional insights gathered from decades of jewelry craftsmanship
                </p>
              </div>

              {/* Tips grid */}
              <div className="tips-grid">
                {[
                  {
                    icon: "⏰",
                    title: "Temporal Considerations",
                    description: "Measure between 4-6 PM when finger size is most consistent. Avoid morning measurements.",
                    extended: "Finger size can fluctuate throughout the day due to various factors like activity level, temperature, and hydration. The late afternoon tends to provide the most accurate representation of your average finger size."
                  },
                  {
                    icon: "💍",
                    title: "Ring Width Factor",
                    description: "For rings wider than 6mm, increase size by 0.25-0.5 increments for comfort.",
                    extended: "Wider bands need to accommodate more of the finger's surface area and have less flexibility when passing over knuckles. As a general rule, add 0.25 size for every additional 2mm in width beyond 6mm."
                  },
                  {
                    icon: "🌡️",
                    title: "Temperature Effects",
                    description: "Fingers can shrink up to half a size in cold weather - account for seasonal variations.",
                    extended: "In colder climates or during winter months, fingers contract significantly. For rings worn year-round, consider this variation and possibly choose a slightly tighter fit that will be perfect in warmer conditions."
                  },
                  {
                    icon: "🤰",
                    title: "Pregnancy Considerations",
                    description: "Fingers often swell during pregnancy - consider temporary sizing solutions.",
                    extended: "Many women experience finger swelling during pregnancy that can increase ring size by 1-2 sizes. Silicone ring guards or temporary resize solutions are recommended rather than permanent resizing."
                  },
                  {
                    icon: "🔄",
                    title: "Dominant Hand Difference",
                    description: "Dominant hand fingers are often slightly larger - measure the specific finger.",
                    extended: "For most people, the fingers on their dominant hand are slightly larger due to increased muscle development. Always measure the specific finger that will wear the ring rather than assuming symmetry."
                  },
                  {
                    icon: "🎯",
                    title: "Lifestyle Adjustments",
                    description: "Active individuals: Consider comfort fit or slightly looser fit for swelling.",
                    extended: "Those with active lifestyles may experience temporary finger swelling after exercise. A comfort fit (slightly rounded interior) or going up a quarter size can accommodate this while maintaining security."
                  },
                ].map((tip, index) => (
                  <article key={index} className="tip-card">
                    <div className="tip-content">
                      <div className="tip-icon-container">
                        {tip.icon}
                      </div>
                      <div className="tip-text">
                        <h3 className="tip-card-title">{tip.title}</h3>
                        <p className="tip-card-description">
                          {tip.description}
                        </p>
                        {tip.extended && (
                          <div className={`tip-extended ${expandedTips[index] ? 'expanded' : ''}`}>
                            <p>{tip.extended}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {tip.extended && (
                      <button 
                        className="tip-expand-button"
                        onClick={() => toggleTip(index)}
                        aria-expanded={expandedTips[index]}
                      >
                        {expandedTips[index] ? 'Show Less' : 'Read More'} 
                        {expandedTips[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </article>
                ))}
              </div>

              {/* Professional Mastery Section */}
              <section className="professional-mastery">
                <div className="mastery-header">
                  <Star className="mastery-icon" />
                  <h3 className="mastery-title">Jeweler's Technical Manual</h3>
                  <p className="mastery-subtitle">
                    Advanced techniques for perfect ring fitting
                  </p>
                </div>
                <div className="mastery-grid">
                  {[
                    {
                      title: "Metal Expansion Properties",
                      text: "Titanium expands less than gold at body temperature. Platinum has the least expansion.",
                    },
                    {
                      title: "Knuckle-to-Base Ratio",
                      text: "Ideal ring size is typically 0.25-0.5 sizes larger than base measurement for easy knuckle passage.",
                    },
                    {
                      title: "Age-Related Considerations",
                      text: "For clients over 60, recommend comfort fit designs for arthritic hands.",
                    },
                    {
                      title: "Cultural Wearing Styles",
                      text: "Traditional Indian wearing often prefers snugger fit, Western style prefers slightly looser comfort fit.",
                    },
                  ].map((tip, idx) => (
                    <article key={idx} className="mastery-tip">
                      <div className="mastery-content">
                        <h4 className="mastery-tip-title">{tip.title}</h4>
                        <p className="mastery-tip-text">{tip.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
        </section>

        {/* Professional Download Section */}
        <section className="download-section" style={tabAnimation}>
          <div className="download-card professional-download">
            <div className="download-content">
              <Download className="download-icon" aria-hidden="true" />
              <h3 className="download-title">Professional Ring Sizing Manual</h3>
              <p className="download-description">
                Download our comprehensive technical guide featuring measurement templates, 
                conversion charts, and advanced fitting methodologies used by master jewelers.
              </p>
              <button onClick={handleDownload} className="download-button professional-download-btn">
                <span className="button-content">
                  <Download className="button-icon" aria-hidden="true" />
                  Download Professional Guide
                  <ArrowRight className="button-arrow" aria-hidden="true" />
                </span>
              </button>
            </div>
            <div className="download-features">
              <div className="feature">
                <Check size={16} />
                <span>Printable ring sizer</span>
              </div>
              <div className="feature">
                <Check size={16} />
                <span>International size conversion chart</span>
              </div>
              <div className="feature">
                <Check size={16} />
                <span>Material-specific sizing guidelines</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RingSizeGuide;