// Robotic functionality for Physical AI & Humanoid Robotics
document.addEventListener("DOMContentLoaded", function () {
  console.log(
    "%c🤖 PHYSICAL AI & HUMANOID ROBOTICS %cAll systems operational",
    "background: #00ffff; color: #000; padding: 5px 10px; border-radius: 3px; font-weight: bold;",
    "color: #00ff00; font-weight: bold;"
  );

  // Add online status indicator at bottom of main content
  const mainContent = document.querySelector("main") || document.body;
  const statusIndicator = document.createElement("div");
  statusIndicator.className = "content-status-indicator";
  statusIndicator.innerHTML = `
    <div class="content-status-dot"></div>
    <span class="content-status-text">All systems operational</span>
  `;
  mainContent.appendChild(statusIndicator);

  // Add Enhanced Navigation Links to existing navbar
  addEnhancedNavLinks();

  // Add text highlighter toolbar
  const highlighterToolbar = document.createElement("div");
  highlighterToolbar.className = "highlighter-toolbar";
  highlighterToolbar.innerHTML = `
    <button class="highlighter-btn yellow" title="Yellow Highlight">🟡</button>
    <button class="highlighter-btn blue" title="Blue Highlight">🔵</button>
    <button class="highlighter-btn green" title="Green Highlight">🟢</button>
    <button class="highlighter-btn red" title="Red Highlight">🔴</button>
    <button class="highlighter-btn clear" title="Clear Highlight">❌</button>
  `;
  document.body.appendChild(highlighterToolbar);

  // Text highlighting functionality
  let currentHighlightColor = "yellow";
  let isSelecting = false;

  // Highlight button click handlers
  highlighterToolbar.querySelectorAll(".highlighter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.classList.contains("yellow")) currentHighlightColor = "yellow";
      if (this.classList.contains("blue")) currentHighlightColor = "blue";
      if (this.classList.contains("green")) currentHighlightColor = "green";
      if (this.classList.contains("red")) currentHighlightColor = "red";
      if (this.classList.contains("clear")) clearHighlights();
    });
  });

  // Enable text selection for highlighting
  document.addEventListener("mouseup", function (e) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0 && !isSelecting) {
      isSelecting = true;

      // Create highlight span
      const range = selection.getRangeAt(0);
      const highlightSpan = document.createElement("span");
      highlightSpan.className = `highlight-${currentHighlightColor}`;
      highlightSpan.textContent = selectedText;

      // Replace selected text with highlighted span
      range.deleteContents();
      range.insertNode(highlightSpan);

      // Clear selection
      selection.removeAllRanges();

      // Add click to remove highlight
      highlightSpan.addEventListener("click", function (e) {
        if (e.ctrlKey) {
          const parent = this.parentNode;
          const text = document.createTextNode(this.textContent);
          parent.replaceChild(text, this);
          parent.normalize();
        }
      });

      isSelecting = false;
    }
  });

  function clearHighlights() {
    document.querySelectorAll('[class^="highlight-"]').forEach((el) => {
      const parent = el.parentNode;
      const text = document.createTextNode(el.textContent);
      parent.replaceChild(text, el);
      parent.normalize();
    });
  }

  // Add ripple effect to navbar links
  const navLinks = document.querySelectorAll(
    ".navbar__link, .nav-link-robotic, .robotic-nav-link"
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
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
    
    /* Highlighter Styles */
    .highlighter-toolbar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 20, 30, 0.9);
      border: 1px solid var(--robotic-border-color);
      border-radius: 8px;
      padding: 10px;
      display: flex;
      gap: 8px;
      z-index: 1000;
      backdrop-filter: blur(10px);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    }
    
    .highlighter-btn {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .highlighter-btn:hover {
      transform: scale(1.1);
    }
    
    .highlighter-btn.yellow:hover {
      background: rgba(255, 255, 0, 0.3);
      box-shadow: 0 0 10px yellow;
    }
    
    .highlighter-btn.blue:hover {
      background: rgba(0, 100, 255, 0.3);
      box-shadow: 0 0 10px blue;
    }
    
    .highlighter-btn.green:hover {
      background: rgba(0, 255, 0, 0.3);
      box-shadow: 0 0 10px green;
    }
    
    .highlighter-btn.red:hover {
      background: rgba(255, 0, 0, 0.3);
      box-shadow: 0 0 10px red;
    }
    
    .highlighter-btn.clear:hover {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 10px white;
    }
    
    .highlight-yellow {
      background-color: rgba(255, 255, 0, 0.3);
      padding: 2px 4px;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .highlight-blue {
      background-color: rgba(0, 100, 255, 0.3);
      padding: 2px 4px;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .highlight-green {
      background-color: rgba(0, 255, 0, 0.3);
      padding: 2px 4px;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .highlight-red {
      background-color: rgba(255, 0, 0, 0.3);
      padding: 2px 4px;
      border-radius: 3px;
      cursor: pointer;
    }
    
    /* Status Indicator */
    .content-status-indicator {
      position: fixed;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 40, 40, 0.9);
      border: 1px solid var(--robotic-border-color);
      padding: 8px 15px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    
    .content-status-dot {
      width: 8px;
      height: 8px;
      background: #00ff00;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    
    .content-status-text {
      color: #00ff00;
      font-weight: bold;
    }
    
    /* Quick Tools Button Styles */
    .quick-tools-btn {
      background: rgba(0, 255, 255, 0.2) !important;
      border: 1px solid var(--robotic-border-color) !important;
      color: var(--robotic-border-color) !important;
      font-weight: bold !important;
      margin-left: 10px !important;
      margin-top: 10px !important;
    }
    
    .quick-tools-btn:hover {
      background: rgba(0, 255, 255, 0.3) !important;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3) !important;
    }
    
    /* Enhanced Nav Links */
    .enhanced-nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 15px;
      border-radius: 6px;
      transition: all 0.3s ease;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid transparent;
    }
    
    .enhanced-nav-item:hover {
      background: rgba(0, 255, 255, 0.2);
      border-color: var(--robotic-border-color);
      transform: translateY(-2px);
    }
    
    .nav-item-icon {
      font-size: 1.1rem;
    }
  `;
  document.head.appendChild(style);

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl + H for highlighter
    if (e.ctrlKey && e.key === "h") {
      e.preventDefault();
      highlighterToolbar.style.display =
        highlighterToolbar.style.display === "none" ? "flex" : "none";
    }

    // Escape to close any open modals
    if (e.key === "Escape") {
      const sidebar = document.querySelector(".robotic-sidebar");
      if (sidebar) {
        sidebar.classList.remove("active");
      }
    }
  });

  // Create Right Sidebar Toggle System
  createRightSidebarToggleSystem();

  // Add animated circuit effect to main content
  const circuitEffect = document.createElement("div");
  circuitEffect.className = "circuit-effect";
  circuitEffect.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 49%, rgba(0, 255, 255, 0.02) 50%, transparent 51%),
                linear-gradient(transparent 49%, rgba(0, 255, 255, 0.02) 50%, transparent 51%);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: -1;
    opacity: 0.1;
    animation: circuit-scan 20s linear infinite;
  `;
  document.body.appendChild(circuitEffect);

  const circuitStyle = document.createElement("style");
  circuitStyle.textContent = `
    @keyframes circuit-scan {
      0% { opacity: 0.1; }
      50% { opacity: 0.3; }
      100% { opacity: 0.1; }
    }
  `;
  document.head.appendChild(circuitStyle);

  // ENHANCED MAIN CONTENT INTERACTIONS
  enhancedMainContentInteractions();
});

// Add Enhanced Navigation Links to existing navbar WITHOUT replacing it
function addEnhancedNavLinks() {
  // Find existing navbar
  const navbar = document.querySelector(".navbar__items--right");

  if (!navbar) return;

  // Create container for enhanced links
  const enhancedLinksContainer = document.createElement("div");
  enhancedLinksContainer.className = "enhanced-nav-links";
  enhancedLinksContainer.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  `;

  // Enhanced links data
  const enhancedLinks = [
    {
      icon: "🧮",
      text: "Calculator",
      action: "openCalculator",
      type: "button",
    },
    {
      icon: "📝",
      text: "Notes",
      action: "openNotes",
      type: "button",
    },
    {
      icon: "⭐",
      text: "Bookmarks",
      href: "/components/Bookmarks",
      type: "link",
    },
    {
      icon: "🔧",
      text: "Tools",
      action: "toggleSidebar",
      type: "button",
      className: "quick-tools-btn",
    },
  ];

  // Create and append enhanced links
  enhancedLinks.forEach((link) => {
    const navItem = document.createElement(
      link.type === "link" ? "a" : "button"
    );
    navItem.className = `navbar__item enhanced-nav-item ${
      link.className || ""
    }`;

    if (link.type === "link") {
      navItem.href = link.href;
    } else {
      navItem.setAttribute("data-action", link.action);
    }

    navItem.innerHTML = `
      <span class="nav-item-icon">${link.icon}</span>
      <span class="navbar__link">${link.text}</span>
    `;

    // Add click handlers for buttons
    if (link.type === "button") {
      navItem.addEventListener("click", (e) => {
        e.preventDefault();
        handleNavAction(link.action);
      });
    }

    enhancedLinksContainer.appendChild(navItem);
  });

  // Insert enhanced links before existing items
  navbar.insertBefore(enhancedLinksContainer, navbar.firstChild);
}

function handleNavAction(action) {
  const actions = {
    openCalculator: () => createCalculator(),
    openNotes: () => createNotes(),
    toggleSidebar: () => {
      const sidebar = document.querySelector(".robotic-sidebar");
      if (sidebar) {
        sidebar.classList.toggle("active");
      }
    },
  };

  if (actions[action]) actions[action]();
}

// Enhanced main content interactions
function enhancedMainContentInteractions() {
  // Create neural network overlay
  const neuralOverlay = document.createElement("div");
  neuralOverlay.className = "neural-network-overlay";
  const mainElement = document.querySelector("main");
  if (mainElement) {
    mainElement.appendChild(neuralOverlay);
  }

  // Update neural network on mouse move
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    neuralOverlay.style.setProperty("--x", `${x}%`);
    neuralOverlay.style.setProperty("--y", `${y}%`);
  });

  // Add interactive progress bars to all code blocks
  document.querySelectorAll(".prism-code").forEach((codeBlock, index) => {
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    progressContainer.innerHTML = `
      <div class="progress-label">
        <span>Processing Code ${index + 1}</span>
        <span class="progress-value">${
          Math.floor(Math.random() * 40) + 60
        }%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${
          Math.floor(Math.random() * 40) + 60
        }%"></div>
      </div>
    `;
    codeBlock.parentNode.insertBefore(progressContainer, codeBlock);
  });

  // Add data panels to important content
  const importantHeadings = document.querySelectorAll("h2");
  importantHeadings.forEach((heading, index) => {
    if (index % 2 === 0) {
      const panel = document.createElement("div");
      panel.className = "data-panel";
      panel.innerHTML = `
        <div class="data-panel-header">
          <i class="fas fa-microchip"></i> Data Analysis Panel
        </div>
        <div class="data-panel-content">
          This section contains advanced robotics concepts. Neural network analysis indicates ${
            Math.floor(Math.random() * 30) + 70
          }% relevance to current learning objectives.
        </div>
      `;

      // Insert after heading
      heading.parentNode.insertBefore(panel, heading.nextSibling);
    }
  });

  // Add hover effects to all paragraphs
  document
    .querySelectorAll(".docItemContainer p")
    .forEach((paragraph, index) => {
      paragraph.style.animationDelay = `${index * 0.1}s`;

      paragraph.addEventListener("mouseenter", () => {
        paragraph.style.transform = "translateX(10px)";
        paragraph.style.boxShadow = "0 8px 20px rgba(0, 255, 255, 0.15)";
      });

      paragraph.addEventListener("mouseleave", () => {
        paragraph.style.transform = "translateX(0)";
        paragraph.style.boxShadow = "0 5px 15px rgba(0, 255, 255, 0.1)";
      });
    });

  // Add click-to-copy functionality to code blocks
  document.querySelectorAll(".prism-code").forEach((codeBlock) => {
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-code-btn";
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = "Copy code";
    copyBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 255, 255, 0.2);
      border: 1px solid rgba(0, 255, 255, 0.4);
      color: var(--robotic-border-color);
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.8rem;
      transition: all 0.3s ease;
      z-index: 10;
    `;

    copyBtn.addEventListener("mouseenter", () => {
      copyBtn.style.background = "rgba(0, 255, 255, 0.3)";
      copyBtn.style.transform = "scale(1.1)";
    });

    copyBtn.addEventListener("mouseleave", () => {
      copyBtn.style.background = "rgba(0, 255, 255, 0.2)";
      copyBtn.style.transform = "scale(1)";
    });

    copyBtn.addEventListener("click", async () => {
      const code = codeBlock.textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = "rgba(0, 255, 0, 0.3)";
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
          copyBtn.style.background = "rgba(0, 255, 255, 0.2)";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    });

    codeBlock.style.position = "relative";
    codeBlock.appendChild(copyBtn);
  });

  // Add scroll progress indicator
  const scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, 
      var(--robotic-border-color),
      var(--robotic-accent-color),
      var(--robotic-border-color));
    z-index: 1000;
    transition: width 0.1s ease;
    box-shadow: 0 0 10px var(--robotic-border-color);
  `;
  document.body.appendChild(scrollProgress);

  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = `${scrolled}%`;
  });

  // Create floating particles
  createFloatingParticles();
}

// Right Sidebar Toggle System
function createRightSidebarToggleSystem() {
  // Create Floating Toggle Button for Right Side
  const floatingToggleBtn = document.createElement("button");
  floatingToggleBtn.className = "floating-sidebar-toggle";
  floatingToggleBtn.innerHTML = `
    <span class="toggle-icon">⚙️</span>
    <span class="toggle-text">Quick Tools</span>
  `;
  floatingToggleBtn.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 1000;
    background: rgba(0, 255, 255, 0.9);
    border: 2px solid var(--robotic-border-color);
    color: #000;
    padding: 12px 18px;
    border-radius: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: bold;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    backdrop-filter: blur(5px);
  `;

  // Create Sidebar on Right Side
  const sidebar = document.createElement("div");
  sidebar.className = "robotic-sidebar right-sidebar";
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h3>⚡ Quick Tools</h3>
      <button class="sidebar-close">&times;</button>
    </div>
    <div class="sidebar-content">
      <div class="sidebar-section">
        <h4>Navigation</h4>
        <div class="content-nav">
          <a href="/" class="nav-item" data-nav="home">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href="/docs" class="nav-item" data-nav="docs">
            <i class="fas fa-book"></i>
            <span>Documentation</span>
          </a>
          <a href="/components" class="nav-item" data-nav="components">
            <i class="fas fa-cube"></i>
            <span>Components</span>
          </a>
          <a href="/components/bookmarks" class="nav-item active" data-nav="bookmarks">
            <i class="fas fa-bookmark"></i>
            <span>Bookmarks</span>
            <span class="nav-status">⭐</span>
          </a>
        </div>
      </div>
      
      <div class="sidebar-section">
        <h4>Quick Tools</h4>
        <div class="tool-buttons">
          <button class="tool-btn" data-tool="calculator">
            <i class="fas fa-calculator"></i>
            <span>Calculator</span>
          </button>
          <button class="tool-btn" data-tool="converter">
            <i class="fas fa-exchange-alt"></i>
            <span>Unit Converter</span>
          </button>
          <button class="tool-btn" data-tool="notes">
            <i class="fas fa-sticky-note"></i>
            <span>Quick Notes</span>
          </button>
          <button class="tool-btn" data-tool="highlighter">
            <i class="fas fa-highlighter"></i>
            <span>Text Highlighter</span>
          </button>
        </div>
      </div>
      
      <div class="sidebar-section">
        <h4>System Controls</h4>
        <div class="system-controls">
          <div class="control-item">
            <label>Dark Mode</label>
            <label class="switch">
              <input type="checkbox" id="dark-mode-toggle" checked>
              <span class="slider"></span>
            </label>
          </div>
          <div class="control-item">
            <label>Animations</label>
            <label class="switch">
              <input type="checkbox" id="animations-toggle" checked>
              <span class="slider"></span>
            </label>
          </div>
          <div class="control-item">
            <label>Particles</label>
            <label class="switch">
              <input type="checkbox" id="particles-toggle" checked>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="sidebar-section">
        <h4>Quick Actions</h4>
        <div class="action-buttons">
          <button class="action-btn" data-action="print">
            <i class="fas fa-print"></i>
            <span>Print Page</span>
          </button>
          <button class="action-btn" data-action="screenshot">
            <i class="fas fa-camera"></i>
            <span>Take Screenshot</span>
          </button>
          <button class="action-btn" data-action="bookmark">
            <i class="fas fa-bookmark"></i>
            <span>Bookmark This</span>
          </button>
          <button class="action-btn" data-action="share">
            <i class="fas fa-share-alt"></i>
            <span>Share</span>
          </button>
        </div>
      </div>
      
      <div class="sidebar-section">
        <h4>Shortcuts</h4>
        <div class="shortcuts-list">
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>H</kbd>
            <span>Toggle Highlighter</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>B</kbd>
            <span>Toggle Sidebar</span>
          </div>
          <div class="shortcut-item">
            <kbd>Esc</kbd>
            <span>Close All</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <button class="toggle-hide-btn" id="hide-sidebar">
        <i class="fas fa-chevron-right"></i>
        <span>Hide Sidebar</span>
      </button>
      <div class="connection-status">
        <div class="status-dot connected"></div>
        <span>Online</span>
      </div>
    </div>
  `;

  // Add styles for sidebar
  const sidebarStyle = document.createElement("style");
  sidebarStyle.textContent = `
    .robotic-sidebar {
      position: fixed;
      top: 0;
      right: -350px;
      width: 320px;
      height: 100vh;
      background: rgba(0, 20, 30, 0.98);
      backdrop-filter: blur(20px);
      border-left: 2px solid var(--robotic-border-color);
      z-index: 999;
      transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 50px rgba(0, 255, 255, 0.3);
    }
    
    .robotic-sidebar.active {
      right: 0;
    }
    
    .sidebar-header {
      padding: 15px 20px;
      border-bottom: 1px solid rgba(0, 255, 255, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0, 40, 50, 0.9);
      flex-shrink: 0;
      min-height: 60px;
    }

    .sidebar-header h3 {
      margin: 0;
      color: var(--robotic-border-color);
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
      flex: 1;
    }
    
    .sidebar-close {
      background: none;
      border: none;
      color: var(--robotic-border-color);
      font-size: 1.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .sidebar-close:hover {
      background: rgba(255, 0, 0, 0.2);
      transform: rotate(90deg);
    }
    
    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    
    .sidebar-section {
      margin-bottom: 25px;
    }
    
    .sidebar-section h4 {
      color: var(--robotic-accent-color);
      margin-bottom: 15px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-left: 3px solid var(--robotic-border-color);
      padding-left: 10px;
    }
    
    .content-nav {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(0, 255, 255, 0.1);
    }
    
    .content-nav a {
      text-decoration: none;
      color: inherit;
    }
    
    .nav-item {
      padding: 14px 15px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      color: #fff;
    }
    
    .nav-item:hover {
      background: rgba(0, 255, 255, 0.15);
      padding-left: 20px;
    }
    
    .nav-item.active {
      background: rgba(0, 255, 255, 0.2);
      border-left: 4px solid var(--robotic-border-color);
    }
    
    .nav-status {
      margin-left: auto;
      font-size: 0.9rem;
      color: #ffd700;
    }
    
    .action-buttons, .tool-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .action-btn, .tool-btn {
      background: rgba(0, 255, 255, 0.15);
      border: 1px solid rgba(0, 255, 255, 0.3);
      color: white;
      padding: 12px 8px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .action-btn:hover, .tool-btn:hover {
      background: rgba(0, 255, 255, 0.25);
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 255, 255, 0.2);
      border-color: var(--robotic-border-color);
    }
    
    .action-btn i, .tool-btn i {
      font-size: 1.3rem;
    }
    
    .system-controls {
      background: rgba(0, 0, 0, 0.3);
      padding: 18px;
      border-radius: 10px;
      border: 1px solid rgba(0, 255, 255, 0.1);
    }
    
    .control-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      color: #ccc;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
    }
    
    .switch {
      position: relative;
      display: inline-block;
      width: 54px;
      height: 28px;
    }
    
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.1);
      transition: .4s;
      border-radius: 34px;
    }
    
    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    
    input:checked + .slider {
      background-color: var(--robotic-border-color);
    }
    
    input:checked + .slider:before {
      transform: translateX(26px);
    }
    
    .sidebar-footer {
      padding: 18px;
      border-top: 1px solid rgba(0, 255, 255, 0.3);
      background: rgba(0, 30, 40, 0.8);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .connection-status {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #00ff00;
      font-size: 0.9rem;
    }
    
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ff0000;
    }
    
    .status-dot.connected {
      background: #00ff00;
      animation: pulse 1.5s infinite;
      box-shadow: 0 0 10px #00ff00;
    }
    
    .toggle-hide-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    
    .toggle-hide-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(-5px);
    }
    
    .floating-sidebar-toggle {
      position: fixed;
      top: 120px;
      right: 20px;
      z-index: 1000;
      background: rgba(0, 255, 255, 0.9);
      border: 2px solid var(--robotic-border-color);
      color: #000;
      padding: 12px 18px;
      border-radius: 50px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Rajdhani', sans-serif;
      font-weight: bold;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
      backdrop-filter: blur(5px);
    }

    .floating-sidebar-toggle:hover {
      transform: translateX(-5px);
      background: rgba(0, 255, 255, 1);
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.7);
    }

    .floating-sidebar-toggle.moved {
      right: calc(20px + 320px) !important; /* 320px is the sidebar width */
      transform: translateX(-10px);
    }
    
    .toggle-icon {
      font-size: 1.3rem;
    }
    
    .shortcuts-list {
      background: rgba(0, 0, 0, 0.3);
      padding: 15px;
      border-radius: 8px;
    }
    
    .shortcut-item {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
    }
    
    .shortcut-item kbd {
      background: rgba(0, 255, 255, 0.2);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      border: 1px solid rgba(0, 255, 255, 0.4);
      min-width: 40px;
      text-align: center;
    }
    
    @keyframes pulse {
      0%, 100% { 
        opacity: 1; 
        transform: scale(1);
      }
      50% { 
        opacity: 0.7; 
        transform: scale(1.1);
      }
    }
    
    /* Progress Bars and Data Panels */
    .progress-container {
      background: rgba(0, 20, 30, 0.9);
      border: 1px solid var(--robotic-border-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 15px;
    }
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      color: #ccc;
    }
    
    .progress-value {
      color: #00ffff;
      font-weight: bold;
      animation: pulse 2s infinite;
    }
    
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ffff, #0080ff, #00ffff);
      background-size: 200% 100%;
      border-radius: 4px;
      animation: progress-animation 2s ease-in-out infinite, gradient-shift 3s ease infinite;
    }
    
    .data-panel {
      background: rgba(0, 30, 40, 0.9);
      border: 1px solid var(--robotic-border-color);
      border-radius: 10px;
      padding: 18px;
      margin: 20px 0;
      box-shadow: 0 0 25px rgba(0, 255, 255, 0.2);
    }
    
    .data-panel-header {
      color: var(--robotic-border-color);
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.1rem;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    }
    
    .data-panel-content {
      color: #ccc;
      font-size: 0.95rem;
      line-height: 1.6;
    }
    
    @keyframes progress-animation {
      0%, 100% { width: 60%; }
      50% { width: 90%; }
    }
    
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    /* Responsive Design */
    @media (max-width: 996px) {
      .robotic-sidebar {
        width: 280px;
      }
      
      .floating-sidebar-toggle {
        padding: 10px 15px;
        font-size: 0.8rem;
      }
      
      .toggle-text {
        display: none;
      }
      
      .floating-sidebar-toggle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        justify-content: center;
      }
    }
  `;

  // Append elements
  document.head.appendChild(sidebarStyle);
  document.body.appendChild(floatingToggleBtn);
  document.body.appendChild(sidebar);

  // Sidebar functionality
  const sidebarClose = document.querySelector(".sidebar-close");
  const actionButtons = document.querySelectorAll(".action-btn");
  const toolButtons = document.querySelectorAll(".tool-btn");
  const navItems = document.querySelectorAll(".nav-item");
  const hideSidebarBtn = document.getElementById("hide-sidebar");

  // Toggle sidebar from floating button
  floatingToggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    floatingToggleBtn.classList.toggle("moved");
  });

  // Close sidebar
  sidebarClose.addEventListener("click", () => {
    sidebar.classList.remove("active");
    floatingToggleBtn.classList.remove("moved");
  });

  // Hide sidebar button
  hideSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    floatingToggleBtn.classList.remove("moved");
  });

  // Action button functionality
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.dataset.action;
      handleSidebarAction(action);
    });
  });

  // Tool button functionality
  toolButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tool = this.dataset.tool;
      openTool(tool);
    });
  });

  // Toggle switches
  document
    .getElementById("dark-mode-toggle")
    ?.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", this.checked);
    });

  document
    .getElementById("animations-toggle")
    ?.addEventListener("change", function () {
      document.body.classList.toggle("animations-enabled", this.checked);
    });

  document
    .getElementById("particles-toggle")
    ?.addEventListener("change", function () {
      const particles = document.querySelector(".particles-container");
      if (particles) {
        particles.style.display = this.checked ? "block" : "none";
      }
    });

  // Keyboard shortcut for sidebar (Ctrl + B)
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      sidebar.classList.toggle("active");
      floatingToggleBtn.style.right = sidebar.classList.contains("active")
        ? "340px"
        : "20px";
    }
  });
}

function handleSidebarAction(action) {
  const actions = {
    print: () => window.print(),
    screenshot: () => takeScreenshot(),
    bookmark: () => {
      // Try to trigger the React Bookmarks component if it exists
      // First, check if we can access the React component
      const bookmarkContainer = document.querySelector('.bookmarksContainer');
      if (bookmarkContainer) {
        // Check if there's an "add current page" button to click it
        const addBookmarkBtn = bookmarkContainer.querySelector('.addCurrentBtn');
        if (addBookmarkBtn) {
          // Click the add bookmark button
          addBookmarkBtn.click();

          // Also make sure the panel is visible
          const bookmarkToggle = bookmarkContainer.querySelector('.bookmarkToggle');
          if (bookmarkToggle && !bookmarkContainer.querySelector('.bookmarksPanel[style*="display: block"], .bookmarksPanel:not([style*="display: none"])')) {
            // Click toggle to ensure it's visible
            bookmarkToggle.click();
          }
        } else {
          // Fallback to toggle if add button doesn't exist
          const bookmarkToggle = bookmarkContainer.querySelector('.bookmarkToggle');
          if (bookmarkToggle) {
            bookmarkToggle.click();
          }
        }
      } else {
        // Fallback: use browser-specific bookmarking
        if (window.sidebar && window.sidebar.addPanel) {
          window.sidebar.addPanel(document.title, window.location.href, "");
        } else if (window.external && "AddFavorite" in window.external) {
          window.external.AddFavorite(window.location.href, document.title);
        } else {
          alert("Press Ctrl+D to bookmark this page.");
        }
      }
    },
    share: () => {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href,
          text: "Check out this awesome content about Physical AI & Humanoid Robotics!",
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    },
  };

  if (actions[action]) actions[action]();
}

function openTool(tool) {
  const tools = {
    calculator: () => createCalculator(),
    converter: () => createConverter(),
    notes: () => createNotes(),
    highlighter: () => {
      const highlighterToolbar = document.querySelector(".highlighter-toolbar");
      if (highlighterToolbar) {
        highlighterToolbar.style.display =
          highlighterToolbar.style.display === "none" ? "flex" : "none";
      }
    },
  };

  if (tools[tool]) tools[tool]();
}

function createFloatingParticles() {
  const particlesContainer = document.createElement("div");
  particlesContainer.className = "particles-container";
  particlesContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  `;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: rgba(0, 255, 255, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 20 + 10}s linear infinite;
    `;
    particlesContainer.appendChild(particle);
  }

  const particleStyle = document.createElement("style");
  particleStyle.textContent = `
    @keyframes float {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(particleStyle);
  document.body.appendChild(particlesContainer);
}

