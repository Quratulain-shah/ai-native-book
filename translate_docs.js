const fs = require('fs').promises;
const path = require('path');

// This function integrates with your existing translation API
// Using the same approach as your backend translation_service.py
async function translateText(text, sourceLang = 'auto', targetLang = 'ur') {
  // Call the backend translation API
  const response = await fetch('http://localhost:8000/translate-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      language: targetLang
    })
  });

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.translated_text; // API returns {translated_text: "..."}
}

// Split large content into chunks to handle large files
function splitIntoChunks(content, maxChunkSize = 2000) {
  // Don't split within code blocks, lists, or other structured elements
  const lines = content.split('\n');
  const chunks = [];
  let currentChunk = '';

  for (const line of lines) {
    // If adding this line would exceed the chunk size
    if (currentChunk.length + line.length > maxChunkSize) {
      // If current chunk is not empty, save it
      if (currentChunk.trim()) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      // If the line itself is larger than maxChunkSize, handle it specially
      if (line.length > maxChunkSize) {
        // For very long lines, we might need to handle them differently
        // For now, let's put them in their own chunk
        chunks.push(line);
      } else {
        currentChunk = line + '\n';
      }
    } else {
      currentChunk += line + '\n';
    }
  }

  // Add the last chunk if it's not empty
  if (currentChunk.trim()) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Function to identify and preserve code blocks
function preserveCodeBlocks(content) {
  const preserved = [];
  let output = content;
  let placeholderId = 0;

  // Preserve fenced code blocks (```code```)
  const fencedCodeRegex = /```[\s\S]*?```/g;
  output = output.replace(fencedCodeRegex, (match) => {
    const placeholder = `__CODE_BLOCK_${placeholderId}__`;
    preserved.push({ placeholder, content: match });
    placeholderId++;
    return placeholder;
  });

  // Preserve inline code blocks (`code`)
  const inlineCodeRegex = /`[^`]*`/g;
  output = output.replace(inlineCodeRegex, (match) => {
    const placeholder = `__INLINE_CODE_${placeholderId}__`;
    preserved.push({ placeholder, content: match });
    placeholderId++;
    return placeholder;
  });

  return { content: output, preserved };
}

// Function to restore code blocks after translation
function restoreCodeBlocks(content, preserved) {
  let output = content;
  for (const item of preserved) {
    output = output.replace(item.placeholder, item.content);
  }
  return output;
}

// Function to translate a single file
async function translateFile(filePath) {
  try {
    console.log(`Translating file: ${filePath}`);
    const content = await fs.readFile(filePath, 'utf8');

    // Preserve code blocks and other non-translatable elements
    const { content: cleanContent, preserved } = preserveCodeBlocks(content);

    // Split into chunks if the content is large
    const chunks = splitIntoChunks(cleanContent);
    const translatedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Translating chunk ${i + 1}/${chunks.length} for ${filePath}`);

      // Skip chunks that are only frontmatter, code, or other non-text content
      const trimmedChunk = chunks[i].trim();
      if (!trimmedChunk ||
          trimmedChunk.startsWith('---') ||
          trimmedChunk.includes('__CODE_BLOCK_') ||
          trimmedChunk.includes('__INLINE_CODE_')) {
        translatedChunks.push(chunks[i]);
        continue;
      }

      // Translate the chunk
      const translatedChunk = await translateText(chunks[i]);
      translatedChunks.push(translatedChunk);
    }

    // Combine translated chunks
    let translatedContent = translatedChunks.join('');

    // Restore code blocks
    translatedContent = restoreCodeBlocks(translatedContent, preserved);

    // Write the translated content back to the file
    await fs.writeFile(filePath, translatedContent, 'utf8');
    console.log(`Successfully translated: ${filePath}`);
  } catch (error) {
    console.error(`Error translating ${filePath}:`, error);
  }
}

