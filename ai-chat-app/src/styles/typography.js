import { css } from '@emotion/react';

// Font family definitions
export const fontFamily = {
  display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  text: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
  mono: '"SF Mono", SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
};

// Font weight scale
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Font size scale (in pixels)
export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '15px',
  lg: '16px',
  xl: '18px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '30px',
  '5xl': '36px',
  '6xl': '48px',
};

// Line height scale
export const lineHeight = {
  tight: 1.2,
  base: 1.5,
  relaxed: 1.75,
};

// Letter spacing scale
export const letterSpacing = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: '0',
  wide: '0.01em',
};

// Text styles
export const textStyles = {
  h1: css`
    font-family: ${fontFamily.display};
    font-size: ${fontSize['5xl']};
    font-weight: ${fontWeight.bold};
    line-height: ${lineHeight.tight};
    letter-spacing: ${letterSpacing.tighter};
    color: #1d1d1f;
  `,
  h2: css`
    font-family: ${fontFamily.display};
    font-size: ${fontSize['4xl']};
    font-weight: ${fontWeight.semibold};
    line-height: ${lineHeight.tight};
    letter-spacing: ${letterSpacing.tighter};
    color: #1d1d1f;
  `,
  h3: css`
    font-family: ${fontFamily.display};
    font-size: ${fontSize['3xl']};
    font-weight: ${fontWeight.semibold};
    line-height: ${lineHeight.tight};
    letter-spacing: ${letterSpacing.tight};
    color: #1d1d1f;
  `,
  h4: css`
    font-family: ${fontFamily.display};
    font-size: ${fontSize['2xl']};
    font-weight: ${fontWeight.semibold};
    line-height: ${lineHeight.tight};
    letter-spacing: ${letterSpacing.tight};
    color: #1d1d1f;
  `,
  subtitle1: css`
    font-family: ${fontFamily.text};
    font-size: ${fontSize.xl};
    font-weight: ${fontWeight.medium};
    line-height: ${lineHeight.base};
    letter-spacing: ${letterSpacing.tight};
    color: #1d1d1f;
  `,
  subtitle2: css`
    font-family: ${fontFamily.text};
    font-size: ${fontSize.lg};
    font-weight: ${fontWeight.medium};
    line-height: ${lineHeight.base};
    letter-spacing: ${letterSpacing.tight};
    color: #1d1d1f;
  `,
  body1: css`
    font-family: ${fontFamily.text};
    font-size: ${fontSize.base};
    font-weight: ${fontWeight.regular};
    line-height: ${lineHeight.base};
    letter-spacing: ${letterSpacing.normal};
    color: #1d1d1f;
  `,
  body2: css`
    font-family: ${fontFamily.text};
    font-size: ${fontSize.sm};
    font-weight: ${fontWeight.regular};
    line-height: ${lineHeight.base};
    letter-spacing: ${letterSpacing.normal};
    color: #1d1d1f;
  `,
  caption: css`
    font-family: ${fontFamily.text};
    font-size: ${fontSize.xs};
    font-weight: ${fontWeight.regular};
    line-height: ${lineHeight.base};
    letter-spacing: ${letterSpacing.normal};
    color: #6e6e73;
  `,
  button: css`
    font-family: ${fontFamily.text};
    font-size: ${fontSize.base};
    font-weight: ${fontWeight.medium};
    line-height: ${lineHeight.base};
    letter-spacing: ${letterSpacing.tight};
  `,
  code: css`
    font-family: ${fontFamily.mono};
    font-size: ${fontSize.sm};
    font-weight: ${fontWeight.regular};
    line-height: ${lineHeight.base};
    letter-spacing: ${letterSpacing.normal};
  `,
};

// Helper function to apply text styles
export const applyTextStyle = (styleName) => css`
  ${textStyles[styleName]}
`;
