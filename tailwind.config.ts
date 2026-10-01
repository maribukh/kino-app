import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        container: "1920px",
      },
      colors: {
        text: {
          primary: "#FFFFFF",
          secondary: "#A9A9A9",
          disabled: "#505261",
        },
        color: {
          red: "#EC3013",
          green: "#4ADE80",
          orange: "#E27E04",
        },
        bg: {
          page: "#070C1C",
          card: "#1E2031",
          raised: "#2A2C3D",
        },
        tint: {
          red: "rgba(236, 48, 19, 0.1)",
          green: "rgba(46, 213, 115, 0.15)",
          white: "rgba(255, 255, 255, 0.1)",
          warning: "rgba(226, 126, 4, 0.1)",
        },
        overlay: {
          scrim: "rgba(7, 12, 28, 0.2)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        custom: {
          "e3e3e3-70": "rgba(227, 227, 227, 0.7)",
          "1e2031-50": "rgba(30, 32, 49, 0.5)",
        },
      },
      fontSize: {
        display: ["40px", { lineHeight: "auto" }],
        h1: ["24px", { lineHeight: "auto" }],
        h2: ["20px", { lineHeight: "auto" }],
        h3: ["18px", { lineHeight: "auto" }],
        button: ["14px", { lineHeight: "auto" }],
        overline: ["12px", { lineHeight: "auto" }],
        "label-m": ["14px", { lineHeight: "auto" }],
        "label-s": ["12px", { lineHeight: "auto" }],
        "body-l": ["16px", { lineHeight: "1.3" }],
        "body-m": ["14px", { lineHeight: "1.3" }],
        "body-s": ["12px", { lineHeight: "1.3" }],
      },
    },
  },
  plugins: [],
};

export default config;