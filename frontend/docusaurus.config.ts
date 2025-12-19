import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Tech Nexus",
  tagline: "Where Innovation Meets Automation",
  favicon: "img/robot-favicon.svg",

  future: {
    v4: true,
  },

  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",

  organizationName: "facebook",
  projectName: "docusaurus",

  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        indexBlog: true,
        indexPages: true,
      },
    ],
  ],

  themeConfig: {
    image: "img/robotic-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "ROBOTIC NEXUS",
      logo: {
        alt: "Robotic Nexus Logo",
        src: "img/robot-logo.svg",
        className: "navbar-logo-robotic",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "DOCS",
          className: "nav-link-robotic",
        },
        {
          to: "/blog",
          label: "BLOG",
          position: "left",
          className: "nav-link-robotic",
        },
        // GitHub link will be on the right
        {
          href: "https://github.com/facebook/docusaurus",
          label: "GITHUB",
          position: "right",
          className: "github-link-robotic",
        },
      ],
      style: "dark",
      hideOnScroll: false,
    },
    footer: {
      style: "dark",
      logo: {
        alt: "Robotic Nexus Footer Logo",
        src: "img/robot-logo-glow.svg",
        width: 80,
        height: 80,
        className: "footer-logo-robotic",
      },
      links: [
        {
          title: "TECHNOLOGY",
          items: [
            {
              label: "AI Modules",
              to: "/docs/ai-modules",
              className: "footer-link-robotic",
            },
            {
              label: "API Documentation",
              to: "/docs/api",
              className: "footer-link-robotic",
            },
            {
              label: "Hardware Specs",
              to: "/docs/hardware",
              className: "footer-link-robotic",
            },
            {
              label: "Integration Guide",
              to: "/docs/integration",
              className: "footer-link-robotic",
            },
          ],
        },
        {
          title: "RESOURCES",
          items: [
            {
              label: "Tutorials",
              to: "/tutorials",
              className: "footer-link-robotic",
            },
            {
              label: "Showcase",
              to: "/showcase",
              className: "footer-link-robotic",
            },
            {
              label: "Research Papers",
              to: "/research",
              className: "footer-link-robotic",
            },
            {
              label: "Documentation",
              to: "/docs",
              className: "footer-link-robotic",
            },
          ],
        },
        {
          title: "COMMUNITY",
          items: [
            {
              label: "Discord Hub",
              href: "https://discord.gg/robotics",
              className: "footer-link-robotic",
            },
            {
              label: "Developer Forum",
              href: "https://forum.robotic-nexus.com",
              className: "footer-link-robotic",
            },
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
              className: "footer-link-robotic",
            },
            {
              label: "Hackathons",
              to: "/hackathons",
              className: "footer-link-robotic",
            },
          ],
        },
        {
          title: "ENTERPRISE",
          items: [
            {
              label: "Solutions",
              to: "/solutions",
              className: "footer-link-robotic",
            },
            {
              label: "Careers",
              to: "/careers",
              className: "footer-link-robotic",
            },
            {
              label: "Support",
              to: "/support",
              className: "footer-ai-link",
            },
            {
              label: "Contact",
              to: "/contact",
              className: "footer-link-robotic",
            },
          ],
        },
      ],
      copyright: `
        <div class="footer-copyright-container">
          <span>© ${new Date().getFullYear()} Robotic Nexus.</span>
          <span class="system-status">
            <span class="status-indicator active"></span>
            <span class="status-text">All systems operational</span>
          </span>
        </div>
      `,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.nightOwl,
    },
  } satisfies Preset.ThemeConfig,

  stylesheets: [
    {
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      type: "text/css",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap",
      type: "text/css",
    },
  ],
};

export default config;
