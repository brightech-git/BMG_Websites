/**
 * Spacing Utility
 * 
 * Provides consistent spacing scale and helper functions
 * Uses rem-based spacing system for scalability
 */

// Base spacing scale in rem units
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
  40: '10rem',   // 160px
  48: '12rem',   // 192px
  64: '16rem',   // 256px
};

// Named spacing values for semantic use
export const spacingScale = {
  none: spacing[0],
  xs: spacing[1],    // 4px
  sm: spacing[2],    // 8px
  md: spacing[4],    // 16px
  lg: spacing[6],    // 24px
  xl: spacing[8],    // 32px
  '2xl': spacing[12], // 48px
  '3xl': spacing[16], // 64px
  '4xl': spacing[24], // 96px
  '5xl': spacing[32], // 128px
};

// Spacing scale in pixels (for reference)
export const spacingPx = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  64: '256px',
};

/**
 * Margin utilities
 * Helper functions to generate margin styles
 */
export const margin = {
  // All sides
  all: (size) => ({
    margin: spacing[size] || spacing[4],
  }),
  
  // Individual sides
  top: (size) => ({
    marginTop: spacing[size] || spacing[4],
  }),
  
  right: (size) => ({
    marginRight: spacing[size] || spacing[4],
  }),
  
  bottom: (size) => ({
    marginBottom: spacing[size] || spacing[4],
  }),
  
  left: (size) => ({
    marginLeft: spacing[size] || spacing[4],
  }),
  
  // Horizontal (left and right)
  x: (size) => ({
    marginLeft: spacing[size] || spacing[4],
    marginRight: spacing[size] || spacing[4],
  }),
  
  // Vertical (top and bottom)
  y: (size) => ({
    marginTop: spacing[size] || spacing[4],
    marginBottom: spacing[size] || spacing[4],
  }),
  
  // Custom margins
  custom: (top, right, bottom, left) => ({
    marginTop: spacing[top] || spacing[0],
    marginRight: spacing[right] || spacing[0],
    marginBottom: spacing[bottom] || spacing[0],
    marginLeft: spacing[left] || spacing[0],
  }),
};

/**
 * Padding utilities
 * Helper functions to generate padding styles
 */
export const padding = {
  // All sides
  all: (size) => ({
    padding: spacing[size] || spacing[4],
  }),
  
  // Individual sides
  top: (size) => ({
    paddingTop: spacing[size] || spacing[4],
  }),
  
  right: (size) => ({
    paddingRight: spacing[size] || spacing[4],
  }),
  
  bottom: (size) => ({
    paddingBottom: spacing[size] || spacing[4],
  }),
  
  left: (size) => ({
    paddingLeft: spacing[size] || spacing[4],
  }),
  
  // Horizontal (left and right)
  x: (size) => ({
    paddingLeft: spacing[size] || spacing[4],
    paddingRight: spacing[size] || spacing[4],
  }),
  
  // Vertical (top and bottom)
  y: (size) => ({
    paddingTop: spacing[size] || spacing[4],
    paddingBottom: spacing[size] || spacing[4],
  }),
  
  // Custom padding
  custom: (top, right, bottom, left) => ({
    paddingTop: spacing[top] || spacing[0],
    paddingRight: spacing[right] || spacing[0],
    paddingBottom: spacing[bottom] || spacing[0],
    paddingLeft: spacing[left] || spacing[0],
  }),
};

/**
 * Gap utilities for flexbox and grid
 */
export const gap = {
  // Gap for flexbox/grid
  all: (size) => ({
    gap: spacing[size] || spacing[4],
  }),
  
  // Row gap
  row: (size) => ({
    rowGap: spacing[size] || spacing[4],
  }),
  
  // Column gap
  column: (size) => ({
    columnGap: spacing[size] || spacing[4],
  }),
};

/**
 * Convert rem spacing to px
 * @param {string} remValue - Value in rem (e.g., '1.5rem')
 * @returns {number} Value in pixels
 */
export const remToPx = (remValue) => {
  const rem = parseFloat(remValue);
  const baseFontSize = 16; // Default browser font size
  return rem * baseFontSize;
};

/**
 * Convert px to rem spacing
 * @param {number} pxValue - Value in pixels
 * @returns {string} Value in rem (e.g., '1.5rem')
 */
export const pxToRem = (pxValue) => {
  const baseFontSize = 16;
  return `${pxValue / baseFontSize}rem`;
};

/**
 * Get spacing value by key
 * @param {string|number} key - Spacing key (e.g., 'md', 4, 'lg')
 * @returns {string} Spacing value in rem
 */
export const getSpacing = (key) => {
  // Check if it's a named spacing
  if (spacingScale[key]) {
    return spacingScale[key];
  }
  // Check if it's a numeric key
  if (spacing[key] !== undefined) {
    return spacing[key];
  }
  // Default to medium spacing
  return spacing[4];
};

export default spacing;

