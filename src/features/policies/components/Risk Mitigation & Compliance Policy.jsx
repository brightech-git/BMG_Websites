import React, { useState } from "react";

const sections = [
    {
        title: "1. Legal & Regulatory Compliance",
        items: [
            "Compliance with BIS and hallmarking norms where applicable.",
            "Maintenance of GST registration and proper invoicing.",
            "Adherence to e-commerce regulations under Indian law.",
            "AML (Anti-Money Laundering) checks for suspicious or unusually large transactions.",
        ],
    },
    {
        title: "2. Authentication & Valuation",
        items: [
            "Every product clearly described as 'Silver Jewellery with Gold Polish'.",
            "Transparent product listings with weight, finish, and material details.",
            "Valuation done based on silver base and gold polish category (not bullion).",
        ],
    },
    {
        title: "3. Secure Payment Methods",
        items: [
            "Payments accepted only through secure, PCI-DSS compliant gateways.",
            "Support for UPI, net banking, and major credit/debit cards.",
            "No handling of cash transactions for online orders.",
        ],
    },
    {
        title: "4. Shipping & Insurance Policies",
        items: [
            "Orders shipped only via reputed logistics partners with tracking.",
            "Insurance coverage provided against loss or damage during transit.",
            "Tamper-proof packaging to prevent substitution or pilferage.",
        ],
    },
    {
        title: "5. Customer Dispute & Grievance Redressal",
        items: [
            "Clear return/refund policy disclosed on website.",
            "Dedicated customer support team for order and payment-related issues.",
            "Dispute resolution mechanisms in compliance with consumer protection law.",
        ],
    },
    {
        title: "6. Fraud Prevention & Monitoring",
        items: [
            "Transaction monitoring to detect unusual purchase patterns.",
            "OTP and CVV validation for all payments.",
            "Address verification for first-time and high-value buyers.",
        ],
    },
    {
        title: "Conclusion",
        items: [
            "Through these measures, BMG Jewellers ensures that risks associated with online sale of silver jewellery with gold polish are minimized. The business maintains compliance with regulatory requirements, provides customer trust and transparency, and ensures a secure, fraud-free shopping experience.",
        ],
    },
];

const PolicyPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
         

            <div className="min-h-screen   bg-[--primary-color]">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-xl md:text-2xl font-bold text-[var(--primary-hover-color)]">
                            BMG Jewellers – Risk Mitigation & Compliance Policy
                        </h1>


                        <p className="text-xs sm:text-sm text-leading-relaxed max-w-3xl mx-auto">
                            BMG Jewellers is engaged in the online sale of silver jewellery with gold polish. The products offered
                            are lifestyle/fashion jewellery and are not investment-grade gold bullion. While the segment involves
                            handling of precious metals, the associated risks are mitigated through secure processes, customer
                            verification, and compliant business practices.
                        </p>
                    </div>

                    {/* Policy Sections */}
                    <div className="space-y-2">
                        {sections.map((section, idx) => (
                            <div
                                key={idx}
                                className={`rounded-xl shadow-lg overflow-hidden border transition-all duration-300 ${openIndex === idx
                                        ? 'border-amber-300 shadow-amber-100'
                                        : 'border-amber-100'
                                    }`}
                            >
                                <button
                                    className={`w-full p-2 text-left flex justify-between items-center transition-all duration-300 ${openIndex === idx
                                            ? 'bg-gradient-to-r from-amber-50 to-amber-100'
                                            : 'bg-white hover:bg-amber-50'
                                        }`}
                                    onClick={() => toggleAccordion(idx)}
                                >
                                    <span className="text-sm font-semibold text-amber-900 flex items-center gap-3">
                                        <div className={`w-2 h-8 rounded-full transition-all duration-300 ${openIndex === idx ? 'bg-amber-500' : 'bg-amber-300'
                                            }`}></div>
                                        {section.title}
                                    </span>
                                    <span className={`transform transition-transform duration-300 text-amber-600 ${openIndex === idx ? 'rotate-180' : ''
                                        }`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </span>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div className="p-3 bg-white border-t border-amber-100">
                                        <ul className="space-y-2">
                                            {section.items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 group">
                                                    <div className="mt-1.5 flex-shrink-0">
                                                        <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-amber-500 transition-colors"></div>
                                                    </div>
                                                    <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Note */}
                    <div className="m-4 p-3 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-amber-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-900 text-base mb-1">
                                    Our Commitment
                                </h3>
                                <p className="text-amber-800 text-sm">
                                    We are committed to maintaining the highest standards of compliance and customer protection.
                                    For any queries regarding our policies, please contact our support team.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        
        </>
    );
};

export default PolicyPage;