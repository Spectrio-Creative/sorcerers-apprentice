import { defaultTheme } from "@vuepress/theme-default";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";

module.exports = {
  title: "The Sorcerer’s Apprentice (the docs)",
  description: "Just playing around",
  theme: defaultTheme({
    navbar: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/docs/" },
      { text: "Previous", link: "/previous" },
    ],
    sidebarDepth: 1,
    sidebar: {
      "/": [
        "/README.md",
        {
          text: "Docs", // required
          title: "Docs", // required
          // link: "/next/", // optional
          collapsable: true, // optional, defaults to true
          children: ["/docs/README.md", "/docs/text-layer.md"],
        },
      ],
    },
  }),
  plugins: [
    docsearchPlugin({
      // options
    }),
  ],
};
