/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: '#f8f5ef',
        ink: '#1f2933',
        muted: '#667085',
        accent: '#9a6b3f',
        sage: '#67866f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'Songti SC', 'serif'],
      },
    },
  },
  plugins: [],
};
