/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#1A1A2E',
        iris: '#5C6AC4',
        mist: '#EEF0FB',
        cloud: '#F5F6FA',
        pebble: '#E2E4ED',
        slate: '#8B8FA8',
        leaf: '#22C55E',
        amber: '#F59E0B',
        coral: '#EF4444',
      },
      boxShadow: {
        card: '0 20px 40px rgba(17, 24, 39, 0.08)',
        soft: '0 8px 20px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
}
