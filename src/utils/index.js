/**
 * Utils Index
 * 
 * Central export point for all utility modules
 * Import utilities from this file for convenience
 */

// Font Sizes
export {
  fontSizes,
  fontSizesPx,
  headingSizes,
  bodySizes,
  captionSizes,
  getResponsiveFontSize,
  remToPx as remToPxFont,
  pxToRem as pxToRemFont,
} from './fontSizes.js';

// Typography
export {
  fontFamilies,
  fontWeights,
  lineHeights,
  letterSpacing,
  typography,
  textColors as typographyTextColors,
  createTypography,
  getHeadingStyle,
} from './typography.js';

// Spacing
export {
  spacing,
  spacingScale,
  spacingPx,
  margin,
  padding,
  gap,
  remToPx,
  pxToRem,
  getSpacing,
} from './spacing.js';

// Colors
export {
  colors,
  textColors,
  backgroundColors,
  borderColors,
  gradients,
  buttonColors,
  getColor,
  getTextColor,
  getBackgroundColor,
  getBorderColor,
  getGradient,
  createColorStyle,
} from './colors.js';

// Design Tokens
export {
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  mediaQueries,
  headerHeights,
  focusOutline,
  effects,
  getBorderRadius,
  getShadow,
  getTransition,
  getZIndex,
  createResponsiveStyle,
  createFocusStyle,
  designTokens,
} from './designTokens.js';

// Default exports for convenience
export { default as fontSizesUtil } from './fontSizes.js';
export { default as typographyUtil } from './typography.js';
export { default as spacingUtil } from './spacing.js';
export { default as colorsUtil } from './colors.js';
export { default as designTokensUtil } from './designTokens.js';


export {
  formatNumber,
  formatCurrency,
  formatWeight,
  formatDate,
  formatTime,
  formatDateTime,
  formatApiDate,
  formatApiTime,
  formatApiDateTime,
} from './formatters.js';
