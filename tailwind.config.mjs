/** @type {import('tailwindcss').Config} */
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        "primary-fixed": "#c4e7ff",
        "outline-variant": "#45464d",
        "on-tertiary-fixed": "#3d0026",
        "surface-variant": "#2d3449",
        "on-error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#85145a",
        surface: '#0b1326',
        "on-background": "#dae2fd",
        "tertiary-fixed-dim": "#ffafd3",
        "inverse-on-surface": "#283044",
        "on-primary-container": "#008abb",
        "on-tertiary": "#620040",
        "inverse-surface": "#dae2fd",
        "secondary-container": "#39485a",
        "tertiary-fixed": "#ffd8e7",
        "tertiary-container": "#360021",
        "on-surface": "#dae2fd",
        "surface-container-highest": "#2d3449",
        outline: '#909097',
        "error-container": "#93000a",
        "on-primary-fixed-variant": "#004c69",
        "on-secondary-fixed": "#0d1c2d",
        error: '#ffb4ab',
        "primary-container": "#001a27",
        background: '#0b1326',
        "on-surface-variant": '#c6c6cd',
        "on-secondary": "#233143",
        "surface-tint": "#7bd0ff",
        "secondary-fixed": "#d4e4fa",
        primary: '#7bd0ff',
        "on-primary": "#00354a",
        "surface-bright": "#31394d",
        "on-tertiary-container": "#cf5497",
        "inverse-primary": "#00668a",
        "surface-container-low": "#131b2e",
        "surface-container-lowest": "#060e20",
        "secondary-fixed-dim": "#b9c8de",
        "on-secondary-container": "#a7b6cc",
        "surface-container-high": "#222a3d",
        "on-secondary-fixed-variant": "#39485a",
        secondary: '#b9c8de',
        "on-primary-fixed": "#001e2c",
        "surface-container": "#171f33",
        "on-error": "#690005",
        "primary-fixed-dim": "#7bd0ff",
        "surface-dim": "#0b1326",
        tertiary: '#ffafd3'
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
