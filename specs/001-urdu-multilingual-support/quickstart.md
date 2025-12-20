# Quickstart: Urdu Multilingual Support

## Prerequisites

- Node.js 18+ installed
- Docusaurus project set up
- Access to existing English content
- Urdu language knowledge for translation

## Setup Steps

### 1. Configure Docusaurus for i18n

Update `docusaurus.config.js` to add Urdu locale:

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl', // Right-to-left support for Urdu
      },
    },
  },
  // ... rest of config
};
```

### 2. Create Urdu Content Directory

Create the directory structure for Urdu content:

```bash
mkdir -p docs/ur/modules
mkdir -p docs/ur/sub-modules
mkdir -p docs/ur/chapters
```

### 3. Set up Translation Files

Create translation files in `i18n/ur/`:

```bash
mkdir -p i18n/ur/docusaurus-theme-classic
mkdir -p i18n/ur/code.json
```

### 4. Add RTL Support CSS

Add RTL support in `src/css/custom.css`:

```css
/* RTL support for Urdu */
html[dir="rtl"] {
  text-align: right;
  direction: rtl;
}

html[dir="rtl"] .navbar {
  text-align: right;
}

/* Additional RTL-specific styling as needed */
```

### 5. Build and Test

```bash
npm run build
npm run serve
```

Navigate to `http://localhost:3000` and test the language toggle functionality.

## Translation Process

1. Copy existing English content from `docs/en/` to `docs/ur/`
2. Translate the content into Urdu, maintaining the same file structure
3. Update navigation and sidebar configurations for Urdu
4. Test RTL display and functionality

## Verification Steps

1. Language toggle appears in navbar
2. Content switches between English and Urdu
3. RTL text displays correctly for Urdu
4. All links and navigation work in both languages
5. Language preference persists across sessions