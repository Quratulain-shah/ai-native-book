#!/usr/bin/env python3
"""
Documentation Translation Script
Uses the existing backend translation service to translate the entire Docusaurus documentation project
"""
import os
import re
import asyncio
import aiohttp
from pathlib import Path
import argparse


def preserve_code_blocks(content):
    """Preserve code blocks and other non-translatable elements"""
    preserved = []
    output = content
    placeholder_id = 0

    # Preserve import statements (these should never be translated)
    import_regex = r'import\s+.*?from\s+[\'"][^\'"]+[\'"]'
    for match in re.finditer(import_regex, output):
        placeholder = f'__IMPORT_{placeholder_id}__'
        preserved.append({'placeholder': placeholder, 'content': match.group()})
        output = output.replace(match.group(), placeholder, 1)
        placeholder_id += 1

    # Preserve JSX attributes and expressions using a more sophisticated approach
    # First, find all JSX opening tags (with or without attributes)
    jsx_opening_tag_regex = r'<\w+[^>]*>'
    for match in re.finditer(jsx_opening_tag_regex, output):
        placeholder = f'__JSX_OPEN_TAG_{placeholder_id}__'
        preserved.append({'placeholder': placeholder, 'content': match.group()})
        output = output.replace(match.group(), placeholder, 1)
        placeholder_id += 1

    # Preserve JSX self-closing tags
    jsx_self_closing_tag_regex = r'<\w+[^>]*/>'
    for match in re.finditer(jsx_self_closing_tag_regex, output):
        placeholder = f'__JSX_SELF_TAG_{placeholder_id}__'
        preserved.append({'placeholder': placeholder, 'content': match.group()})
        output = output.replace(match.group(), placeholder, 1)
        placeholder_id += 1

    # Preserve JSX closing tags
    jsx_closing_tag_regex = r'</\w+>'
    for match in re.finditer(jsx_closing_tag_regex, output):
        placeholder = f'__JSX_CLOSE_TAG_{placeholder_id}__'
        preserved.append({'placeholder': placeholder, 'content': match.group()})
        output = output.replace(match.group(), placeholder, 1)
        placeholder_id += 1

    # Handle JSX expressions more carefully by using a stack-based approach to handle nested braces
    # This is needed to properly handle complex expressions like {(() => { ... })()}
    pos = 0
    while pos < len(output):
        brace_pos = output.find('{', pos)
        if brace_pos == -1:
            break

        # Find the matching closing brace using a stack
        stack = 1
        i = brace_pos + 1
        while i < len(output) and stack > 0:
            if output[i] == '{':
                stack += 1
            elif output[i] == '}':
                stack -= 1
            i += 1

        if stack == 0:
            # Found matching braces
            jsx_expr = output[brace_pos:i]
            # Only preserve if it looks like code (contains JS syntax)
            is_code_like = any(keyword in jsx_expr for keyword in [
                '=>', 'function', 'const', 'let', 'var', 'return', 'import', 'from',
                'true', 'false', 'null', 'undefined', 'this', 'new', 'class', 'async',
                'await', 'for', 'if', 'else', 'while', 'switch', 'case', 'break', 'continue',
                '(', ')', '[', ']', ':', ';', '&&', '||', '===', '==', '!=', '<', '>'
            ])

            if is_code_like:
                placeholder = f'__JSX_EXPR_{placeholder_id}__'
                preserved.append({'placeholder': placeholder, 'content': jsx_expr})
                output = output[:brace_pos] + placeholder + output[i:]
                placeholder_id += 1
                pos = brace_pos + len(placeholder)  # Move past the placeholder
            else:
                pos = brace_pos + 1  # Move past this brace
        else:
            # Unmatched brace, move to next
            pos = brace_pos + 1

    # Preserve fenced code blocks (```code```)
    fenced_code_regex = r'```.*?```'
    for match in re.finditer(fenced_code_regex, output, re.DOTALL):
        placeholder = f'__CODE_BLOCK_{placeholder_id}__'
        preserved.append({'placeholder': placeholder, 'content': match.group()})
        output = output.replace(match.group(), placeholder, 1)
        placeholder_id += 1

    # Preserve inline code blocks (`code`)
    inline_code_regex = r'`[^`]*`'
    for match in re.finditer(inline_code_regex, output):
        placeholder = f'__INLINE_CODE_{placeholder_id}__'
        preserved.append({'placeholder': placeholder, 'content': match.group()})
        output = output.replace(match.group(), placeholder, 1)
        placeholder_id += 1

    # Preserve URLs
    url_regex = r'https?://[^\s<>"{}|\\^`\[\]]+'
    for match in re.finditer(url_regex, output):
        placeholder = f'__URL_{placeholder_id}__'
        preserved.append({'placeholder': placeholder, 'content': match.group()})
        output = output.replace(match.group(), placeholder, 1)
        placeholder_id += 1

    return output, preserved


def restore_code_blocks(content, preserved):
    """Restore code blocks and other preserved elements"""
    output = content
    for item in preserved:
        output = output.replace(item['placeholder'], item['content'])
    return output


def split_into_chunks(content, max_chunk_size=2000):
    """Split content into chunks without breaking code blocks or structure"""
    lines = content.split('\n')
    chunks = []
    current_chunk = ''

    for line in lines:
        # If adding this line would exceed the chunk size
        if len(current_chunk) + len(line) > max_chunk_size and current_chunk.strip():
            # Save the current chunk
            chunks.append(current_chunk)
            current_chunk = line + '\n'
        else:
            current_chunk += line + '\n'

    # Add the last chunk if it's not empty
    if current_chunk.strip():
        chunks.append(current_chunk)

    return chunks


