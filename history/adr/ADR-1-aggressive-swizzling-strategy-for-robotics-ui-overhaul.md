# ADR-1: Aggressive Swizzling Strategy for Robotics UI Overhaul

**Status**: Accepted
**Date**: 2025-12-18
**Authors**: [Author Name]

## Context

We are implementing a comprehensive UI transformation of a Docusaurus documentation site into an immersive "Robot Operating System" (HUD style) interface. The design requirements include OS-style sidebar navigation, glassmorphism navbar, blueprint backgrounds, and other significant departures from standard Docusaurus UI patterns. Standard CSS theming and minor component overrides are insufficient to achieve the required visual and functional changes.

## Decision

We will override 10+ core Docusaurus components through the swizzling mechanism to achieve the complete "Robotics OS" UI overhaul. The components to be swizzled include:

- @theme/Navbar - For glassmorphism design and OS-style navigation
- @theme/DocSidebar - For OS-style file tree navigation
- @theme/Breadcrumb - To display as file paths per OS metaphor
- @theme/DocPage - To integrate custom UI elements and background
- @theme/DocItem - To add text highlighting functionality
- @theme/TOC - For custom styling and integration with knowledge maps
- @theme/Footer - For status bar footer implementation
- @theme/CodeBlock - For terminal-style code blocks
- @theme/Admonition - For HUD-style admonitions
- @theme/ThemeProvider - For theme management with dark mode

## Consequences

### Positive
- Enables complete control over UI presentation to achieve the required futuristic "Robot OS" aesthetic
- Allows deep integration of interactive features like text highlighting and knowledge maps
- Maintains performance by using Docusaurus infrastructure while customizing presentation
- Provides clear separation between custom and Docusaurus code through structured organization

### Negative
- Creates significant maintenance burden for Docusaurus version upgrades
- Each swizzled component must be manually checked and potentially updated on Docusaurus version changes
- Risk of breaking changes when Docusaurus updates internal APIs used by swizzled components
- Increases complexity of the codebase with multiple custom component implementations

## Alternatives

### Alternative 1: CSS-only customization with minimal swizzling
- Only swizzle components requiring structural changes
- Use extensive CSS customization for visual changes
- **Rejected**: Insufficient for required functional changes like OS-style navigation and text highlighting

### Alternative 2: Complete custom React application
- Build entirely custom UI without Docusaurus
- Use Docusaurus only for content generation
- **Rejected**: Loses Docusaurus benefits like automatic routing, MDX support, and SEO features

## References

- specs/001-ui-robotics-theme/plan.md
- specs/001-ui-robotics-theme/spec.md