// Tool implementations
function createCalculator() {
  // Simple calculator modal
  const calculator = document.createElement("div");
  calculator.className = "robotic-calculator";
  calculator.innerHTML = `
    <div class="calc-header">
      <h3>🧮 Calculator</h3>
      <button class="calc-close">&times;</button>
    </div>
    <div class="calc-display">
      <input type="text" readonly value="0" id="calc-display">
    </div>
    <div class="calc-buttons">
      <button class="calc-btn" data-value="C">C</button>
      <button class="calc-btn" data-value="CE">CE</button>
      <button class="calc-btn" data-value="%">%</button>
      <button class="calc-btn" data-value="/">/</button>
      <button class="calc-btn" data-value="7">7</button>
      <button class="calc-btn" data-value="8">8</button>
      <button class="calc-btn" data-value="9">9</button>
      <button class="calc-btn" data-value="*">×</button>
      <button class="calc-btn" data-value="4">4</button>
      <button class="calc-btn" data-value="5">5</button>
      <button class="calc-btn" data-value="6">6</button>
      <button class="calc-btn" data-value="-">-</button>
      <button class="calc-btn" data-value="1">1</button>
      <button class="calc-btn" data-value="2">2</button>
      <button class="calc-btn" data-value="3">3</button>
      <button class="calc-btn" data-value="+">+</button>
      <button class="calc-btn" data-value="0">0</button>
      <button class="calc-btn" data-value=".">.</button>
      <button class="calc-btn" data-value="=">=</button>
    </div>
  `;

  // Add calculator styles
  const calcStyle = document.createElement("style");
  calcStyle.textContent = `
    .robotic-calculator {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 20, 30, 0.95);
      border: 2px solid var(--robotic-border-color);
      border-radius: 15px;
      padding: 20px;
      z-index: 1001;
      box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      width: 320px;
    }
    
    .calc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .calc-header h3 {
      margin: 0;
      color: var(--robotic-border-color);
      font-family: 'Rajdhani', sans-serif;
    }
    
    .calc-close {
      background: none;
      border: none;
      color: var(--robotic-border-color);
      font-size: 1.5rem;
      cursor: pointer;
    }
    
    .calc-display input {
      width: 100%;
      padding: 15px;
      font-size: 1.5rem;
      text-align: right;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid var(--robotic-border-color);
      border-radius: 8px;
      color: white;
      margin-bottom: 15px;
    }
    
    .calc-buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    
    .calc-btn {
      padding: 15px;
      font-size: 1.2rem;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .calc-btn:hover {
      background: rgba(0, 255, 255, 0.2);
      transform: scale(1.05);
    }
    
    .calc-btn[data-value="="] {
      grid-column: span 2;
      background: var(--robotic-border-color);
      color: black;
    }
  `;
  document.head.appendChild(calcStyle);

  // Add calculator functionality
  calculator.querySelector(".calc-close").addEventListener("click", () => {
    calculator.remove();
  });

  document.body.appendChild(calculator);

  // Calculator logic
  let currentInput = "0";
  let previousInput = "";
  let operation = null;

  const display = calculator.querySelector("#calc-display");

  calculator.querySelectorAll(".calc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value;

      if (value === "C") {
        currentInput = "0";
        previousInput = "";
        operation = null;
      } else if (value === "CE") {
        currentInput =
          currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
      } else if (value === "=") {
        if (operation && previousInput) {
          currentInput = calculate(
            parseFloat(previousInput),
            parseFloat(currentInput),
            operation
          );
          operation = null;
          previousInput = "";
        }
      } else if (["+", "-", "*", "/", "%"].includes(value)) {
        if (previousInput === "") {
          previousInput = currentInput;
          currentInput = "0";
        }
        operation = value;
      } else {
        if (currentInput === "0" || operation) {
          currentInput = value;
        } else {
          currentInput += value;
        }
      }

      display.value = currentInput;
    });
  });

  function calculate(a, b, op) {
    switch (op) {
      case "+":
        return (a + b).toString();
      case "-":
        return (a - b).toString();
      case "*":
        return (a * b).toString();
      case "/":
        return b !== 0 ? (a / b).toString() : "Error";
      case "%":
        return (a % b).toString();
      default:
        return b.toString();
    }
  }
}