async def translate_text(session, text, target_lang='ur'):
    """Call the backend translation API"""
    try:
        async with session.post(
            'http://localhost:8000/translate-text',
            json={'text': text, 'language': target_lang},
            timeout=aiohttp.ClientTimeout(total=30)
        ) as response:
            if response.status != 200:
                raise Exception(f'Translation API error: {response.status}')
            result = await response.json()
            return result.get('translated_text', '')
    except Exception as e:
        print(f'Translation error: {e}')
        raise


async def translate_file(file_path, session, target_lang='ur'):
    """Translate a single documentation file"""
    print(f'Translating file: {file_path}')

    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Preserve code blocks and other non-translatable elements
    clean_content, preserved = preserve_code_blocks(content)

    # Split into chunks if the content is large
    chunks = split_into_chunks(clean_content)
    translated_chunks = []

    for i, chunk in enumerate(chunks):
        print(f'  Translating chunk {i+1}/{len(chunks)} for {file_path}')

        # Skip chunks that are only frontmatter, code, or other non-text content
        trimmed_chunk = chunk.strip()
        if (not trimmed_chunk or
            trimmed_chunk.startswith('---') or  # Frontmatter
            '__CODE_BLOCK_' in chunk or
            '__INLINE_CODE_' in chunk or
            '__URL_' in chunk or
            '__JSX_' in chunk or  # All JSX-related placeholders
            '__IMPORT_' in chunk):
            translated_chunks.append(chunk)
            continue

        # Translate the chunk
        translated_chunk = await translate_text(session, chunk, target_lang)
        translated_chunks.append(translated_chunk)

    # Combine translated chunks
    translated_content = ''.join(translated_chunks)

    # Restore code blocks and other preserved elements
    translated_content = restore_code_blocks(translated_content, preserved)

    # Write the translated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(translated_content)

    print(f'Successfully translated: {file_path}')


async def translate_config_file(file_path, session, target_lang='ur'):
    """Translate visible text in configuration files"""
    print(f'Translating config file: {file_path}')

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # This is a complex task, but we'll translate string values that are likely visible text
    # For example, in sidebars.js, we want to translate 'label' values

    # Find all label properties and collect them for translation
    label_pattern = r'(["\'])label\1\s*:\s*(["\'])(.*?)(?=\2\s*[,\]])'
    matches = list(re.finditer(label_pattern, content))

    # Process matches in reverse order to avoid position shifting
    for match in reversed(matches):
        full_match = match.group(0)
        quote_char = match.group(1)
        label_content = match.group(3)

        # Don't translate technical terms like 'Module', 'module', etc.
        if any(term in label_content.lower() for term in ['module', 'week', 'intro', 'docs', 'blog', 'github']):
            continue

        # Translate the label content
        try:
            translated_label = await translate_text(session, label_content, target_lang)
            # Replace the original label with the translated one
            original_quoted = f'{quote_char}{label_content}{quote_char}'
            translated_quoted = f'{quote_char}{translated_label}{quote_char}'
            content = content.replace(full_match, full_match.replace(original_quoted, translated_quoted), 1)
        except Exception as e:
            print(f'Error translating label "{label_content}": {e}')
            continue

    # Write the updated content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'Successfully processed config: {file_path}')


async def main():
    parser = argparse.ArgumentParser(description='Translate documentation to Urdu')
    parser.add_argument('--target', default='ur', help='Target language (default: ur)')
    parser.add_argument('--docs-dir', default='./docs', help='Documentation directory')
    parser.add_argument('--blog-dir', default='./blog', help='Blog directory')
    parser.add_argument('--backend-url', default='http://localhost:8000', help='Backend API URL')

    args = parser.parse_args()

    print('Starting translation of the entire documentation project...')

    # Find all documentation and blog files
    docs_files = []
    blog_files = []

    for root, dirs, files in os.walk(args.docs_dir):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                docs_files.append(os.path.join(root, file))

    for root, dirs, files in os.walk(args.blog_dir):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                blog_files.append(os.path.join(root, file))

    print(f'Found {len(docs_files)} documentation files')
    print(f'Found {len(blog_files)} blog files')

    # Create HTTP session
    async with aiohttp.ClientSession() as session:
        # Translate all documentation files
        for i, file_path in enumerate(docs_files):
            print(f'Processing documentation file {i+1}/{len(docs_files)}: {file_path}')
            try:
                await translate_file(file_path, session, args.target)
            except Exception as e:
                print(f'Error translating {file_path}: {e}')

        # Translate all blog files
        for i, file_path in enumerate(blog_files):
            print(f'Processing blog file {i+1}/{len(blog_files)}: {file_path}')
            try:
                await translate_file(file_path, session, args.target)
            except Exception as e:
                print(f'Error translating {file_path}: {e}')

        # Translate configuration files
        config_files = ['./sidebars.js', './docusaurus.config.js']
        for config_file in config_files:
            if os.path.exists(config_file):
                try:
                    await translate_config_file(config_file, session, args.target)
                except Exception as e:
                    print(f'Error processing config {config_file}: {e}')

    print('Translation process completed!')


if __name__ == '__main__':
    asyncio.run(main())