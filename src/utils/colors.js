/**
 * Colors Utility
 * 
 * Provides color constants and utilities mapped to CSS variables
 * Uses root CSS variables from style.css for consistency
 */

/**
 * Primary Colors
 * Main brand and UI colors
 */
export const colors = {
  // Primary colors
  primary: 'var(--primary-color)',
  primaryText: 'var(--primary-text-color)',
  primaryHover: 'var(--primary-hover-color)',
  primaryCard: 'var(--primary-card-color)',
  primaryTheme: 'var(--primary-theme-color)',
  
  // Secondary colors
  secondary: 'var(--secondary-card-color)',
  secondaryText: 'var(--secondary-text-color)',
  
  // Neutral colors
  white: 'var(--white-color)',
  black: 'var(--black-color)',
  grey: 'var(--grey-color)',
  
  // Accent colors
  green: 'var(--green-color)',
  gold: 'var(--gold-color)',
  blue: 'var(--blue-color)',
  purple: 'var(--purple-color)',
  orange: 'var(--orange-color)',
  red: 'var(--red-color)',
  
  // Background colors
  featureBg: 'var(--feature-bg-color)',
  catBg: 'var(--cat-bg-color)',
  mainCatBg: 'var(--main-cat-bg-color)',
  virtualShopCard: 'var(--virtual-shop-card)',
  
  // Shadow and overlay
  shadow: 'var(--shadow-color)',
  overlay: 'var(--overlay-bg)',
  shimmer: 'var(--shimmer-color)',
};

/**
 * Text Colors
 * Semantic text color utilities
 */
export const textColors = {
  primary: colors.primaryText,
  secondary: colors.secondaryText,
  white: colors.white,
  black: colors.black,
  grey: colors.grey,
  hover: colors.primaryHover,
  accent: colors.primaryHover,
  success: colors.green,
  warning: colors.orange,
  error: colors.red,
  info: colors.blue,
  theme: colors.primaryTheme,
};

/**
 * Background Colors
 * Semantic background color utilities
 */
export const backgroundColors = {
  primary: colors.primary,
  white: colors.white,
  card: colors.primaryCard,
  secondary: colors.secondary,
  feature: colors.featureBg,
  category: colors.catBg,
  mainCategory: colors.mainCatBg,
  virtualShop: colors.virtualShopCard,
  overlay: colors.overlay,
};

/**
 * Border Colors
 * Border color utilities
 */
export const borderColors = {
  default: colors.grey,
  primary: colors.primaryText,
  hover: colors.primaryHover,
  white: colors.white,
  black: colors.black,
  light: colors.primaryCard,
};

/**
 * Gradient Colors
 * Gradient definitions from CSS variables
 */
export const gradients = {
  text: 'var(--gradient-text)',
  border: 'var(--gradient-border)',
  primary: 'var(--primary-gradient)',
  background: 'var(--gradient-bg-color)',
  brand: 'var(--brand-background-color)',
  brandAlt: 'var(--brand-bg-color)',
  addToCart: 'var(--addtocart-product-color)',
  login: 'var(--login-button-background)',
  cart: 'var(--cart-button-background)',
  mainBtn: 'var(--main-btn-background)',
  wishlist: 'var(--whistlist-button-background)',
};

/**
 * Button Colors
 * Button-specific color utilities
 */
export const buttonColors = {
  primary: colors.primaryHover,
  background: 'var(--button-bg)',
  text: colors.white,
  hover: colors.primaryHover,
  login: gradients.login,
  cart: gradients.cart,
  main: gradients.mainBtn,
  wishlist: gradients.wishlist,
};

/**
 * Get color by name
 * Helper function to get color value
 * 
 * @param {string} colorName - Color name (e.g., 'primary', 'white', 'grey')
 * @returns {string} CSS variable or color value
 */
export const getColor = (colorName) => {
  return colors[colorName] || colors.primaryText;
};

/**
 * Get text color by name
 * 
 * @param {string} colorName - Text color name
 * @returns {string} CSS variable for text color
 */
export const getTextColor = (colorName) => {
  return textColors[colorName] || textColors.primary;
};

/**
 * Get background color by name
 * 
 * @param {string} colorName - Background color name
 * @returns {string} CSS variable for background color
 */
export const getBackgroundColor = (colorName) => {
  return backgroundColors[colorName] || backgroundColors.white;
};

/**
 * Get border color by name
 * 
 * @param {string} colorName - Border color name
 * @returns {string} CSS variable for border color
 */
export const getBorderColor = (colorName) => {
  return borderColors[colorName] || borderColors.default;
};

/**
 * Get gradient by name
 * 
 * @param {string} gradientName - Gradient name
 * @returns {string} CSS variable for gradient
 */
export const getGradient = (gradientName) => {
  return gradients[gradientName] || gradients.primary;
};

/**
 * Create color style object
 * 
 * @param {object} options - Color options
 * @param {string} options.color - Text color name
 * @param {string} options.backgroundColor - Background color name
 * @param {string} options.borderColor - Border color name
 * @returns {object} Color style object
 */
export const createColorStyle = ({
  color,
  backgroundColor,
  borderColor,
}) => {
  const style = {};
  
  if (color) {
    style.color = getTextColor(color);
  }
  
  if (backgroundColor) {
    style.backgroundColor = getBackgroundColor(backgroundColor);
  }
  
  if (borderColor) {
    style.borderColor = getBorderColor(borderColor);
  }
  
  return style;
};

export default colors;

