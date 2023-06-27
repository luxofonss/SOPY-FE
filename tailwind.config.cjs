/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px'
      }
    },
    backgroundImage: {
      'page-bg': 'linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);'
    },
    fontFamily: {
      sans: ['"PT Sans"', 'sans-serif'],
      inter: ['"Inter"', 'serif']
    },
    extend: {
      boxShadow: {
        'menu-item': 'inset 0px -2px 1px rgba(0, 0, 0, 0.05), inset 0px 1px 1px #FFFFFF'
      },
      colors: {
        neutral: {
          0: '#FFFFFF',
          100: '#FCFCFC',
          200: '#F4F4F4',
          300: '#EFEFEF',
          400: '#6F767E',
          500: '#33383F',
          600: '#272B30',
          700: '#1A1D1F',
          800: '#111315'
        },
        shade: {
          100: '#9A9FA5',
          200: '#6F767E',
          300: 'rgba(111, 118, 126, 0.4)',
          400: 'rgba(17, 19, 21, 0.5)'
        },
        'primary-blue': '#2A85FF',
        'primary-green': '#83BF6E',
        'primary-red': '#FF6A55',
        'primary-blue-2': '#8E59FF',
        secondary: {
          orange: '#FFBC99',
          purple: '#CABDFF',
          blue: '#B1E5FC',
          green: '#B5E4CA',
          yellow: '#FFD88D'
        },
        primary: '#1B73E8',
        'primary-0': '#f8e9ee',
        'primary-50': '#f2d2dc',
        'primary-100': '#ebbccb',
        'primary-150': '#e5a5b9',
        'primary-200': '#de8fa8',
        'primary-250': '#d77897',
        'primary-300': '#d16285',
        'primary-350': '#ca4b74',
        'primary-400': '#c43562',
        'primary-450': '#bd1e51',
        'primary-500': '#aa1b49',
        'primary-550': '#971841',
        'primary-600': '#841539',
        'primary-650': '#711231',
        'primary-700': '#5f0f29',
        'primary-750': '#4c0c20',
        'primary-800': '#390918',
        'orange-1': 'rgba(255,87,34,0.1)',
        'orange-2': '#ff9a00',
        'orange-3': '#ff7400',
        'orange-4': '#ff4d00',
        'orange-5': '#ff0000'
      }
    }
  },
  plugins: [require('flowbite/plugin'), require('@tailwindcss/line-clamp')]
}
