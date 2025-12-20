# Data Model: Urdu Multilingual Support

## Language Preference Entity

**Definition**: User's selected language setting that determines content display language

**Attributes**:
- language_code: String (e.g., 'en', 'ur')
- persistence_method: String (browser storage, URL parameter, or preference)
- last_updated: DateTime

**Validation Rules**:
- language_code must be one of the supported languages ('en', 'ur')
- persistence_method must be valid (localStorage, sessionStorage, URL)

## Translation Content Entity

**Definition**: Localized versions of all book modules, sub-modules, and chapters in Urdu

**Attributes**:
- content_id: String (unique identifier for content piece)
- source_language: String (original language code, e.g., 'en')
- target_language: String (translation language code, e.g., 'ur')
- content_type: String (module, sub-module, chapter, UI element)
- translated_content: String (the actual translated text)
- translation_status: String (pending, in-progress, completed, reviewed)
- created_date: DateTime
- last_modified: DateTime

**Validation Rules**:
- content_id must be unique
- source_language and target_language must be valid language codes
- translated_content must not be empty when status is completed
- translation_status must be one of the defined values

## Language Toggle Entity

**Definition**: UI component in the Navbar that enables switching between available languages

**Attributes**:
- component_id: String (unique identifier for the toggle component)
- available_languages: Array of Strings (supported language codes)
- current_language: String (currently selected language)
- display_format: String (dropdown, buttons, etc.)

**Validation Rules**:
- available_languages must contain at least 2 languages
- current_language must be one of the available languages
- display_format must be a supported format

## Relationships

1. **Language Preference** → **Translation Content**: A user's language preference determines which translation content is displayed
2. **Translation Content** → **Language Toggle**: The language toggle provides access to available translation content

## State Transitions

### Translation Content
- pending → in-progress → completed → reviewed
- reviewed → in-progress (if revisions needed)

### Language Preference
- default (en) → user selection (ur or en) → persistence