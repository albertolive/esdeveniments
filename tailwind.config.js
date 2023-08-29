const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
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
      primary: "#FFB000",
      primarySoft: "#FFC64D",
      secondary: "#002933",
      secondarySoft: "#266E80",
      whiteCorp: "#F9F9F7",
      darkCorp: "#E3E1CC",
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
