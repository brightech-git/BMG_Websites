/**
 * Typography Utility
 * 
 * Provides typography presets, font families, and helper functions
 * Uses CSS variables from style.css for consistency
 */

import { fontSizes, headingSizes } from './fontSizes';

// Font families mapped to CSS variables
export const fontFamilies = {
  primary: "var(--primary-font)",      // 'Gloock', 'serif'
  secondary: "var(--secondary-font)",  // 'Domine', 'Montserrat', 'sans-serif'
  title: "var(--title-font)",          // 'Dancing Script'
};

// Font weights
export const fontWeights = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// Line heights
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

/**
 * Typography Presets
 * Pre-configured typography styles for common use cases
 */
export const typography = {
  // Heading styles
  h1: {
    fontFamily: fontFamilies.primary,
    fontSize: headingSizes.h1,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    color: 'var(--primary-text-color)',
  },
  
  h2: {
    fontFamily: fontFamilies.primary,
    fontSize: headingSizes.h2,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    color: 'var(--primary-text-color)',
  },
  
  h3: {
    fontFamily: fontFamilies.primary,
    fontSize: headingSizes.h3,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    color: 'var(--primary-text-color)',
  },
  
  h4: {
    fontFamily: fontFamilies.secondary,
    fontSize: headingSizes.h4,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    color: 'var(--primary-text-color)',
  },
  
  h5: {
    fontFamily: fontFamilies.secondary,
    fontSize: headingSizes.h5,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    color: 'var(--primary-text-color)',
  },
  
  h6: {
    fontFamily: fontFamilies.secondary,
    fontSize: headingSizes.h6,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    color: 'var(--primary-text-color)',
  },
  
  // Body text styles
  body: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    color: 'var(--primary-text-color)',
  },
  
  bodyLarge: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    color: 'var(--primary-text-color)',
  },
  
  bodySmall: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    color: 'var(--primary-text-color)',
  },
  
  // Title/Display styles
  title: {
    fontFamily: fontFamilies.title,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.wide,
    color: 'var(--primary-text-color)',
  },
  
  // Caption styles
  caption: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    color: 'var(--secondary-text-color)',
  },
  
  captionSmall: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    color: 'var(--secondary-text-color)',
  },
  
  // Label styles
  label: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    color: 'var(--primary-text-color)',
    textTransform: 'uppercase',
  },
  
  // Button text styles
  button: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: 'capitalize',
  },
  
  buttonSmall: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: 'capitalize',
  },
};

/**
 * Text color utilities using CSS variables
 */
export const textColors = {
  primary: 'var(--primary-text-color)',
  secondary: 'var(--secondary-text-color)',
  white: 'var(--white-color)',
  hover: 'var(--primary-hover-color)',
  grey: 'var(--grey-color)',
  black: 'var(--black-color)',
  green: 'var(--green-color)',
  gold: 'var(--gold-color)',
  blue: 'var(--blue-color)',
  purple: 'var(--purple-color)',
  orange: 'var(--orange-color)',
  red: 'var(--red-color)',
  theme: 'var(--primary-theme-color)',
};

/**
 * Create custom typography style
 * 
 * @param {object} options - Typography options
 * @param {string} options.fontFamily - Font family (primary, secondary, title)
 * @param {string} options.fontSize - Font size key (xs, sm, base, lg, etc.)
 * @param {number} options.fontWeight - Font weight (100-900)
 * @param {string} options.lineHeight - Line height key (none, tight, normal, etc.)
 * @param {string} options.letterSpacing - Letter spacing key (tight, normal, wide, etc.)
 * @param {string} options.color - Text color key (primary, secondary, etc.)
 * @returns {object} Typography style object
 */
export const createTypography = ({
  fontFamily = 'secondary',
  fontSize = 'base',
  fontWeight = 400,
  lineHeight = 'normal',
  letterSpacing: ls = 'normal',
  color = 'primary',
}) => {
  return {
    fontFamily: fontFamilies[fontFamily] || fontFamilies.secondary,
    fontSize: fontSizes[fontSize] || fontSizes.base,
    fontWeight: fontWeight,
    lineHeight: lineHeights[lineHeight] || lineHeights.normal,
    letterSpacing: letterSpacing[ls] || letterSpacing.normal,
    color: textColors[color] || textColors.primary,
  };
};

/**
 * Get heading style by level
 * 
 * @param {number} level - Heading level (1-6)
 * @returns {object} Heading style object
 */
export const getHeadingStyle = (level) => {
  const headingMap = {
    1: typography.h1,
    2: typography.h2,
    3: typography.h3,
    4: typography.h4,
    5: typography.h5,
    6: typography.h6,
  };
  
  return headingMap[level] || typography.h3;
};

export default typography;

