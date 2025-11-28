import React, { useState } from "react";
import Header from "./Header";
import HeaderWithAuth from "./HeaderWithAuth";
import Footertwo from "./Footerthree";
import './FAQ.css';

const FAQ = ({ languages, content }) => {
    const [selectedLang, setSelectedLang] = useState(languages[0]);
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqContent = content[selectedLang] || [];

    // Helper function to get closest delay class
    const getDelayClass = (delayMs) => {
        const delays = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
        const closest = delays.reduce((prev, curr) =>
            Math.abs(curr - delayMs) < Math.abs(prev - delayMs) ? curr : prev
        );
        return `animate-delay-${closest}`;
    };

    // Calculate total item count for staggered animations
    let itemCounter = 0;

    return (
        <div className="faq-wrapper">
            <HeaderWithAuth />
            <div className="faq-container animate-fade-in animate-duration-normal">
                {/* Language Selector */}
                <div className="faq-header animate-slide-in-down animate-duration-normal">
                    <h1 className="faq-title-header animate-fade-in-right animate-delay-200">FAQ</h1>
                    <div className="faq-header-select-container">
                    <select
                        className="faq-header-select animate-fade-in-left animate-delay-300 hover-scale"
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                        aria-label="Select language"
                    >
                        {languages.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    </div>
                </div>


                {/* FAQ Accordion */}
                <div className="faq-section">
                    {faqContent.map((section, sectionIdx) => {
                        // Calculate delay for section title
                        const sectionDelay = Math.min(400 + (sectionIdx * 50), 1000);
                        return (
                            <div key={sectionIdx} className="faq-section-group">
                                <h2 className={`animate-fade-in-up ${getDelayClass(sectionDelay)}`}>
                                    {section.title}
                                </h2>
                                {section.items.map((item, idx) => {
                                    const index = `${sectionIdx}-${idx}`;
                                    // Calculate delay for each item (staggered effect)
                                    const itemDelay = Math.min(500 + (itemCounter * 100), 1000);
                                    itemCounter++;

                                    return (
                                        <div
                                            key={index}
                                            className={`faq-item animate-fade-in-up ${getDelayClass(itemDelay)}`}
                                        >
                                            <button
                                                onClick={() => handleToggle(index)}
                                                className="hover-pulse"
                                                aria-expanded={openIndex === index}
                                                aria-controls={`faq-answer-${index}`}
                                            >
                                                <span>{item.question}</span>
                                                <span aria-hidden="true">
                                                    {openIndex === index ? '−' : '+'}
                                                </span>
                                            </button>
                                            {openIndex === index && (
                                                <div
                                                    id={`faq-answer-${index}`}
                                                    className="answer animate-fade-in-down animate-duration-fast animate-delay-100"
                                                    role="region"
                                                    aria-labelledby={`faq-question-${index}`}
                                                >
                                                    {Array.isArray(item.answer) ? (
                                                        <ul>
                                                            {item.answer.map((ans, i) => {
                                                                const listDelay = Math.min(200 + (i * 50), 1000);
                                                                return (
                                                                    <li
                                                                        key={i}
                                                                        className={`animate-fade-in ${getDelayClass(listDelay)}`}
                                                                    >
                                                                        {ans}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <p>{item.answer}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footertwo />
        </div>
    );
};

export default FAQ;
