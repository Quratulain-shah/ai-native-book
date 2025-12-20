import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "ROBOTIC NEXUS",
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
  onBrokenMarkdownLinks: "warn",

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

  themeConfig: {
    image: "img/robotic-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },
    navbar: {
      title: "ROBOTIC NEXUS",
      
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
        {
          type: "dropdown",
          label: "LANGUAGE",
          position: "right",
          className: "language-toggle-robotic",
          items: [
            {
              label: "English",
              to: "#",
              className: "language-option",
            },
            {
              label: "اردو",
              to: "#",
              className: "language-option",
            },
            {
              label: "Español",
              to: "#",
              className: "language-option",
            },
          ],
        },
        {
          type: "html",
          position: "right",
          value: `
            <div class="user-auth-section">
              <button class="login-btn-robotic">
                <i class="fas fa-robot"></i>
                <span>LOGIN</span>
              </button>
              <button class="signup-btn-robotic">
                <i class="fas fa-bolt"></i>
                <span>SIGN UP</span>
              </button>
            </div>
          `,
        },
        {
          href: "https://github.com/facebook/docusaurus",
          position: "right",
          className: "github-link-robotic",
          html: `
            <div class="github-container">
              <i class="fab fa-github github-icon-robotic"></i>
              <span class="github-text">GITHUB</span>
              <span class="github-badge">2.4k</span>
            </div>
          `,
        },
      ],
      style: "dark",
      hideOnScroll: false,
    },
    footer: {
      style: "dark",
      logo: {
        alt: "Robotic Nexus Footer Logo",
        src: "https://images.stockcake.com/public/6/b/3/6b3ca488-efe3-41ea-8d46-fcdfd9c30fe2_large/friendly-robot-buddy-stockcake.jpg",
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
          <div class="footer-tech-stats">
            <div class="tech-stat">
              <span class="stat-icon"><i class="fas fa-server"></i></span>
              <span class="stat-text">Servers: <span class="stat-value">98%</span></span>
            </div>
            <div class="tech-stat">
              <span class="stat-icon"><i class="fas fa-robot"></i></span>
              <span class="stat-text">Bots Active: <span class="stat-value">2,458</span></span>
            </div>
            <div class="tech-stat">
              <span class="stat-icon"><i class="fas fa-bolt"></i></span>
              <span class="stat-text">Uptime: <span class="stat-value">99.9%</span></span>
            </div>
          </div>
          <div class="system-status">
            <span class="status-indicator active"></span>
            <span class="status-text">All systems operational</span>
          </div>
          <div class="copyright-text">
            © ${new Date().getFullYear()} Robotic Nexus. All systems powered by AI.
          </div>
        </div>
      `,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.nightOwl,
      additionalLanguages: [
        "bash",
        "javascript",
        "typescript",
        "python",
        "cpp",
        "rust",
        "go",
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,

  plugins: [],

  stylesheets: [
    {
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      type: "text/css",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap",
      type: "text/css",
    },
  ],

  scripts: [
    {
      src: "/js/custom-robotic.js",
      async: true,
    },
  ],
};

export default config;
