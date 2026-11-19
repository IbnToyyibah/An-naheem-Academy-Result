/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        muted: '#667085',
        line: '#d8dee8',
        panel: '#ffffff',
        page: '#f5f7fb',
        primary: {
          DEFAULT: '#1e3a8a',
          dark: '#1e40af',
          soft: '#dbeafe'
        },
        accent: '#b42318',
      },
      boxShadow: {
        panel: '0 18px 50px rgba(17, 24, 39, 0.07)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      }
    }
  },
  plugins: []
};
