'use client';
import React from "react";
import { ShieldCheck, Gem, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import DragScrollComponent from './DragScrollComponent';

const JewelleryBrandAssurance = ({
    assurances = [],
    bgColor = "#f9f9f9",
    textColor = "#222",
    iconColor = "#c0a060",
    backgroundColor = "#f9f9f9",
    cardBackGround = "#F9E6F9"

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
        <div className="w-full overflow-hidden">
            <DragScrollComponent>
                <motion.div
                    className={`flex flex-row items-center gap-2 px-2 py-2 bg-[${bgColor}] text-[${textColor}]`}
               
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {assuranceList.map((item, index) => (
                        <motion.div
                            key={index}
                            className={`flex flex-col items-center justify-center flex-shrink-0 bg-[${cardBackGround}]  p-2 md:p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 touch-manipulation`}
                           
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span
                                className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-2 transition-all duration-300 group-hover:scale-110 bg-[${backgroundColor}] text-[${iconColor}]`}
                             
                            >
                                <span className="transform transition-transform duration-300 group-hover:rotate-12">
                                    {item.icon}
                                </span>
                            </span>
                            <span
                                className={`text-xs md:text-sm text-center leading-tight font-medium max-w-[100px] md:max-w-[120px] break-words text-[${textColor}]`}
                            >
                                {item.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </DragScrollComponent>


        </div>
    );
};

export default JewelleryBrandAssurance;