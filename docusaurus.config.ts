import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Physical AI & Humanoid Robotics",
  tagline: "Bridging the gap between the digital brain and the physical body.",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://Quratulain-shah.github.io",
  baseUrl: "/ai-native-book/",

  organizationName: "Quratulain-shah",
  projectName: "ai-native-book",

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
            "https://github.com/Quratulain-shah/ai-native-book/tree/main/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl:
            "https://github.com/Quratulain-shah/ai-native-book/tree/main/",
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
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },
    navbar: {
      title: "🤖 HUMANOID ROBOTICS",

      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "DOCS",
          className: "nav-link-robotic",
        },

        {
          to: "/about",
          label: "BLOG",
          position: "left",
          className: "nav-link-robotic",
        },

        {
          href: "https://github.com/DevAbdullah90/Spec-Driven-Development-Hackathon-I",
          position: "right",
          className: "github-link-robotic",
          html: `
            <div class="github-container">
              <i class="fab fa-github github-icon-robotic"></i>
              <span class="github-text">GITHUB</span>
            </div>
          `,
        },

        {
          to: "/profile",
          position: "right",
          className: "profile-btn-robotic",
          html: `
    <div class="gradient-icon-container">
      <div class="icon-wrapper">
        <i class="fas fa-user"></i>
        <div class="gradient-overlay"></div>
      </div>
      <span class="icon-text">PROFILE</span>
    </div>
  `,
        },
        {
          to: "/register",
          position: "right",
          className: "register-btn-robotic",
          html: `
    <div class="gradient-icon-container">
      <div class="icon-wrapper">
        <i class="fas fa-rocket"></i>
        <div class="gradient-overlay"></div>
      </div>
      <span class="icon-text">REGISTER</span>
    </div>
  `,
        },
        {
          to: "/login",
          position: "right",
          className: "login-btn-robotic",
          html: `
    <div class="gradient-icon-container">
      <div class="icon-wrapper">
        <i class="fas fa-lock"></i>
        <div class="gradient-overlay"></div>
      </div>
      <span class="icon-text">LOGIN</span>
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
        alt: "Physical AI Footer Logo",
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyAiVwvD8kfytWfdSdoRNTeNeksIfK-T86bQ&s",
        width: 80,
        height: 80,
        className: "footer-logo-robotic",
      },
      links: [
        {
          title: "COURSE",
          items: [
            {
              label: "Overview",
              to: "/docs/overview",
              className: "footer-link-robotic",
            },
            {
              label: "Hardware Requirements",
              to: "/docs/hardware-requirements",
              className: "footer-link-robotic",
            },
            {
              label: "Neural Networks",
              to: "/docs/neural-networks",
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
              label: "Documentation",
              to: "/docs",
              className: "footer-link-robotic",
            },
            {
              label: "Research Papers",
              to: "/research",
              className: "footer-link-robotic",
            },
            {
              label: "Showcase",
              to: "/showcase",
              className: "footer-link-robotic",
            },
          ],
        },
        {
          title: "COMMUNITY",
          items: [
            {
              label: "GitHub Discussions",
              href: "https://github.com/DevAbdullah90/Spec-Driven-Development-Hackathon-I/discussions",
              className: "footer-link-robotic",
            },
            {
              label: "GitHub Issues",
              href: "https://github.com/DevAbdullah90/Spec-Driven-Development-Hackathon-I/issues",
              className: "footer-link-robotic",
            },
            {
              label: "Discord",
              href: "https://discord.gg/example",
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
          title: "MORE",
          items: [
            {
              label: "About Me",
              to: "/about",
              className: "footer-link-robotic",
            },
            {
              label: "Contact",
              to: "/contact",
              className: "footer-link-robotic",
            },
            {
              label: "GitHub Repo",
              href: "https://github.com/DevAbdullah90/Spec-Driven-Development-Hackathon-I",
              className: "footer-link-robotic",
            },
            {
              label: "Support",
              to: "/support",
              className: "footer-ai-link",
            },
          ],
        },
      ],
      copyright: `
        <div class="footer-copyright-container">
          <div class="footer-tech-stats">
            <div class="tech-stat">
              <span class="stat-icon"><i class="fas fa-brain"></i></span>
              <span class="stat-text">AI Models: <span class="stat-value">15+</span></span>
            </div>
            <div class="tech-stat">
              <span class="stat-icon"><i class="fas fa-robot"></i></span>
              <span class="stat-text">Robotics Projects: <span class="stat-value">50+</span></span>
            </div>
            <div class="tech-stat">
              <span class="stat-icon"><i class="fas fa-bolt"></i></span>
              <span class="stat-text">Active Learners: <span class="stat-value">1,000+</span></span>
            </div>
          </div>
          <div class="system-status">
            <span class="status-indicator active"></span>
            <span class="status-text">All systems operational</span>
          </div>
          <div class="copyright-text">
            © ${new Date().getFullYear()} Physical AI & Humanoid Robotics. Built with Docusaurus 🤖
          </div>
        </div>
      `,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.nightOwl,
      additionalLanguages: [
        "python",
        "cpp",
        "bash",
        "json",
        "javascript",
        "typescript",
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
    announcementBar: {
      id: "robotic_announcement",
      content:
        "🚀 <b>Welcome to Physical AI & Humanoid Robotics!</b> Explore the future of robotics technology with interactive demos and cutting-edge content.",
      backgroundColor: "#00ffff",
      textColor: "#000000",
      isCloseable: false,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [],

  stylesheets: [
    {
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      type: "text/css",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      type: "text/css",
    },
    {
      href: "https://unpkg.com/aos@2.3.1/dist/aos.css",
      type: "text/css",
    },
  ],

  scripts: [
    {
      src: "https://unpkg.com/aos@2.3.1/dist/aos.js",
      async: true,
    },
    {
      src: "/Spec-Driven-Development-Hackathon-I/js/robotic-ui.js",
      async: true,
      defer: true,
    },
  ],

  customFields: {
    googleClientId:
      "640440997207-sve6abkc5b85inma8ece5ujff75u672u.apps.googleusercontent.com",
  },
};

export default config;
