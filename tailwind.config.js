/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Updated theme name in comments
        // 8 Lines theme colors
        gold: '#D4AF37',
        'gold-light': '#E5C158',
        dark: {
          DEFAULT: '#121212',
          lighter: '#1E1E1E',
          darker: '#0A0A0A',
        },
        border: '#333333',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui'),require('@tailwindcss/forms'),],
  daisyui: {
    themes: [
      {
        nethbookpoint: {
          "primary": "#d4af37",   // Gold color for buttons & highlights
          "secondary": "#333333", // Dark gray for secondary elements
          "accent": "#222222",    // Even darker gray for contrast
          "neutral": "#111111",   // Deep black background
          "base-100": "#000000",  // Pure black for the main background
          "info": "#f5f5f5",      // Light text for readability
          "success": "#28a745",   // Green for success states
          "warning": "#ffc107",   // Yellow for warnings
          "error": "#dc3545",     // Red for errors
        },
      },
    ],
  },
}