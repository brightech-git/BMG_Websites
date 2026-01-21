"use client";

import React, { useEffect, useState } from "react";
import { getLanguage } from "../../utils/language/language";
import { faqData } from "../../data/faqData";
import { tmFaqData } from "../../data/tmFaqData";


export default function FaqPage() {
    const [language, setLanguage] = useState("en");
    const [openIndex, setOpenIndex] = useState(null);


    const faqFinalData = language === "en" ? faqData : tmFaqData;

    useEffect(() => {
        setLanguage(getLanguage());
    }, []);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            className="w-full max-w-8xl mx-auto px-2 py-4"
            style={{

            }}
        >
            {/* Header */}
            {/* <div className="mb-8 text-center animate__animated animate__fadeInDown">
                <h1 className="text-xl font-semibold tracking-wide">
                    BMG Jewellers – Jewellery Chit Scheme FAQs
                </h1>
                <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--color-body-text)" }}
                >
                    Detailed Version (for website)
                </p>
            </div> */}

            {/* FAQ List */}
            <div className="space-y-4">
                {faqFinalData.map((item, index) => (
                    <div
                        key={index}
                        className="border rounded-lg transition-all duration-300"
                        style={{
                            borderColor: "var(--border-light)",
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-primary-text)",
                        }}
                    >
                        {/* Question */}
                        <button
                            onClick={() => toggle(index)}
                            className="w-full text-left px-4 py-2 flex justify-between items-center"
                        >
                            <span className="text-sm font-medium">
                                {language === "en"
                                    ? item.question
                                    : item.question}
                            </span>
                            <span
                                className={`text-lg transition-transform duration-300 ${openIndex === index ? "rotate-45" : ""
                                    }`}
                            >
                                +
                            </span>
                        </button>

                        {/* Answer */}
                        {openIndex === index && (
                            <div className="px-4 pb-4 text-xs leading-relaxed animate__animated animate__fadeIn">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
