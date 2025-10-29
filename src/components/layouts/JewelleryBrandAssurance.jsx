'use client';
import React from "react";
import { ShieldCheck, Gem, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import DragScrollComponent from './DragScrollComponent';
import "./JewelleryBrandAssurance.css";

const JewelleryBrandAssurance = ({
    assurances = [],
    bgColor = "#f9f9f9",
    textColor = "#222",
    iconColor = "#c0a060",
    backGroundColor = "#fff",
    backgroundColor = "var(--brand-background-color)",
}) => {
    const defaultAssurances = [
        { icon: <Gem color={iconColor} size={22} />, label: "Pure Silver Jewellery" },
        { icon: <ShieldCheck color={iconColor} size={22} />, label: "100% Authentic Guarantee" },
        { icon: <RefreshCw color={iconColor} size={22} />, label: "Easy Return & Warranty" },
    ];

    // Map passed assurances and apply fallback iconColor if not set
    const assuranceList = assurances.length > 0
        ? assurances.map(a => ({
            ...a,
            icon: React.cloneElement(a.icon, { color: a.icon.props.color || iconColor })
        }))
        : defaultAssurances;

    return (
        <div className="brand-assurance-wrapper">
            <DragScrollComponent>
                <div
                    className="brand-assurance-container"
                    style={{ background: bgColor, color: textColor }}
                >
                    {assuranceList.map((item, index) => (
                        <motion.div
                            key={index}
                            className="brand-assurance-item"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            style={{
                                background: backgroundColor
                                
                            }}
                        >
                            <span className="brand-icon" style={{ color: iconColor, background: backGroundColor, }}>
                                {item.icon}
                            </span>
                            <span className="brand-text">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </DragScrollComponent>
        </div>
    );
};

export default JewelleryBrandAssurance;