function createNotes() {
  const notes = document.createElement("div");
  notes.className = "robotic-notes";
  notes.innerHTML = `
    <div class="notes-header">
      <h3>📝 Quick Notes & Bookmarks</h3>
      <button class="notes-close">&times;</button>
    </div>
    <div class="notes-tabs">
      <button class="tab-btn active" data-tab="notes">📝 Notes</button>
      <button class="tab-btn" data-tab="bookmarks">⭐ Bookmarks</button>
    </div>
    <div class="notes-content">
      <div id="notes-tab" class="tab-content active">
        <textarea placeholder="Type your notes here..." id="notes-textarea"></textarea>
      </div>
      <div id="bookmarks-tab" class="tab-content">
        <div class="bookmarks-actions">
          <button class="add-bookmark-btn" id="add-current-bookmark">🔖 Bookmark Current Page</button>
        </div>
        <div class="bookmarks-list" id="bookmarks-list">
          <!-- Bookmarks will be loaded here -->
        </div>
      </div>
    </div>
    <div class="notes-footer">
      <button class="notes-save">💾 Save Notes</button>
      <button class="notes-clear">🗑️ Clear Notes</button>
    </div>
  `;

  // Add notes styles
  const notesStyle = document.createElement("style");
  notesStyle.textContent = `
    .robotic-notes {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 20, 30, 0.95);
      border: 2px solid var(--robotic-border-color);
      border-radius: 15px;
      padding: 20px;
      z-index: 1001;
      box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      width: 450px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }

    .notes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .notes-header h3 {
      margin: 0;
      color: var(--robotic-border-color);
      font-family: 'Rajdhani', sans-serif;
    }

    .notes-close {
      background: none;
      border: none;
      color: var(--robotic-border-color);
      font-size: 1.5rem;
      cursor: pointer;
    }

    .notes-tabs {
      display: flex;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    }

    .tab-btn {
      flex: 1;
      padding: 10px;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
      margin-right: 5px;
    }

    .tab-btn:hover {
      background: rgba(0, 255, 255, 0.2);
    }

    .tab-btn.active {
      background: rgba(0, 255, 255, 0.3);
      border-color: var(--robotic-border-color);
    }

    .tab-content {
      display: none;
      flex: 1;
      overflow-y: auto;
      padding: 10px 0;
    }

    .tab-content.active {
      display: block;
    }

    .notes-content textarea {
      width: 100%;
      height: 150px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid var(--robotic-border-color);
      border-radius: 8px;
      color: white;
      font-family: 'Inter', sans-serif;
      resize: none;
    }

    .bookmarks-actions {
      margin-bottom: 15px;
    }

    .add-bookmark-btn {
      width: 100%;
      padding: 12px;
      background: rgba(0, 255, 0, 0.2);
      border: 1px solid rgba(0, 255, 0, 0.3);
      color: var(--robotic-accent-color);
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
      font-family: 'Inter', sans-serif;
    }

    .add-bookmark-btn:hover {
      background: rgba(0, 255, 0, 0.3);
      transform: translateY(-2px);
    }

    .bookmarks-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .bookmark-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bookmark-title {
      flex: 1;
      color: white;
      font-size: 0.9rem;
      word-break: break-word;
      margin-right: 10px;
    }

    .bookmark-actions {
      display: flex;
      gap: 5px;
    }

    .bookmark-link-btn, .bookmark-remove-btn {
      padding: 5px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .bookmark-link-btn {
      background: rgba(0, 100, 255, 0.3);
      color: white;
    }

    .bookmark-remove-btn {
      background: rgba(255, 0, 0, 0.3);
      color: white;
    }

    .notes-footer {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .notes-footer button {
      flex: 1;
      padding: 10px;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .notes-footer button:hover {
      background: rgba(0, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(notesStyle);

  // Tab switching functionality
  const tabBtns = notes.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and content
      notes.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      notes.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      // Add active class to clicked button
      btn.classList.add('active');

      // Show corresponding content
      const tabId = btn.getAttribute('data-tab');
      notes.querySelector(`#${tabId}-tab`).classList.add('active');
    });
  });

  // Add notes functionality
  notes.querySelector(".notes-close").addEventListener("click", () => {
    notes.remove();
  });

  notes.querySelector(".notes-save").addEventListener("click", () => {
    const text = notes.querySelector("#notes-textarea").value;
    localStorage.setItem("robotic-notes", text);
    alert("Notes saved!");
  });

  notes.querySelector(".notes-clear").addEventListener("click", () => {
    if (confirm("Clear all notes?")) {
      notes.querySelector("#notes-textarea").value = "";
      localStorage.removeItem("robotic-notes");
    }
  });

  // Bookmark functionality
  function loadBookmarks() {
    const bookmarksList = notes.querySelector('#bookmarks-list');
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    bookmarksList.innerHTML = '';

    if (bookmarks.length === 0) {
      bookmarksList.innerHTML = '<div class="empty-bookmarks">No bookmarks yet. Add some pages!</div>';
      return;
    }

    bookmarks.forEach(bookmark => {
      const bookmarkItem = document.createElement('div');
      bookmarkItem.className = 'bookmark-item';
      bookmarkItem.innerHTML = `
        <div class="bookmark-title" title="${bookmark.title}">${bookmark.title}</div>
        <div class="bookmark-actions">
          <button class="bookmark-link-btn" title="Visit page">🔗</button>
          <button class="bookmark-remove-btn" title="Remove">🗑️</button>
        </div>
      `;

      bookmarkItem.querySelector('.bookmark-link-btn').addEventListener('click', () => {
        window.open(bookmark.url, '_blank');
      });

      bookmarkItem.querySelector('.bookmark-remove-btn').addEventListener('click', () => {
        const updatedBookmarks = bookmarks.filter(b => b.id !== bookmark.id);
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        loadBookmarks(); // Refresh the list
      });

      bookmarksList.appendChild(bookmarkItem);
    });
  }

  function addCurrentBookmark() {
    const currentUrl = window.location.pathname;
    const title = document.title || 'Untitled Page';
    const moduleMatch = currentUrl.match(/\/docs\/([^\/]+)/);
    const module = moduleMatch ? moduleMatch[1].replace(/-/g, ' ') : 'General';

    const newBookmark = {
      id: `bookmark-${Date.now()}`,
      title: title.replace(' | Physical AI & Humanoid Robotics', ''),
      url: window.location.href, // Use full URL instead of just pathname
      module: module.charAt(0).toUpperCase() + module.slice(1),
      timestamp: new Date().toISOString()
    };

    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    // Check if bookmark already exists
    const exists = bookmarks.some(b => b.url === newBookmark.url);
    if (!exists) {
      bookmarks.unshift(newBookmark); // Add to beginning of array
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      loadBookmarks(); // Refresh the list
      alert('Page bookmarked successfully!');
    } else {
      alert('This page is already bookmarked!');
    }
  }

  notes.querySelector('#add-current-bookmark').addEventListener('click', addCurrentBookmark);

  // Load saved notes
  const savedNotes = localStorage.getItem("robotic-notes");
  if (savedNotes) {
    notes.querySelector("#notes-textarea").value = savedNotes;
  }

  // Load bookmarks
  loadBookmarks();

  document.body.appendChild(notes);
}

function createConverter() {
  alert("Unit Converter coming soon!");
}

function takeScreenshot() {
  alert(
    "Screenshot feature coming soon! Use browser screenshot tools for now."
  );
}
