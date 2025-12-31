---
name: multilingual-architect
description: "A specialized guide for Docusaurus i18n, focusing on bidirectional layout (LTR/RTL) support and accurate Urdu translation integration."
---

# Multilingual Architect Implementation Guide

## Problem Statement
Implement robust internationalization (i18n) in Docusaurus with bidirectional language support for English (LTR) and Urdu (RTL). This implementation must provide a "Translate Button" at the start of each chapter that enables seamless content translation while properly handling RTL layout requirements, appropriate font rendering (Noto Nastaliq Urdu), and maintaining accessibility standards.

## Questions & Constraints
- **Critical Requirement**: "Translate the content in Urdu... by pressing a button at the start of each chapter"
- **Language Support**: English (LTR) and Urdu (RTL) with proper direction switching
- **Font Handling**: Implement Noto Nastaliq Urdu font for proper Urdu text rendering
- **Layout Direction**: Automatic RTL/LTR switching with CSS direction properties
- **Docusaurus Integration**: Follow Docusaurus i18n patterns and best practices
- **Accessibility**: Maintain WCAG compliance for multilingual content
- **Performance**: Optimize translation loading and switching performance

## Proposed Solution
Implement a comprehensive i18n solution using Docusaurus's built-in internationalization features with custom RTL support, proper font loading, and a chapter-level translate button that switches both content and layout direction. This approach ensures proper language rendering while maintaining Docusaurus standards and performance.

## Core Architecture Principles

### Docusaurus i18n Configuration
- **Locale Setup**: Configure English as default locale and Urdu as secondary locale
- **Translation Files**: Generate proper JSON translation files using `docusaurus write-translations`
- **Static Extraction**: Use static extraction for translation strings with proper interpolation
- **Locale Detection**: Implement automatic locale detection with manual override capability

### RTL Layout Management
- **Direction Property**: Set locale direction property to 'rtl' for Urdu in configuration
- **CSS Direction**: Apply `direction: rtl` and `text-align: right` for Urdu content
- **Bidirectional Support**: Handle mixed LTR/RTL content within the same document
- **Component Adaptation**: Ensure all UI components adapt to RTL layout properly

### Font Implementation Protocol
- **Noto Nastaliq Urdu**: Load Noto Nastaliq Urdu font from Google Fonts or local assets
- **Font Stacking**: Implement proper font fallbacks for Urdu text rendering
- **Font Loading**: Optimize font loading with preconnect and font-display strategies
- **Size Adjustment**: Adjust font sizes appropriately for Urdu readability

## Translation System Implementation

### Locale Configuration
```
// docusaurus.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
      },
    },
  },
};
```

### Translation File Structure
- **Code Translations**: Extract translatable strings using `docusaurus write-translations`
- **Content Translations**: Maintain separate translation files for chapter content
- **Dynamic Loading**: Implement lazy loading for translation files to optimize performance
- **Fallback Strategy**: Provide English fallback for untranslated content

## Translate Button Implementation

### Button Placement & Behavior
- **Chapter-Level Placement**: Position translate button at the beginning of each chapter
- **State Management**: Maintain translation state at document level
- **Smooth Transitions**: Implement CSS transitions for layout direction changes
- **User Preference**: Store user language preference in localStorage

### Button Functionality Requirements
1. **Content Translation**:
   - Switch content between English and Urdu versions
   - Maintain scroll position during translation
   - Preserve anchor links and navigation

2. **Layout Direction**:
   - Automatically switch CSS direction property
   - Adjust all UI elements for RTL flow
   - Handle nested components appropriately

3. **Font Application**:
   - Apply Noto Nastaliq Urdu font when Urdu is active
   - Maintain font loading performance
   - Ensure font fallbacks are available

## RTL Layout Standards

### CSS Direction Handling
- **Document Direction**: Apply `dir` attribute to HTML element for proper semantics
- **Component Direction**: Ensure all components respect direction property
- **Spacing & Positioning**: Adjust margins, padding, and positioning for RTL
- **Navigation Flow**: Reverse navigation order and arrow directions appropriately

### Urdu Typography Requirements
- **Text Alignment**: Right-align Urdu text with proper justification
- **Line Height**: Adjust line height for optimal Urdu readability
- **Letter Spacing**: Apply appropriate letter spacing for Nastaliq font
- **Punctuation Handling**: Properly handle Urdu punctuation marks and spacing

## Implementation Standards

### Performance Optimization
- **Translation Bundling**: Bundle translation files efficiently to minimize requests
- **Font Loading Strategy**: Implement font-display: swap to prevent invisible text
- **Caching Strategy**: Cache translation files with appropriate headers
- **Code Splitting**: Split translation code by locale to reduce initial bundle size

