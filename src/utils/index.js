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
} from './fontSizes';

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
} from './typography';

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
} from './spacing';

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
} from './colors';

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
} from './designTokens';

// Default exports for convenience
export { default as fontSizesUtil } from './fontSizes';
export { default as typographyUtil } from './typography';
export { default as spacingUtil } from './spacing';
export { default as colorsUtil } from './colors';
export { default as designTokensUtil } from './designTokens';

