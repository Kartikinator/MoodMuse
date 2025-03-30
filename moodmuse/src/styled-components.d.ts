import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      bgPrimary: string;
      bgSecondary: string;
      bgTertiary: string;
      textPrimary: string;
      textSecondary: string;
      accentPrimary: string;
      accentSecondary: string;
      accentTertiary: string;
      success: string;
      warning: string;
      error: string;
      happy: string;
      sad: string;
      angry: string;
      neutral: string;
      surprised: string;
    };
    shadows: {
      card: string;
    };
    transitions: {
      standard: string;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
} 