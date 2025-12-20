# Language Switching API Contract

## Overview
This contract defines the expected behavior of the language switching functionality in the Docusaurus-based textbook. Since this is a static site, the "API" refers to the expected behavior and data flow for language switching.

## Language Selection Endpoint

### Request
- **Method**: N/A (client-side operation)
- **URL**: N/A (handled by Docusaurus routing)
- **Headers**: N/A
- **Body**:
```json
{
  "target_language": "ur|en",
  "persistence_method": "url|storage"
}
```

### Response
- **Success**:
```json
{
  "status": "success",
  "current_language": "ur|en",
  "content_updated": true,
  "ui_updated": true,
  "rtl_applied": true|false
}
```

- **Error**:
```json
{
  "status": "error",
  "message": "Language not supported|Invalid request"
}
```

## Language Preference Persistence

### Get Current Preference
- **Method**: GET
- **Description**: Retrieve current language preference from storage
- **Response**:
```json
{
  "current_language": "ur|en",
  "last_updated": "timestamp",
  "persistence_method": "localStorage|sessionStorage|url"
}
```

## Content Translation API

### Get Translated Content
- **Method**: N/A (handled by Docusaurus static generation)
- **Description**: Retrieve content in the selected language
- **Response**:
```json
{
  "content_id": "string",
  "language": "ur|en",
  "content_type": "module|sub-module|chapter|ui",
  "content": "string",
  "rtl_direction": true|false
}
```

## Validation Rules

1. Target language must be one of the supported languages ('ur', 'en')
2. Content must be available in the requested language before switching
3. RTL styling must be applied when switching to Urdu
4. Language preference must persist across page navigations
5. All UI elements must be translated when language switches