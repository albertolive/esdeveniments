const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: "Roboto Flex",
        barlow: "Barlow Condensed",
      },
      screens: {
        xs: "360px",
        sm: "576px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      animation: {
        "fast-pulse": "fast-pulse 900ms cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fast-pulse1": "fast-pulse 300ms cubic-bezier(0.4, 0, 0.6, 1) 100ms",
      },
      keyframes: {
        "fast-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      boxShadow: {
        lg: "0px 5px 50px 0px rgba(241, 241, 241, 0.05)",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
      },
    },
    colors: {
      primary: "#FF0037",
      primarydark: "#C8033F",
      primarySoft: "#FF003750",
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
