import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // All tokens use CSS variables — supports dark/light mode switching
        body:        'rgb(var(--c-body) / <alpha-value>)',
        surface:     'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        primary:     'rgb(var(--c-primary) / <alpha-value>)',
        secondary:   'rgb(var(--c-secondary) / <alpha-value>)',
        accent:      'rgb(var(--c-accent) / <alpha-value>)',
        success:     'rgb(var(--c-success) / <alpha-value>)',
        danger:      'rgb(var(--c-danger) / <alpha-value>)',
        cta:         'rgb(var(--c-cta) / <alpha-value>)',
      },
      boxShadow: {
        card:  '0 0 30px rgba(0,0,0,0.15)',
        toast: '0 0 30px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
