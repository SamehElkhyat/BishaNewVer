// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#003366',
          dark: '#002244',
        },
      },
    },
  },
  corePlugins: {
    // Enable the new CSS variables for colors
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  future: {
    // Enable future flags
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  experimental: {
    // Enable experimental features
    optimizeUniversalDefaults: true,
  },
  plugins: [
    // Add any additional plugins here
  ],
}