### Accessibility Compliance
- **Screen Reader Support**: Ensure translations are properly announced
- **Language Attributes**: Set lang attributes correctly for each language
- **Focus Management**: Maintain focus during translation switches
- **Color Contrast**: Maintain WCAG color contrast ratios in both languages

### Error Handling & Validation
- **Missing Translations**: Gracefully handle untranslated content with fallbacks
- **Font Loading Errors**: Implement font loading error handling with fallback fonts
- **Direction Mismatches**: Validate proper direction application across components
- **Content Validation**: Verify translated content maintains meaning and accuracy

## Quality Assurance Checklist

### Pre-Implementation Validation
- [ ] Docusaurus i18n plugin properly configured
- [ ] Locale configuration includes proper direction settings
- [ ] Translation extraction process established
- [ ] Noto Nastaliq Urdu font properly sourced
- [ ] RTL CSS framework in place
- [ ] Font loading optimization strategy defined

### Implementation Validation
- [ ] Translate button appears at start of each chapter
- [ ] Content switches properly between English and Urdu
- [ ] Layout direction changes correctly for RTL content
- [ ] Noto Nastaliq Urdu font applies to Urdu text
- [ ] All UI components adapt to RTL layout
- [ ] Accessibility attributes are properly set

### Post-Implementation Validation
- [ ] Translation loading performance meets standards
- [ ] Font rendering is correct for Urdu content
- [ ] User preference persistence works across sessions
- [ ] Mixed LTR/RTL content displays properly
- [ ] All interactive elements function in RTL mode
- [ ] Mobile responsiveness maintained in RTL layout

## Testing Requirements

### Unit Testing
- **Translation Switching**: Test language switching functionality
- **Direction Changes**: Verify RTL/LTR layout switching
- **Font Application**: Test font loading and application
- **State Management**: Validate translation state persistence

### Integration Testing
- **Docusaurus Integration**: Test with Docusaurus i18n system
- **Component Compatibility**: Verify all components work in RTL mode
- **Navigation Flow**: Test navigation in both language directions
- **Content Rendering**: Validate proper rendering of translated content

### User Experience Testing
- **Button Placement**: Verify translate button is accessible and visible
- **Transition Smoothness**: Test smoothness of language switching
- **Reading Experience**: Validate readability in both languages
- **Performance Impact**: Measure performance impact of translations

## Monitoring & Observability

### Internationalization Metrics
- **Translation Usage**: Track language preference selection
- **Performance Metrics**: Monitor translation loading times
- **Error Rates**: Track translation and font loading errors
- **User Engagement**: Monitor engagement across different languages

### Accessibility Monitoring
- **Screen Reader Compatibility**: Monitor accessibility tool reports
- **Language Attribute Validation**: Verify proper lang attribute usage
- **WCAG Compliance**: Track accessibility compliance metrics
- **User Feedback**: Collect feedback on multilingual experience

## Anti-Patterns to Avoid

- **Hardcoded Translations**: Never hardcode translation strings directly in components
- **Manual Direction Setting**: Avoid manually setting CSS direction without proper state management
- **Font Loading Blocking**: Don't block page rendering for font loading
- **Inconsistent Layout**: Ensure all components consistently handle RTL direction
- **Missing Lang Attributes**: Always set proper lang attributes for accessibility
- **Poor Fallback Strategy**: Implement proper fallbacks for missing translations

## Deployment Considerations

### Build Configuration
- **Translation Bundling**: Configure build process to include all translation files
- **Font Asset Handling**: Properly bundle or reference font assets
- **CDN Strategy**: Optimize delivery of translation files and fonts
- **Caching Headers**: Set appropriate caching headers for translations

### Environment Configuration
- **Locale Availability**: Ensure all required locales are available in production
- **Font Loading**: Verify font loading works in production environment
- **Performance Monitoring**: Monitor translation performance in production
- **User Preference Storage**: Ensure user preferences persist across deployments

## Phase 7 Implementation Steps

1. **Configure Docusaurus i18n**:
   - Set up locale configuration with English and Urdu
   - Configure direction properties for RTL support
   - Set up translation file generation process

2. **Implement Font Loading**:
   - Add Noto Nastaliq Urdu font to project
   - Configure font loading with performance optimization
   - Set up font fallback strategy

3. **Create Translate Button Component**:
   - Develop reusable translate button component
   - Implement state management for language switching
   - Add smooth transitions for layout changes

4. **Integrate with Chapters**:
   - Add translate button to the start of each chapter
   - Implement content switching functionality
   - Test translation flow across all chapters

5. **Test RTL Layout**:
   - Verify all UI components adapt to RTL layout
   - Test mixed LTR/RTL content handling
   - Validate accessibility compliance

This skill ensures all multilingual implementations follow architectural best practices while properly supporting bidirectional language requirements for English and Urdu.