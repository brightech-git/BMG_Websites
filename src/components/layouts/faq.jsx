import React, { useState, useRef, useEffect } from "react";
import Footertwo from "./Footer";
import { useNavigate } from "react-router-dom";
import SmartButton from "../ui/SmartButton";

const FAQ = ({ languages, content }) => {
    const [selectedLang, setSelectedLang] = useState(languages[0]);
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const searchRef = useRef(null);
    const itemRefs = useRef([]);
    const navigate = useNavigate();

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
        setHighlightedIndex(index);
        setTimeout(() => setHighlightedIndex(null), 1000);
    };

    const faqContent = content[selectedLang] || [];

    // Extract all categories
    const categories = ["all", ...new Set(faqContent.map(section =>
        section.title.toLowerCase().replace(/[^a-z]+/g, "-")
    ))];

    // Filter FAQ items based on search term and active category
    const filteredSections = faqContent.filter(section => {
        if (activeCategory === "all") return true;
        const sectionSlug = section.title.toLowerCase().replace(/[^a-z]+/g, "-");
        return sectionSlug === activeCategory;
    }).map(section => {
        const filteredItems = section.items.filter(item => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return item.question.toLowerCase().includes(searchLower) ||
                (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchLower)) ||
                (Array.isArray(item.answer) && item.answer.some(ans =>
                    ans.toLowerCase().includes(searchLower)
                ));
        });
        return { ...section, items: filteredItems };
    }).filter(section => section.items.length > 0);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setOpenIndex(null);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        searchRef.current?.focus();
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setSearchTerm("");
        setOpenIndex(null);
    };

    // Scroll to item when opened
    useEffect(() => {
        if (openIndex !== null && itemRefs.current[openIndex]) {
            itemRefs.current[openIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [openIndex]);

    // Initialize refs array
    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0,
            filteredSections.reduce((acc, section) => acc + section.items.length, 0)
        );
    }, [filteredSections]);

    // Get stats for the current view
    const totalQuestions = filteredSections.reduce((acc, section) => acc + section.items.length, 0);
    const matchedQuestions = searchTerm ? totalQuestions : null;

    return (
        <div className="min-h-screen bg-[var(--primary-card-color)] p-2">


            <div className="container mx-auto px-2 py-2 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-4 animate-fade-in">
                    <h1 className="text-xl font-bold text-amber-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our jewellery, policies, and services.
                    </p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-xl shadow-lg p-2 mb-2 animate-slide-down">
                    <div className="flex  justify-end gap-6">
                        {/* Language Selector */}

                        <section className="flex items-right">
                            <label className="text-sm text-black font-bold mr-2">Language:</label>
                            <div
                                className="
                            relative flex items-center
                            rounded-full bg-gray-100 p-0.5
                            animate__animated animate__zoomIn
                            animate__delay-1s
                        "
                            >
                                {/* Active Indicator */}
                                <span
                                    className={`absolute h-6 w-10 rounded-full bg-black
                                transition-all duration-300
                                ${selectedLang === "en" ? "left-0.5" : "left-[42px]"}
                            `}
                                />

                                <button
                                    onClick={() => setSelectedLang("en")}
                                    className={`relative z-10 w-10 text-xs font-medium transition-colors
                                ${selectedLang === "en" ? "text-white" : "text-gray-600"}
                            `}
                                >
                                    EN
                                </button>

                                <button
                                    onClick={() => setSelectedLang("ta")}
                                    className={`relative z-10 w-10 text-xs font-medium transition-colors
                                ${selectedLang === "ta" ? "text-white" : "text-gray-600"}
                            `}
                                >
                                    TA
                                </button>
                            </div>
                        </section>

                        

                    </div>

                    {/* Categories */}
                    <div className="mt-1 p-2 border-t border-gray-100">
                        <div className="flex flex-wrap gap-1">
                            {categories.map((category) => {
                                const isActive = category === activeCategory;
                                const displayName = category === 'all' ? 'All Questions' :
                                    faqContent.find(s =>
                                        s.title.toLowerCase().replace(/[^a-z]+/g, "-") === category
                                    )?.title || category;
                                const count = category === 'all'
                                    ? faqContent.reduce((acc, section) => acc + section.items.length, 0)
                                    : faqContent.find(s =>
                                        s.title.toLowerCase().replace(/[^a-z]+/g, "-") === category
                                    )?.items.length || 0;

                                return (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 ${isActive
                                                ? 'bg-gradient-to-r from-orange-500  to-orange-600 text-white shadow-lg shadow-amber-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {displayName}
                                        <span className={`px-2 py-1 text-xs rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200'
                                            }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* FAQ Content */}
                <div className="space-y-2">
                    {filteredSections.length > 0 ? (
                        filteredSections.map((section, sectionIdx) => {
                            let itemCounter = 0;
                            return (
                                <div
                                    key={sectionIdx}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${sectionIdx * 100}ms` }}
                                >
                                    <h2 className="text-lg font-bold text-amber-900 mt-4 pb-2 ">
                                        {section.title}
                                    </h2>
                                    <div className="space-y-4">
                                        {section.items.map((item, idx) => {
                                            const globalIndex = filteredSections
                                                .slice(0, sectionIdx)
                                                .reduce((acc, s) => acc + s.items.length, 0) + idx;
                                            const index = `${sectionIdx}-${idx}`;
                                            itemCounter++;

                                            return (
                                                <div
                                                    ref={el => itemRefs.current[globalIndex] = el}
                                                    key={index}
                                                    className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:border-amber-200 ${openIndex === index
                                                            ? 'border-amber-300 shadow-amber-100'
                                                            : 'border-transparent'
                                                        } ${highlightedIndex === index ? 'ring-1 ring-amber-400 ring-offset-1' : ''
                                                        }`}
                                                    style={{ animationDelay: `${(sectionIdx * 100) + (idx * 50)}ms` }}
                                                >
                                                    <button
                                                        onClick={() => handleToggle(index)}
                                                        className="w-full p-2 text-left flex justify-between items-center group"
                                                        aria-expanded={openIndex === index}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-shrink-0 ">
                                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${openIndex === index
                                                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                                                                        : 'bg-gradient-to-r from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300'
                                                                    }`}>
                                                                    <span className={`font-semibold ${openIndex === index ? 'text-white' : 'text-amber-700'
                                                                        }`}>
                                                                        {itemCounter}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-800 group-hover:text-amber-800 transition-colors">
                                                                {item.question}
                                                            </span>
                                                        </div>
                                                        <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all ${openIndex === index
                                                                ? 'bg-amber-100 text-amber-600 rotate-180'
                                                                : 'bg-gray-100 text-gray-600 group-hover:bg-amber-50 group-hover:text-amber-500'
                                                            }`}>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </span>
                                                    </button>

                                                    <div className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                                        }`}>
                                                        <div className="p-6 pt-0 pl-16">
                                                            <div className="prose max-w-none text-gray-700">
                                                                {Array.isArray(item.answer) ? (
                                                                    <ul className="space-y-3">
                                                                        {item.answer.map((ans, i) => (
                                                                            <li key={i} className="flex items-start gap-3">
                                                                                <div className="flex-shrink-0 mt-2">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                                                </div>
                                                                                <span>{ans}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="leading-relaxed text-xs">{item.answer}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 animate-fade-in">
                            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                            <p className="text-gray-500">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className="mt-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl p-8 border-2 border-amber-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-amber-900 mb-2">Still have questions?</h3>
                            <p className="text-amber-800 text-sm">
                                Can't find the answer you're looking for? Our customer support team is here to help.
                            </p>
                        </div>
                        <SmartButton onClick={()=>  navigate("/contactStore")} className="px-2 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                            Contact Support
                        </SmartButton>
                    </div>
                </div>
            </div>  

        </div>
    );
};

export default FAQ;