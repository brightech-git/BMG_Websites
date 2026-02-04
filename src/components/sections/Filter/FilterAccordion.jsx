import React, { useState } from 'react';
import './FilterAccordion.css';

const FilterAccordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion-section">
            <button className="accordion-header" onClick={toggleAccordion}>
                {title}
                <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9662;</span>
            </button>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

export default FilterAccordion;