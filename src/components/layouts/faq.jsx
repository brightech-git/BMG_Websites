import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SmartButton from "../ui/SmartButton";

const AccordionItem = React.memo(({ item, index, globalIndex, isOpen, isHighlighted, onToggle, itemRef }) => (
    <div
        ref={itemRef}
        className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:border-amber-200 ${
            isOpen ? "border-amber-300 shadow-amber-100" : "border-transparent"
        } ${isHighlighted ? "ring-1 ring-amber-400 ring-offset-1" : ""}`}
    >
        <button
            onClick={() => onToggle(index)}
            className="w-full p-2 text-left flex justify-between items-center group"
            aria-expanded={isOpen}
        >
            <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        isOpen
                            ? "bg-gradient-to-r from-amber-500 to-amber-600"
                            : "bg-gradient-to-r from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300"
                    }`}>
                        <span className={`font-semibold text-[10px] ${isOpen ? "text-white" : "text-amber-700"}`}>
                            {globalIndex + 1}
                        </span>
                    </div>
                </div>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-amber-800 transition-colors">
                    {item.question}
                </span>
            </div>
            <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                isOpen
                    ? "bg-amber-100 text-amber-600 rotate-180"
                    : "bg-gray-100 text-gray-600 group-hover:bg-amber-50 group-hover:text-amber-500"
            }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </span>
        </button>

        {/* CSS grid trick — smoother than max-height, no layout thrash */}
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
                <div className="p-6 pt-0 pl-16">
                    <div className="prose max-w-none text-gray-700">
                        {Array.isArray(item.answer) ? (
                            <ul className="space-y-3">
                                {item.answer.map((ans, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
    </div>
));

AccordionItem.displayName = "AccordionItem";

const FAQ = ({ languages, content }) => {
    const [selectedLang, setSelectedLang] = useState(languages[0]);
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const searchRef = useRef(null);
    const itemRefs = useRef([]);
    const debounceTimer = useRef(null);
    const navigate = useNavigate();

    const faqContent = useMemo(() => content[selectedLang] || [], [content, selectedLang]);

    const categories = useMemo(
        () => ["all", ...new Set(faqContent.map(s => s.title.toLowerCase().replace(/[^a-z]+/g, "-")))],
        [faqContent]
    );

    const filteredSections = useMemo(() => {
        const searchLower = debouncedSearch.toLowerCase();
        return faqContent
            .filter(section => {
                if (activeCategory === "all") return true;
                return section.title.toLowerCase().replace(/[^a-z]+/g, "-") === activeCategory;
            })
            .map(section => ({
                ...section,
                items: section.items.filter(item => {
                    if (!searchLower) return true;
                    return (
                        item.question.toLowerCase().includes(searchLower) ||
                        (typeof item.answer === "string" && item.answer.toLowerCase().includes(searchLower)) ||
                        (Array.isArray(item.answer) && item.answer.some(a => a.toLowerCase().includes(searchLower)))
                    );
                }),
            }))
            .filter(s => s.items.length > 0);
    }, [faqContent, activeCategory, debouncedSearch]);

    const totalQuestions = useMemo(
        () => filteredSections.reduce((acc, s) => acc + s.items.length, 0),
        [filteredSections]
    );

    const handleToggle = useCallback((index) => {
        setOpenIndex(prev => (prev === index ? null : index));
        setHighlightedIndex(index);
        setTimeout(() => setHighlightedIndex(null), 1000);
    }, []);

    const handleSearch = useCallback((e) => {
        const val = e.target.value;
        setSearchTerm(val);
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(val);
            setOpenIndex(null);
        }, 250);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchTerm("");
        setDebouncedSearch("");
        setOpenIndex(null);
        searchRef.current?.focus();
    }, []);

    const handleCategoryClick = useCallback((category) => {
        setActiveCategory(category);
        setSearchTerm("");
        setDebouncedSearch("");
        setOpenIndex(null);
    }, []);

    useEffect(() => {
        if (openIndex !== null && itemRefs.current[openIndex]) {
            itemRefs.current[openIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [openIndex]);

    useEffect(() => () => clearTimeout(debounceTimer.current), []);

    return (
        <div className="min-h-screen bg-[var(--primary-card-color)] p-2">
            <div className="container mx-auto px-2 py-2 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our jewellery, policies, and services.
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-lg p-2 mb-2">
                    <div className="flex justify-between items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search questions…"
                                className="w-full pl-9 pr-8 py-1.5 h-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label="Clear search"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Language toggle */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <label className="text-sm text-black font-bold">Language:</label>
                            <div className="relative flex items-center rounded-full bg-gray-100 p-0.5">
                                <span className={`absolute h-6 w-10 rounded-full bg-black transition-all duration-300 ${selectedLang === "en" ? "left-0.5" : "left-[42px]"}`} />
                                {["en", "ta"].map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => setSelectedLang(lang)}
                                        className={`relative z-10 w-10 text-xs font-medium transition-colors ${selectedLang === lang ? "text-white" : "text-gray-600"}`}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mt-1 p-2 border-t border-gray-100">
                        <div className="flex flex-wrap gap-1">
                            {categories.map(category => {
                                const isActive = category === activeCategory;
                                const displayName = category === "all"
                                    ? "All Questions"
                                    : faqContent.find(s => s.title.toLowerCase().replace(/[^a-z]+/g, "-") === category)?.title || category;
                                const count = category === "all"
                                    ? faqContent.reduce((acc, s) => acc + s.items.length, 0)
                                    : faqContent.find(s => s.title.toLowerCase().replace(/[^a-z]+/g, "-") === category)?.items.length || 0;

                                return (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 ${
                                            isActive
                                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-amber-200"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {displayName}
                                        <span className={`px-2 py-1 text-xs rounded-full ${isActive ? "bg-white/20" : "bg-gray-200"}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {debouncedSearch && (
                            <p className="text-xs text-gray-500 mt-1">
                                {totalQuestions} result{totalQuestions !== 1 ? "s" : ""} for &ldquo;{debouncedSearch}&rdquo;
                            </p>
                        )}
                    </div>
                </div>

                {/* FAQ Content */}
                <div className="space-y-2">
                    {filteredSections.length > 0 ? (
                        filteredSections.map((section, sectionIdx) => {
                            const sectionOffset = filteredSections
                                .slice(0, sectionIdx)
                                .reduce((acc, s) => acc + s.items.length, 0);

                            return (
                                <div key={sectionIdx}>
                                    <h2 className="text-lg font-bold text-amber-900 mt-4 pb-2">
                                        {section.title}
                                    </h2>
                                    <div className="space-y-4">
                                        {section.items.map((item, idx) => {
                                            const globalIndex = sectionOffset + idx;
                                            const index = `${sectionIdx}-${idx}`;
                                            return (
                                                <AccordionItem
                                                    key={index}
                                                    item={item}
                                                    index={index}
                                                    globalIndex={globalIndex}
                                                    isOpen={openIndex === index}
                                                    isHighlighted={highlightedIndex === index}
                                                    onToggle={handleToggle}
                                                    itemRef={el => { itemRefs.current[globalIndex] = el; }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                            <p className="text-gray-500">
                                Try adjusting your search or filter to find what you&apos;re looking for.
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
                                Can&apos;t find the answer you&apos;re looking for? Our customer support team is here to help.
                            </p>
                        </div>
                        <SmartButton
                            onClick={() => navigate("/contactStore")}
                            className="px-2 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                            Contact Support
                        </SmartButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
