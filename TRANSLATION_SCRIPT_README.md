# Documentation Translation Script

This script automatically translates the entire Docusaurus documentation project from English to Urdu while preserving all formatting, code blocks, and structure.

## Features

- **Large Content Handling**: Splits large files into manageable chunks to prevent API limits
- **Format Preservation**: Maintains Markdown, MDX, and JavaScript structure
- **Code Block Protection**: Preserves code blocks (``` ```), inline code (`code`), URLs, and configuration keys
- **Comprehensive Coverage**: Translates documentation, blog posts, and configuration files
- **Config File Support**: Handles special translation needs for sidebars.js and docusaurus.config.js

## Setup

1. Update the `translateText` function in `translate_docs.js` with your actual translation API implementation
2. Make sure your API can handle the following signature:
   ```javascript
   async function translateText(text, sourceLang = 'en', targetLang = 'ur')
   ```

## Configuration

Edit the `translate_docs.js` file and replace the placeholder translation function with your actual API:

```javascript
async function translateText(text, sourceLang = 'en', targetLang = 'ur') {
  const response = await fetch('YOUR_TRANSLATION_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any required authentication headers
    },
    body: JSON.stringify({
      text: text,
      source: sourceLang,
      target: targetLang
    })
  });
  const result = await response.json();
  return result.translatedText;
}
```

## Files to be Translated

The script will process:

### Documentation Files
- `docs/**/*.md`
- `docs/**/*.mdx`

### Blog Files
- `blog/**/*.md`
- `blog/**/*.mdx`

### Configuration Files
- `sidebars.js` (labels only)
- `docusaurus.config.js` (navbar & footer visible text only)

## Usage

1. Configure your translation API in the script as described above
2. Run the translation script:
   ```bash
   node translate_docs.js
   ```

## Large Content Handling

The script automatically handles large files by:

1. Preserving code blocks and other non-translatable elements
2. Splitting content into chunks of maximum 2000 characters
3. Translating each chunk individually
4. Reassembling the content while maintaining structure
5. Ensuring chunks don't break code blocks or other structural elements

## Content Protection Rules

The script will NOT translate:

- Code blocks (```code```)
- Inline code (`code`)
- File names, paths, imports, exports
- URLs
- Configuration keys or object structure
- Frontmatter (YAML between ---)
- Docusaurus-specific syntax

## Verification

After translation, verify:

1. All content is in Urdu
2. Code blocks remain unchanged
3. Links and paths are preserved
4. Configuration structure is intact
5. Sidebar, navbar, and footer display Urdu text

## Troubleshooting

- If you encounter API rate limits, consider adding delays between requests
- For very large files, you may need to adjust the `maxChunkSize` parameter
- Make sure your API can handle the text format being sent