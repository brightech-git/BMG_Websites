import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top with smooth behavior
  const scrollToTop = (e) => {
    e?.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Animation variants
  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      y: 20,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.5,
      y: 20,
      transition: {
        duration: 0.2
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const progressVariants = {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: scrollProgress / 100,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover="hover"
          whileTap="tap"
          className="fixed bottom-6 right-6 z-50"
        >
          <Link
            to="#"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="relative group block"
          >
            {/* Main Button */}
            <div className="relative">
              {/* Progress Ring Background */}
              <svg className="absolute inset-0 w-14 h-14 -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeOpacity="0.2"
                  className="transition-all duration-300"
                />
                <motion.circle
                  cx="28"
                  cy="28"
                  r="26"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  variants={progressVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    strokeDasharray: "163.36", // 2 * π * 26 ≈ 163.36
                    strokeDashoffset: 163.36 * (1 - scrollProgress / 100),
                  }}
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Button Content */}
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center text-white relative overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                {/* Ripple Effect Background */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ scale: 0, opacity: 0.3 }}
                  whileHover={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Icon Container */}
                <div className="relative flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowUp size={20} strokeWidth={2.5} />
                  </motion.div>
                  
                  {/* Progress Percentage (shown on hover) */}
                  <motion.span 
                    className="absolute -bottom-1 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ y: 5 }}
                    whileHover={{ y: 0 }}
                  >
                    {Math.round(scrollProgress)}%
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap shadow-lg">
                Back to Top
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
              </div>
            </motion.div>

            {/* Keyboard Shortcut Hint (optional) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-medium"
            >
              ⌘ + ↑
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



export default BackToTop;