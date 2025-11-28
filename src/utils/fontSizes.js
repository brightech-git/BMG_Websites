/**
 * Font Sizes Utility
 * 
 * Provides consistent font size constants and helpers
 * Based on a typographic scale using rem units
 */

// Font size scale in rem units
export const fontSizes = {
  // Extra small
  xs: '0.75rem',    // 12px
  // Small
  sm: '0.875rem',   // 14px
  // Base (default body text)
  base: '1rem',     // 16px
  // Medium
  md: '1.125rem',   // 18px
  // Large
  lg: '1.25rem',    // 20px
  // Extra large
  xl: '1.5rem',     // 24px
  // 2X Large
  '2xl': '1.875rem', // 30px
  // 3X Large
  '3xl': '2.25rem',  // 36px
  // 4X Large
  '4xl': '3rem',     // 48px
  // 5X Large
  '5xl': '3.75rem',  // 60px
  // 6X Large
  '6xl': '4.5rem',   // 72px
};

// Font size scale in pixels (for reference)
export const fontSizesPx = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  md: '18px',
  lg: '20px',
  xl: '24px',
  '2xl': '30px',
  '3xl': '36px',
  '4xl': '48px',
  '5xl': '60px',
  '6xl': '72px',
};

// Typography scale for headings
export const headingSizes = {
  h1: fontSizes['4xl'],  // 48px / 3rem
  h2: fontSizes['3xl'], // 36px / 2.25rem
  h3: fontSizes['2xl'], // 30px / 1.875rem
  h4: fontSizes.xl,     // 24px / 1.5rem
  h5: fontSizes.lg,     // 20px / 1.25rem
  h6: fontSizes.md,     // 18px / 1.125rem
};

// Body text sizes
export const bodySizes = {
  small: fontSizes.sm,   // 14px
  base: fontSizes.base,  // 16px
  large: fontSizes.lg,   // 20px
};

// Caption and label sizes
export const captionSizes = {
  xs: fontSizes.xs,      // 12px
  sm: fontSizes.sm,      // 14px
};

/**
 * Get responsive font size
 * Returns an object with responsive font sizes for different breakpoints
 * 
 * @param {string} baseSize - Base font size (e.g., 'lg')
 * @param {object} responsive - Responsive overrides { sm: 'md', md: 'lg', lg: 'xl' }
 * @returns {object} Responsive font size object
 */
export const getResponsiveFontSize = (baseSize, responsive = {}) => {
  const base = fontSizes[baseSize] || fontSizes.base;
  
  return {
    fontSize: base,
    '@media (max-width: 768px)': {
      fontSize: fontSizes[responsive.sm] || base,
    },
    '@media (min-width: 769px) and (max-width: 992px)': {
      fontSize: fontSizes[responsive.md] || base,
    },
    '@media (min-width: 993px)': {
      fontSize: fontSizes[responsive.lg] || base,
    },
  };
};

/**
 * Convert rem to px
 * @param {string} remValue - Value in rem (e.g., '1.5rem')
 * @returns {number} Value in pixels
 */
export const remToPx = (remValue) => {
  const rem = parseFloat(remValue);
  const baseFontSize = 16; // Default browser font size
  return rem * baseFontSize;
};

/**
 * Convert px to rem
 * @param {number} pxValue - Value in pixels
 * @returns {string} Value in rem (e.g., '1.5rem')
 */
export const pxToRem = (pxValue) => {
  const baseFontSize = 16;
  return `${pxValue / baseFontSize}rem`;
};

export default fontSizes;

