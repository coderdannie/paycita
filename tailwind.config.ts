/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      primaryColor: {
        custom: '0px 4px 23px rgba(0, 0, 0, 0.07)',
      },
      colors: {
        primary: {
          DEFAULT: 'hsla(271, 55%, 40%, 1)',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
      screens: {
        'min-999': { min: '999px' },
        'max-999': { max: '999px' }, // Custom media query for max-width
        'max-768': { max: '768px' },
      },
    },
  },
};

export default tailwindConfig;
