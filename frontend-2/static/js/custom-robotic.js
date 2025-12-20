// Custom robotic functionality
document.addEventListener("DOMContentLoaded", function () {
  // Add online status indicator at bottom of main content
  const mainContent = document.querySelector("main") || document.body;
  const statusIndicator = document.createElement("div");
  statusIndicator.className = "content-status-indicator";
  statusIndicator.innerHTML = `
    <div class="content-status-dot"></div>
    <span class="content-status-text">All systems operational</span>
  `;
  mainContent.appendChild(statusIndicator);

  // Add hexagonal chatbot
  const chatbotContainer = document.createElement("div");
  chatbotContainer.className = "chatbot-container";
  chatbotContainer.innerHTML = `
    <div class="hexagon-chatbot">
      <i class="fas fa-robot chatbot-icon"></i>
      <div class="chatbot-status">ONLINE</div>
      <div class="pulse-ring"></div>
    </div>
  `;
  document.body.appendChild(chatbotContainer);

  // Chatbot toggle functionality
  const chatbot = document.querySelector(".hexagon-chatbot");
  chatbot.addEventListener("click", function () {
    // Create chatbot interface if it doesn't exist
    let chatInterface = document.querySelector(".chatbot-interface");

    if (!chatInterface) {
      chatInterface = document.createElement("div");
      chatInterface.className = "chatbot-interface";
      chatInterface.innerHTML = `
        <div class="chatbot-header">
          <div class="chatbot-title">
            <i class="fas fa-robot"></i>
            <span>ROBOTIC ASSISTANT</span>
          </div>
          <div class="online-status">
            <div class="status-dot"></div>
            <span>ONLINE</span>
          </div>
        </div>
        <div class="chatbot-messages">
          <div class="message bot-message">
            <div class="message-text system-status">
              🤖 System: All circuits operational
            </div>
          </div>
          <div class="message bot-message">
            <div class="message-text">
              Hello! I'm your robotic assistant. How can I help you today?
            </div>
          </div>
        </div>
        <div class="chatbot-input">
          <input type="text" placeholder="Type your message..." class="chatbot-input-field">
          <button class="chatbot-send-btn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      `;
      document.body.appendChild(chatInterface);
    } else {
      chatInterface.style.display =
        chatInterface.style.display === "none" ? "block" : "none";
    }
  });

  // Add click animation to navbar links
  const navLinks = document.querySelectorAll(
    ".navbar__link, .nav-link-robotic"
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add CSS for ripple animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Language switcher functionality
  const languageToggle = document.querySelector(".language-toggle-robotic");
  if (languageToggle) {
    languageToggle.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    languageToggle.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }

  // GitHub link enhancement
  const githubLink = document.querySelector(".github-link-robotic");
  if (githubLink) {
    githubLink.addEventListener("mouseenter", function () {
      const badge = this.querySelector(".github-badge");
      if (badge) {
        badge.style.transform = "scale(1.2) rotate(5deg)";
      }
    });

    githubLink.addEventListener("mouseleave", function () {
      const badge = this.querySelector(".github-badge");
      if (badge) {
        badge.style.transform = "scale(1) rotate(0deg)";
      }
    });
  }

  // Login/Signup buttons functionality
  const loginBtn = document.querySelector(".login-btn-robotic");
  const signupBtn = document.querySelector(".signup-btn-robotic");

  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      alert("🤖 Robotic Login System: Authentication protocols initialized.");
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", function () {
      alert("⚡ Robotic Signup System: New user registration initialized.");
    });
  }

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl + / for chatbot
    if (e.ctrlKey && e.key === "/") {
      e.preventDefault();
      const chatbot = document.querySelector(".hexagon-chatbot");
      if (chatbot) chatbot.click();
    }

    // Escape to close chatbot
    if (e.key === "Escape") {
      const chatInterface = document.querySelector(".chatbot-interface");
      if (chatInterface) {
        chatInterface.style.display = "none";
      }
    }
  });

  // Console greeting
  console.log(
    "%c🤖 ROBOTIC NEXUS %cAll systems operational",
    "background: #00ffff; color: #000; padding: 5px 10px; border-radius: 3px; font-weight: bold;",
    "color: #00ff00; font-weight: bold;"
  );
  console.log(
    "%c⚡ Welcome to the future of robotics",
    "color: #00b3ff; font-size: 14px;"
  );
});
