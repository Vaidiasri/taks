/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          50: '#f0f7ff',
          100: '#e0efff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        'indigo': {
          50: '#f0f5ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca'
        },
        'gray': {
          50: '#f9fafb',
          100: '#f3f4f6',  
          300: '#d1d5db',
          400: '#9ca3af',
          600: '#4b5563',
          700: '#374151',
          900: '#111827'
        }
      }
    },
  },
  plugins: [],
}