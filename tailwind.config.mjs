/** @type {import('tailwindcss').Config} */
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        "primary-fixed": "#d8ecfa",
        "outline-variant": "#394759",
        "on-tertiary-fixed": "#132431",
        "surface-variant": "#293646",
        "on-error-container": "#ffe2df",
        "on-tertiary-fixed-variant": "#405b70",
        surface: '#151b26',
        "on-background": "#f1f5f9",
        "tertiary-fixed-dim": "#b7cedf",
        "inverse-on-surface": "#273443",
        "on-primary-container": "#91c9ec",
        "on-tertiary": "#203747",
        "inverse-surface": "#e5ebf1",
        "secondary-container": "#303d4d",
        "tertiary-fixed": "#d8e7f2",
        "tertiary-container": "#30495b",
        "on-surface": "#f1f5f9",
        "surface-container-highest": "#293646",
        outline: '#8492a6',
        "error-container": "#5d2528",
        "on-primary-fixed-variant": "#315c76",
        "on-secondary-fixed": "#15202c",
        error: '#ffb4ab',
        "primary-container": "#1b3a4f",
        background: '#151b26',
        "on-surface-variant": '#b8c2cf',
        "on-secondary": "#24303d",
        "surface-tint": "#72b7e5",
        "secondary-fixed": "#d7e0ea",
        primary: '#72b7e5',
        "on-primary": "#0b2a3b",
        "surface-bright": "#314052",
        "on-tertiary-container": "#c9dde9",
        "inverse-primary": "#4d94c3",
        "surface-container-low": "#1b2432",
        "surface-container-lowest": "#111722",
        "secondary-fixed-dim": "#b8c2cf",
        "on-secondary-container": "#cfd7e0",
        "surface-container-high": "#253243",
        "on-secondary-fixed-variant": "#445364",
        secondary: '#aab8c8',
        "on-primary-fixed": "#0b2a3b",
        "surface-container": "#202b3a",
        "on-error": "#4b1518",
        "primary-fixed-dim": "#72b7e5",
        "surface-dim": "#151b26",
        tertiary: '#9bb6cb'
      },
      fontFamily: {
        headline: ['Space Grotesk'],
        body: ['Inter'],
        label: ['Space Grotesk'],
        mono: ['JetBrains Mono']
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      }
    }
  },
  plugins: [
    forms,
    containerQueries
  ]
};
