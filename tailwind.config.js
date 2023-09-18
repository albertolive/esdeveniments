const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'roboto': 'Roboto',
      'barlow': 'Barlow Condensed',
    },
    screens: {
        xs: "360px",
        sm: "576px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    extend: {
      boxShadow: {
        'lg': '0px 5px 50px 0px rgba(241, 241, 241, 0.05)',
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
      },
      maxWidth: {
        "8xl": "1920px",
      },
    },
    colors: {
      primary: "#FF0037",
      primarySoft: "#FF4D73",
      whiteCorp: "#ffffff",
      darkCorp: "#E8E8E8",
      blackCorp: "#454545",
      bColor: "#cccccc",
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
