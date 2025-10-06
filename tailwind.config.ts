import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './styles/**/*.{ts,tsx,css}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7f8',
          100: '#feeef1',
          200: '#fbd6dd',
          300: '#f7adbb',
          400: '#f07a95',
          500: '#e84f76',
          600: '#d62f5d',
          700: '#b3234c',
          800: '#931e40',
          900: '#7a1d3a'
        }
      }
    }
  },
  plugins: []
}

export default config
