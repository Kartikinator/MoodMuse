// Define the theme interface
export interface ThemeInterface {
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
    [key: string]: string;
  };
  shadows: {
    card: string;
    [key: string]: string;
  };
  transitions: {
    standard: string;
    [key: string]: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    [key: string]: string;
  };
}

// Export the theme object with proper typing
export const theme: ThemeInterface = {
  colors: {
    bgPrimary: 'var(--bg-primary)',
    bgSecondary: 'var(--bg-secondary)',
    bgTertiary: 'var(--bg-tertiary)',
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    accentPrimary: 'var(--accent-primary)',
    accentSecondary: 'var(--accent-secondary)',
    accentTertiary: 'var(--accent-tertiary)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
    happy: 'var(--happy)',
    sad: 'var(--sad)',
    angry: 'var(--angry)',
    neutral: 'var(--neutral)',
    surprised: 'var(--surprised)',
  },
  shadows: {
    card: 'var(--card-shadow)',
  },
  transitions: {
    standard: 'var(--transition-standard)',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
}; 