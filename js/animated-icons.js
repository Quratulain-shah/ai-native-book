// Animated Icons for Robotic AI Theme
document.addEventListener("DOMContentLoaded", function () {
  // Add animation styles for icons
  const style = document.createElement("style");
  style.textContent = `
    /* Animated Logo */
    .animated-logo {
      display: inline-block;
      animation: robot-dance 3s ease-in-out infinite;
    }
    
    /* Navbar Icon Animations */
    .nav-icon {
      display: inline-block;
      margin-right: 8px;
    }
    
    .spinning-book {
      animation: spin 4s linear infinite;
    }
    
    .blinking-user {
      animation: blink 2s infinite;
    }
    
    .floating-gear {
      animation: float 3s ease-in-out infinite;
    }
    
    .rotating-lock {
      animation: rotate 3s linear infinite;
    }
    
    .bouncing-rocket {
      animation: bounce 2s infinite;
    }
    
    .pulse-computer {
      animation: pulse 1.5s infinite;
    }
    
    /* Footer Icon Animations */
    .footer-icon {
      display: inline-block;
      margin-right: 6px;
    }
    
    .rotating-book {
      animation: spin-slow 5s linear infinite;
    }
    
    .pulse-chart {
      animation: pulse-fast 1s infinite;
    }
    
    .spinning-tools {
      animation: spin 3s linear infinite;
    }
    
    .blinking-brain {
      animation: blink-slow 3s infinite;
    }
    
    .floating-handshake {
      animation: float-slow 4s ease-in-out infinite;
    }
    
    .pulse-notes {
      animation: pulse 2s infinite;
    }
    
    .rotating-comment {
      animation: rotate-reverse 4s linear infinite;
    }
    
    .bouncing-speaker {
      animation: bounce-slow 3s infinite;
    }
    
    .pulse-link {
      animation: pulse-color 2s infinite;
    }
    
    .spinning-man {
      animation: spin 3.5s linear infinite;
    }
    
    .blinking-folder {
      animation: blink 2.5s infinite;
    }
    
    .floating-mail {
      animation: float 3.5s ease-in-out infinite;
    }
    
    /* Copyright Icon */
    .copyright-icon {
      animation: spin-slow 10s linear infinite;
    }
    
    .spinning-robot {
      animation: spin 4s linear infinite;
    }
    
    /* Announcement Bar Icons */
    .announcement-icon {
      display: inline-block;
      margin: 0 5px;
    }
    
    .blinking-chip {
      animation: blink 1.5s infinite;
    }
    
    /* Animation Keyframes */
    @keyframes robot-dance {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-5px) rotate(10deg); }
      50% { transform: translateY(0) rotate(0deg); }
      75% { transform: translateY(-5px) rotate(-10deg); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes rotate-reverse {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    @keyframes blink-slow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes float-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    
    @keyframes pulse-fast {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    
    @keyframes pulse-color {
      0%, 100% { 
        color: inherit;
        transform: scale(1);
      }
      50% { 
        color: #00d4ff;
        transform: scale(1.1);
      }
    }
    
    /* Hover effects for navbar icons */
    .nav-link-robotic:hover .nav-icon {
      animation-play-state: paused;
    }
    
    .github-btn-robotic:hover .floating-gear {
      animation: spin 0.5s linear infinite;
    }
    
    .login-btn-robotic:hover .rotating-lock {
      animation: spin 0.3s linear infinite;
    }
    
    .register-btn-robotic:hover .bouncing-rocket {
      animation: bounce 0.5s infinite;
    }
    
    .profile-btn-robotic:hover .pulse-computer {
      animation: pulse 0.7s infinite;
    }
    
    /* Hover effects for footer links */
    .footer__link-item:hover .footer-icon {
      transform: scale(1.2);
      transition: transform 0.3s ease;
    }
    
    .footer__link-item:hover .pulse-chart {
      animation: pulse-fast 0.5s infinite;
    }
    
    .footer__link-item:hover .blinking-brain {
      animation: blink 0.8s infinite;
    }
    
    .footer__link-item:hover .spinning-tools {
      animation: spin 1s linear infinite;
    }
  `;

  document.head.appendChild(style);

  // Add hover effects to all animated icons
  const navLinks = document.querySelectorAll(
    ".navbar__item, .footer__link-item"
  );
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const icon = this.querySelector(".nav-icon, .footer-icon");
      if (icon) {
        icon.style.animationPlayState = "running";
      }
    });

    link.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".nav-icon, .footer-icon");
      if (icon) {
        icon.style.animationPlayState = "paused";
      }
    });
  });

  // Add random icon animations to announcement bar
  const announcementBar = document.querySelector(
    ".announcementBarContent__markdown"
  );
  if (announcementBar) {
    setInterval(() => {
      const icons = announcementBar.querySelectorAll(".announcement-icon");
      icons.forEach((icon) => {
        const randomDelay = Math.random() * 2;
        icon.style.animationDelay = `${randomDelay}s`;
      });
    }, 5000);
  }

  // Add animated icons to sidebar if exists
  const sidebar = document.querySelector(".theme-doc-sidebar-menu");
  if (sidebar) {
    const sidebarItems = sidebar.querySelectorAll("a");
    sidebarItems.forEach((item, index) => {
      const icons = ["📄", "🔗", "⚡", "💡", "🎯", "📌", "📍", "🔖"];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];

      const iconSpan = document.createElement("span");
      iconSpan.className = "sidebar-icon";
      iconSpan.textContent = randomIcon;
      iconSpan.style.cssText = `
        display: inline-block;
        margin-right: 8px;
        animation: float ${2 + index * 0.2}s ease-in-out infinite;
      `;

      item.insertBefore(iconSpan, item.firstChild);
    });
  }

  // Add animated icons to code blocks
  const codeBlocks = document.querySelectorAll(".prism-code");
  codeBlocks.forEach((block, index) => {
    const iconDiv = document.createElement("div");
    iconDiv.className = "code-icon";
    iconDiv.innerHTML = "💻";
    iconDiv.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 1.2rem;
      animation: spin ${5 + index}s linear infinite;
      opacity: 0.5;
      z-index: 1;
    `;

    if (block.querySelector(".copy-code-btn")) {
      block.insertBefore(iconDiv, block.querySelector(".copy-code-btn"));
    } else {
      block.appendChild(iconDiv);
    }
  });

  // Add animated loading icon to page load
  const loadingIcon = document.createElement("div");
  loadingIcon.className = "global-loading-icon";
  loadingIcon.innerHTML = "🤖";
  loadingIcon.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    animation: robot-dance 2s ease-in-out infinite;
    z-index: 9999;
    opacity: 0.5;
    pointer-events: none;
  `;

  document.body.appendChild(loadingIcon);

  // Remove loading icon after page loads
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingIcon.style.opacity = "0";
      setTimeout(() => loadingIcon.remove(), 500);
    }, 1000);
  });

  // Add animated scroll indicator
  const scrollIcon = document.createElement("div");
  scrollIcon.className = "scroll-indicator";
  scrollIcon.innerHTML = "⬇️";
  scrollIcon.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
    animation: bounce 2s infinite;
    z-index: 999;
    opacity: 0.7;
    cursor: pointer;
    display: none;
  `;

  document.body.appendChild(scrollIcon);

  // Show scroll indicator on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollIcon.style.display = "block";
    } else {
      scrollIcon.style.display = "none";
    }
  });

  // Scroll to top on click
  scrollIcon.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Add animated emoji rain on special interactions
  function createEmojiRain(emoji = "🤖", count = 20) {
    for (let i = 0; i < count; i++) {
      const emojiEl = document.createElement("div");
      emojiEl.textContent = emoji;
      emojiEl.style.cssText = `
        position: fixed;
        top: -50px;
        left: ${Math.random() * 100}%;
        font-size: ${1 + Math.random() * 2}rem;
        animation: emoji-fall ${3 + Math.random() * 3}s linear forwards;
        z-index: 9999;
        pointer-events: none;
        opacity: ${0.3 + Math.random() * 0.7};
      `;

      document.body.appendChild(emojiEl);

      // Remove after animation
      setTimeout(() => emojiEl.remove(), 6000);
    }

    // Add emoji-fall animation
    const emojiStyle = document.createElement("style");
    emojiStyle.textContent = `
      @keyframes emoji-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;

    if (!document.querySelector("#emoji-style")) {
      emojiStyle.id = "emoji-style";
      document.head.appendChild(emojiStyle);
    }
  }

  // Trigger emoji rain on logo click
  const logo = document.querySelector(".navbar__logo img, .navbar__title");
  if (logo) {
    logo.addEventListener("click", (e) => {
      if (e.shiftKey) {
        createEmojiRain("🤖", 30);
      }
    });
  }

  // Trigger emoji rain on achievement (first time reaching bottom)
  let reachedBottom = false;
  window.addEventListener("scroll", () => {
    if (
      !reachedBottom &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    ) {
      reachedBottom = true;
      createEmojiRain("🎉", 15);
    }
  });
});
