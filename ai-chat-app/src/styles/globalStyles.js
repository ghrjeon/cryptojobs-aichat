import { css, Global } from '@emotion/react';
import { fontFamily } from './typography';

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: ${fontFamily.text};
    line-height: 1.5;
    color: #1d1d1f;
    background-color: #ffffff;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${fontFamily.display};
  }

  code, pre {
    font-family: ${fontFamily.mono};
  }

  /* Improve text rendering on macOS */
  @media screen and (-webkit-min-device-pixel-ratio: 2), 
         screen and (min-resolution: 2dppx) {
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }

  /* Improve text rendering in Dark Mode */
  @media (prefers-color-scheme: dark) {
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;