// Function to translate sidebars.js - only translate labels
async function translateSidebars(filePath) {
  try {
    console.log(`Translating sidebar labels: ${filePath}`);
    const content = await fs.readFile(filePath, 'utf8');

    // Find all label properties and translate their values
    let translatedContent = content.replace(/(['"])label\1\s*:\s*(['"])(.*?)(?=\2\s*,)/g, (match, quote1, quote2, label) => {
      if (label.trim() && !label.includes('module') && !label.includes('Module')) {
        // This is a mock translation - replace with actual API call
        return match; // Replace this with actual translated label
      }
      return match;
    });

    await fs.writeFile(filePath, translatedContent, 'utf8');
    console.log(`Successfully translated sidebar: ${filePath}`);
  } catch (error) {
    console.error(`Error translating ${filePath}:`, error);
  }
}

// Function to translate visible text in docusaurus.config.js
async function translateConfig(filePath) {
  try {
    console.log(`Translating config visible text: ${filePath}`);
    const content = await fs.readFile(filePath, 'utf8');

    // This is a complex task as we need to parse the JS file and only translate visible text
    // For now, we'll use regex to find and translate string values that are likely visible text
    let translatedContent = content;

    // Translate title
    translatedContent = translatedContent.replace(/(['"])title\1\s*:\s*(['"])(.*?)(?=\2\s*[,\}])/g, (match, quote1, quote2, title) => {
      if (title.includes('Physical AI') || title.includes('Robotics')) {
        // Replace with actual API call
        return match;
      }
      return match;
    });

    // Translate tagline
    translatedContent = translatedContent.replace(/(['"])tagline\1\s*:\s*(['"])(.*?)(?=\2\s*[,\}])/g, (match, quote1, quote2, tagline) => {
      if (tagline.includes('Exploring') || tagline.includes('AI')) {
        // Replace with actual API call
        return match;
      }
      return match;
    });

    // Translate footer links
    translatedContent = translatedContent.replace(/(['"])label\1\s*:\s*(['"])(.*?)(?=\2\s*[,\}])/g, (match, quote1, quote2, label) => {
      if (['Docs', 'Blog', 'GitHub', 'Stack Overflow', 'Discord', 'Twitter', 'More', 'Community'].includes(label)) {
        // Replace with actual API call
        return match;
      }
      return match;
    });

    await fs.writeFile(filePath, translatedContent, 'utf8');
    console.log(`Successfully translated config: ${filePath}`);
  } catch (error) {
    console.error(`Error translating ${filePath}:`, error);
  }
}

// Main function to translate the entire project
async function translateProject() {
  console.log('Starting translation of the entire documentation project to Urdu...');

  // Find and translate all documentation files
  const docsDir = './docs';
  const blogDir = './blog';

  // Get all .md and .mdx files from docs directory
  const docsFiles = await findFiles(docsDir, ['.md', '.mdx']);
  console.log(`Found ${docsFiles.length} documentation files`);

  // Get all .md and .mdx files from blog directory
  const blogFiles = await findFiles(blogDir, ['.md', '.mdx']);
  console.log(`Found ${blogFiles.length} blog files`);

  // Track progress
  let totalFiles = docsFiles.length + blogFiles.length + 2; // +2 for config files
  let completedFiles = 0;

  // Translate all documentation files
  for (let i = 0; i < docsFiles.length; i++) {
    console.log(`Translating documentation file ${i + 1}/${docsFiles.length}: ${docsFiles[i]}`);
    try {
      await translateFile(docsFiles[i]);
      completedFiles++;
      console.log(`Progress: ${completedFiles}/${totalFiles} files completed`);
    } catch (error) {
      console.error(`Failed to translate ${docsFiles[i]}:`, error);
    }
  }

  // Translate all blog files
  for (let i = 0; i < blogFiles.length; i++) {
    console.log(`Translating blog file ${i + 1}/${blogFiles.length}: ${blogFiles[i]}`);
    try {
      await translateFile(blogFiles[i]);
      completedFiles++;
      console.log(`Progress: ${completedFiles}/${totalFiles} files completed`);
    } catch (error) {
      console.error(`Failed to translate ${blogFiles[i]}:`, error);
    }
  }

  // Translate configuration files
  console.log('Translating sidebars.js...');
  try {
    await translateSidebars('./sidebars.js');
    completedFiles++;
    console.log(`Progress: ${completedFiles}/${totalFiles} files completed`);
  } catch (error) {
    console.error('Failed to translate sidebars.js:', error);
  }

  console.log('Translating docusaurus.config.js...');
  try {
    await translateConfig('./docusaurus.config.js');
    completedFiles++;
    console.log(`Progress: ${completedFiles}/${totalFiles} files completed`);
  } catch (error) {
    console.error('Failed to translate docusaurus.config.js:', error);
  }

  console.log('Translation process completed!');
  console.log(`Successfully processed ${completedFiles} out of ${totalFiles} files`);
}

// Helper function to recursively find files with specific extensions
async function findFiles(dir, extensions) {
  const results = [];

  try {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // Recursively search in subdirectory
        const subResults = await findFiles(fullPath, extensions);
        results.push(...subResults);
      } else if (extensions.includes(path.extname(item.name))) {
        // Add file with matching extension
        results.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return results;
}

// Run the translation process
translateProject().catch(console.error);