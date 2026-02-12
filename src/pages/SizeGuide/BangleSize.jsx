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
import "./BangleStyles.css";

const BangleSizeGuide = () => {
  const [activeTab, setActiveTab] = useState("guide");
  const [animateCards, setAnimateCards] = useState(false);
  const [selectedSize, setSelectedSize] = useState(2); // Default to M size
  const [expandedTips, setExpandedTips] = useState({});
  
  const chartRef = useRef(null);

  // Trigger entrance animation
  useEffect(() => {
    const timeout = setTimeout(() => setAnimateCards(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  // Master data
  const bangleSizes = useMemo(
    () => [
      { indian: "2.2", inches: '2.125"', mm: "54 mm", circumference: 16.9, handSize: "XS", popularity: 15 },
      { indian: "2.4", inches: '2.25"', mm: "57 mm", circumference: 17.8, handSize: "S", popularity: 25 },
      { indian: "2.6", inches: '2.375"', mm: "60 mm", circumference: 18.7, handSize: "M", popularity: 35 },
      { indian: "2.8", inches: '2.5"', mm: "63 mm", circumference: 19.5, handSize: "L", popularity: 20 },
      { indian: "2.10", inches: '2.625"', mm: "67 mm", circumference: 20.5, handSize: "XL", popularity: 5 },
      { indian: "2.12", inches: '2.75"', mm: "70 mm", circumference: 21.5, handSize: "XXL", popularity: 3 },
    ],
    []
  );

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/bangle-size-guide.pdf";
    link.download = "bangle-size-guide.pdf";
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
    <div className="bangle-container">
      <div className="bangle-content">
        {/* Header */}
        <header className="bangle-header" style={tabAnimation}>
          <div className="header-icon" aria-hidden="true">
            <Sparkles className="icon-large" />
          </div>
          <h1 className="main-title">Professional Bangle Sizing Guide</h1>
          <p className="header-description">
            Discover your perfect fit with our comprehensive measurement system and expert recommendations
          </p>
        </header>

        {/* Tabs Navigation */}
        <nav
          className="navigation-container"
          role="tablist"
          aria-label="Bangle size guide tabs"
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
                <h2>Professional Measurement Techniques</h2>
                <p>Follow these expert methods to determine your perfect bangle size with precision</p>
              </div>
              
              <div className="guide-grid">
                <section className="guide-card">
                  <h3 className="guide-card-title">
                    <Hand className="guide-card-icon" aria-hidden="true" />
                    Standard Measurement Protocol
                  </h3>
                  <ol className="steps-container">
                    {[
                      "Position your hand as if putting on a bangle - thumb tucked into palm, fingers together",
                      "Using a flexible measuring tape, measure around the widest part of your knuckles",
                      "Record the measurement in centimeters for highest accuracy",
                      "For verification, measure your dominant hand as it's typically slightly larger",
                      "Repeat measurement 2-3 times to ensure consistency",
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
                    <p><strong>Professional Note:</strong> Always measure at room temperature (20-22°C) as extreme temperatures can affect hand size.</p>
                  </div>
                </section>

                {/* Quick Reference */}
                <section className="guide-card">
                  <div className="visual-guide">
                    <div className="visual-content">
                      <div className="hand-icon-container">
                        <Hand className="hand-icon" aria-hidden="true" />
                        <div className="measurement-line"></div>
                      </div>
                      <h4 className="visual-title">Measurement Points</h4>
                      <p className="visual-description">
                        Widest knuckle circumference determines bangle size
                      </p>
                    </div>
                  </div>
                  
                  <div className="reference-section">
                    <h5 className="reference-title">Size Classification System</h5>
                    <ul className="reference-list">
                      {[
                        { size: "Petite Hands (XS-S)", range: "2.2 - 2.4", desc: "Circumference: 16.9-17.8 cm", class: "petite" },
                        { size: "Standard Hands (M)", range: "2.6", desc: "Circumference: 18.7 cm", class: "standard" },
                        { size: "Full Hands (L-XL)", range: "2.8 - 2.10", desc: "Circumference: 19.5-20.5 cm", class: "full" },
                        { size: "Extra Full Hands (XXL+)", range: "2.12+", desc: "Circumference: 21.5+ cm", class: "extra-full" },
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
                    <p>For wide-cuff bangles, add 0.5cm to your measured circumference</p>
                  </div>
                </section>
              </div>
            </div>
          )}

           {/* --- CHART TAB --- */}
          {activeTab === "chart" && (
            <div className="chart-card" style={tabAnimation} ref={chartRef}>
              <div className="chart-header">
                <h2 className="chart-title">Professional Bangle Size Reference Chart</h2>
                <p className="chart-description">
                  Comprehensive sizing data for precision fitting - all measurements in standard units
                </p>
              </div>

              {/* Visual Size Chart */}
              <div className="visual-size-chart">
                <div className="size-chart-container">
                  {bangleSizes.map((size, index) => (
                    <div 
                      key={size.indian}
                      className={`size-item ${selectedSize === index ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(index)}
                    >
                      <div className="size-visual">
                        <div 
                          className="bangle-circle" 
                          style={{ 
                            width: `${30 + index * 10}px`,
                            height: `${30 + index * 10}px`
                          }}
                        ></div>
                        <div className="size-label">{size.indian}</div>
                      </div>
                      <div className="size-details">
                        <div className="size-header">
                          <span className="indian-size">{size.indian}</span>
                          <span className={`hand-size-label hand-size-${size.handSize.toLowerCase()}`}>
                            {size.handSize}
                          </span>
                        </div>
                        <div className="size-measurements">
                          <div className="measurement">
                            <span className="measurement-label">Diameter:</span>
                            <span className="measurement-value">{size.inches} / {size.mm}</span>
                          </div>
                          <div className="measurement">
                            <span className="measurement-label">Circumference:</span>
                            <span className="measurement-value">{size.circumference} cm</span>
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
                        className="recommended-bangle"
                        style={{ 
                          width: `${40 + selectedSize * 8}px`,
                          height: `${40 + selectedSize * 8}px`
                        }}
                      ></div>
                      <Hand className="recommendation-hand" />
                    </div>
                    <div className="recommendation-info">
                      <h4>Size {bangleSizes[selectedSize].indian} ({bangleSizes[selectedSize].handSize})</h4>
                      <p>Perfect for hand circumference of approximately {bangleSizes[selectedSize].circumference}cm</p>
                      <div className="recommendation-tips">
                        <div className="recommendation-tip">
                          <strong>Fit:</strong> {selectedSize < 2 ? 'Snug' : selectedSize > 3 ? 'Comfortable' : 'Standard'}
                        </div>
                        <div className="recommendation-tip">
                          <strong>Prevalence:</strong> {bangleSizes[selectedSize].popularity}% of our collection
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Size Comparison Guide */}
              <div className="size-comparison">
                <h3 className="comparison-title">Visual Size Comparison</h3>
                <div className="comparison-visual">
                  <div className="hand-visual">
                    <Hand className="hand-icon-comparison" />
                    <div className="bangle-overlays">
                      {bangleSizes.map((size, index) => (
                        <div 
                          key={index}
                          className="bangle-overlay"
                          style={{ 
                            width: `${40 + index * 8}px`,
                            height: `${40 + index * 8}px`,
                            opacity: 0.7 - (index * 0.1)
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="comparison-labels">
                    <div className="comparison-label small">XS-S (Petite)</div>
                    <div className="comparison-label medium">M (Standard)</div>
                    <div className="comparison-label large">L-XXL (Full)</div>
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
                      For optimal fit: Match your hand circumference measurement to the closest size in the chart. 
                      Consider bangle width - wider designs may require going up one size. 
                      The prevalence percentage indicates how commonly each size is manufactured.
                    </p>
                    <div className="guidance-tips">
                      <div className="guidance-tip">
                        <strong>Standard Fit:</strong> Choose exact circumference match
                      </div>
                      <div className="guidance-tip">
                        <strong>Comfort Fit:</strong> Add 0.5cm to circumference measurement
                      </div>
                      <div className="guidance-tip">
                        <strong>Stacking Fit:</strong> Add 1.0cm for multiple bangles
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
                <h2 className="tips-title">Master Jeweler's Fitting Techniques</h2>
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
                    description: "Measure between 4-6 PM when hand size is most consistent. Avoid morning measurements when joints are typically smaller.",
                    extended: "Hand size can fluctuate throughout the day due to various factors like activity level, temperature, and hydration. The late afternoon tends to provide the most accurate representation of your average hand size."
                  },
                  {
                    icon: "📏",
                    title: "Design Width Factor",
                    description: "For bangles wider than 1cm, increase size by 0.25 increments. Ultra-wide cuffs may require full size increase.",
                    extended: "Wider bangles need to accommodate more of the hand's surface area. As a general rule, add 0.25 size increments for every additional centimeter in width beyond the standard 1cm."
                  },
                  {
                    icon: "↗️",
                    title: "Size Transition Protocol",
                    description: "When between sizes, select larger option for rigid metals, standard size for flexible designs.",
                    extended: "Rigid metals like platinum and tungsten have less give, so sizing up ensures comfortable wearing. More flexible materials like gold and silver can accommodate the smaller size."
                  },
                  {
                    icon: "💍",
                    title: "Stacking Methodology",
                    description: "For multiple bangles: Add 0.3cm for 2-3 bangles, 0.6cm for 4-6, 1.0cm for elaborate stacks.",
                    extended: "When stacking bangles, consider both the total width and the movement between pieces. More bangles require more room to move comfortably on your wrist without feeling constricted."
                  },
                  {
                    icon: "🌡️",
                    title: "Environmental Adaptation",
                    description: "Account for climate: tropical residents add 0.3cm, cold climate residents subtract 0.2cm from measurement.",
                    extended: "In warmer climates, hands tend to swell slightly due to heat and humidity. In colder climates, hands may contract. These adjustments ensure comfortable wearing year-round."
                  },
                  {
                    icon: "🎯",
                    title: "Lifestyle Adjustment",
                    description: "Active individuals: Add 0.4cm for comfort. Musicians/artists: Consider specialized sizing.",
                    extended: "Those with active lifestyles or specific professions may need custom sizing solutions. For example, pianists might prefer slightly looser bangles on their playing hand."
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
                    Advanced techniques for perfect bangle fitting
                  </p>
                </div>
                <div className="mastery-grid">
                  {[
                    {
                      title: "Material Expansion Coefficients",
                      text: "Gold expands 0.4% more than silver at body temperature. Platinum has minimal expansion.",
                    },
                    {
                      title: "Seasonal Sizing Variations",
                      text: "Hand size fluctuates up to 3% seasonally. Summer measurements typically run 2% larger.",
                    },
                    {
                      title: "Age-Related Considerations",
                      text: "For clients over 60, recommend 0.5cm larger size for arthritic comfort.",
                    },
                    {
                      title: "Cultural Wearing Styles",
                      text: "Traditional Indian wearing often prefers tighter fit (exact measurement), Western style prefers comfort fit (+0.5cm).",
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
              <h3 className="download-title">Professional Sizing Manual</h3>
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
                <span>Printable measurement tape</span>
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

export default BangleSizeGuide;