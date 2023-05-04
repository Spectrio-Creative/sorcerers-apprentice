import { defaultTheme } from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";
// import { containerPlugin } from '@vuepress/plugin-container'

module.exports = {
  title: "The Sorcerer’s Apprentice (the docs)",
  description: "For templating projects like telling brooms to fill buckets",
  base: "/documentation/sorcerers-apprentice/",
  theme: defaultTheme({
    home: "/",
    navbar: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/docs/" },
      { text: "Releases", link: "https://github.com/Spectrio-Creative/sorcerers-apprentice/releases" },
    ],
    sidebarDepth: 1,
    sidebar: {
      "/": [
        "/README.md",
        {
          text: "Docs", // required
          // link: "/docs/", // optional
          children: ["/docs/README.md", "/docs/project-organization/README.md", "/docs/text-layer/README.md", "/docs/image-layer/README.md", "/docs/audio-layer/README.md", "/docs/pre-comps/README.md"],
        },
        {
          text: "Downloads",
          link: "https://github.com/Spectrio-Creative/sorcerers-apprentice/releases",
        }
      ],
    },
  }),
  plugins: [
    searchPlugin({
      // options
    }),
    // containerPlugin({
    //   // options
    //   // before: (info) => `<div class="custom-container ${type}">${info ? `<p class="custom-container-title">${info}</p>` : ''}\n`,
    //   // before: (info) => `<div class="custom-container ${type}">\n`,
    //   // after: "</div>\n",
    //   // validate: (params) => true,

    //   // render: false,
    // }),
  ],
};