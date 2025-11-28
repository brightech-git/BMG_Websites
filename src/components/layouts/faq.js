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

    return (
        <div className="">
            <HeaderWithAuth />
        <div className="faq-container max-w-5xl mx-auto p-4 mt-150px " style={{marginTop:'150px'}}>
            {/* Language Selector */}
                <div className="faq-header">
                    <h1 className="faq-title-header">FAQ</h1>
                    <select className="faq-header-select"
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                    >
                        {languages.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>


            {/* FAQ Accordion */}
                <div className="faq-section">
                    {faqContent.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            <h2>{section.title}</h2>
                            {section.items.map((item, idx) => {
                                const index = `${sectionIdx}-${idx}`;
                                return (
                                    <div key={index} className="faq-item">
                                        <button onClick={() => handleToggle(index)}>
                                            <span>{item.question}</span>
                                            <span>{openIndex === index ? '-' : '+'}</span>
                                        </button>
                                        {openIndex === index && (
                                            <div className="answer">
                                                {Array.isArray(item.answer) ? (
                                                    <ul>
                                                        {item.answer.map((ans, i) => (
                                                            <li key={i}>{ans}</li>
                                                        ))}
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
                    ))}
                </div>

        </div>
        <Footertwo />
        </div>
    );
};

export default FAQ;
