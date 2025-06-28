"use client";

export const theme = {
  colors: {
    primary: '#3b82f6', // Blue for CTA buttons (matching pricing page)
    primaryHover: '#2563eb', // Darker blue for hover
    secondary: '#f0f7ff', // Light blue background
    accent: '#60a5fa', // Lighter blue accent
    accentHover: '#3b82f6',
    text: '#1e293b',
    textLight: '#64748b',
    background: '#ffffff',
    backgroundAlt: '#f8fafc',
    border: '#e2e8f0',
    success: '#10b981',
    error: '#ef4444',
    destructive: '#ef4444',
    destructiveHover: '#dc2626',
  },
  fonts: {
    body: 'var(--font-geist-sans)',
    heading: 'var(--font-geist-sans)',
    mono: 'var(--font-geist-mono)',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  variants: {
    button: {
      primary: "bg-[#3b82f6] text-white hover:bg-[#2563eb]",
      secondary: "bg-[#f1f5f9] text-[#1e293b] hover:bg-[#e2e8f0]",
      outline: "border border-[#e2e8f0] bg-transparent hover:bg-[#f8fafc]",
      accent: "bg-[#f0f7ff] text-[#3b82f6] hover:bg-[#dbeafe]",
      destructive: "bg-[#ef4444] text-white hover:bg-[#dc2626]",
    }
  }
};

export type Theme = typeof theme;

// CSS class helpers
export const themeClasses = {
  primaryButton: "bg-[#3b82f6] hover:bg-[#2563eb] text-white",
  secondaryButton: "bg-[#f0f7ff] text-[#1e293b] hover:bg-[#dbeafe]",
  outlineButton: "bg-transparent border border-[#e2e8f0] text-[#1e293b] hover:bg-[#f0f7ff]",
  accentButton: "bg-[#60a5fa] hover:bg-[#3b82f6] text-white",
  primaryText: "text-[#1e293b]",
  secondaryText: "text-[#64748b]",
  backgroundPrimary: "bg-white",
  backgroundSecondary: "bg-[#f0f7ff]",
  border: "#e2e8f0",
  gradientBlue: "bg-gradient-to-r from-[#3b82f6] to-[#2563eb]",
}; 