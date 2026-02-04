/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#050315',
        'background': '#fbfbfe',
        'primary': '#2f27ce',
        'secondary': '#dedcff',
        'accent': '#433bff',
      },
    },
  },
  plugins: [],
}


