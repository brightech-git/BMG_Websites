/**
 * Design Tokens Utility
 * 
 * Provides centralized design tokens including border radius, shadows,
 * transitions, z-index, and breakpoints
 * Uses CSS variables from style.css for consistency
 */

/**
 * Border Radius
 * Border radius values mapped to CSS variables
 */
export const borderRadius = {
  none: '0',
  sm: 'var(--radius-sm)',   // 0.375rem / 6px
  md: 'var(--radius-md)',   // 0.5rem / 8px
  lg: 'var(--radius-lg)',   // 0.75rem / 12px
  xl: 'var(--radius-xl)',   // 1rem / 16px
  full: '9999px',          // Fully rounded
};

/**
 * Box Shadows
 * Shadow values mapped to CSS variables
 */
export const shadows = {
  none: 'none',
  sm: 'var(--shadow-sm)',   // 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)
  md: 'var(--shadow-md)',   // 0 0.5rem 1rem rgba(0, 0, 0, 0.15)
  lg: 'var(--shadow-lg)',   // 0 1rem 3rem rgba(0, 0, 0, 0.175)
  color: 'var(--shadow-color)', // rgba(0, 0, 0, 0.1)
};

/**
 * Transitions
 * Transition values mapped to CSS variables
 */
export const transitions = {
  default: 'var(--transition)',        // all 0.3s ease
  fast: 'var(--transition-fast)',       // all 0.15s ease
  slow: 'all 0.5s ease',
  slower: 'all 0.8s ease',
  // Specific property transitions
  color: 'color 0.3s ease',
  background: 'background-color 0.3s ease',
  transform: 'transform 0.3s ease',
  opacity: 'opacity 0.3s ease',
  all: 'all 0.3s ease',
};

/**
 * Z-Index Scale
 * Consistent z-index values for layering
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
  max: 9999,
};

/**
 * Breakpoints
 * Responsive breakpoint values
 */
export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1600px',
};

/**
 * Breakpoint Media Queries
 * Pre-defined media query strings
 */
export const mediaQueries = {
  xs: `(max-width: ${breakpoints.sm})`,
  sm: `(min-width: ${breakpoints.sm})`,
  smMax: `(max-width: ${breakpoints.md})`,
  md: `(min-width: ${breakpoints.md})`,
  mdMax: `(max-width: ${breakpoints.lg})`,
  lg: `(min-width: ${breakpoints.lg})`,
  lgMax: `(max-width: ${breakpoints.xl})`,
  xl: `(min-width: ${breakpoints.xl})`,
  xlMax: `(max-width: ${breakpoints['2xl']})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
};

/**
 * Header Heights
 * Header height values from CSS variables
 */
export const headerHeights = {
  desktop: 'var(--header-height)',        // 80px
  mobile: 'var(--mobile-header-height)', // 60px
};

/**
 * Focus Outline
 * Focus outline styles
 */
export const focusOutline = {
  default: 'var(--focus-outline)',
  color: 'var(--primary-hover-color)',
  width: '2px',
  style: 'solid',
  offset: '2px',
};

/**
 * Overlay and Blur
 * Overlay and blur effects
 */
export const effects = {
  overlay: 'var(--overlay-bg)',           // rgba(0, 0, 0, 0.3)
  blur: 'var(--overlay-blur)',            // blur(2px)
  textShadow: 'var(--text-shadow)',      // 0 1px 2px rgba(0, 0, 0, 0.3)
};

/**
 * Get border radius by size
 * 
 * @param {string} size - Border radius size (sm, md, lg, xl, full)
 * @returns {string} Border radius value
 */
export const getBorderRadius = (size = 'md') => {
  return borderRadius[size] || borderRadius.md;
};

/**
 * Get shadow by size
 * 
 * @param {string} size - Shadow size (none, sm, md, lg)
 * @returns {string} Shadow value
 */
export const getShadow = (size = 'md') => {
  return shadows[size] || shadows.md;
};

/**
 * Get transition by type
 * 
 * @param {string} type - Transition type (default, fast, slow, color, etc.)
 * @returns {string} Transition value
 */
export const getTransition = (type = 'default') => {
  return transitions[type] || transitions.default;
};

/**
 * Get z-index by layer
 * 
 * @param {string} layer - Z-index layer (base, dropdown, modal, etc.)
 * @returns {number} Z-index value
 */
export const getZIndex = (layer = 'base') => {
  return zIndex[layer] || zIndex.base;
};

/**
 * Create responsive style object
 * 
 * @param {object} styles - Base styles
 * @param {object} responsive - Responsive overrides { sm: {...}, md: {...} }
 * @returns {object} Responsive style object
 */
export const createResponsiveStyle = (styles, responsive = {}) => {
  const result = { ...styles };
  
  if (responsive.sm) {
    result[`@media ${mediaQueries.smMax}`] = responsive.sm;
  }
  
  if (responsive.md) {
    result[`@media ${mediaQueries.md}`] = responsive.md;
  }
  
  if (responsive.lg) {
    result[`@media ${mediaQueries.lg}`] = responsive.lg;
  }
  
  return result;
};

/**
 * Create focus style
 * 
 * @param {object} options - Focus style options
 * @param {string} options.color - Focus color
 * @param {string} options.width - Focus width
 * @param {string} options.offset - Focus offset
 * @returns {object} Focus style object
 */
export const createFocusStyle = ({
  color = focusOutline.color,
  width = focusOutline.width,
  offset = focusOutline.offset,
}) => {
  return {
    outline: `${width} solid ${color}`,
    outlineOffset: offset,
  };
};

/**
 * Design Tokens Export
 * Centralized export of all design tokens
 */
export const designTokens = {
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  mediaQueries,
  headerHeights,
  focusOutline,
  effects,
  // Helper functions
  getBorderRadius,
  getShadow,
  getTransition,
  getZIndex,
  createResponsiveStyle,
  createFocusStyle,
};

export default designTokens;

