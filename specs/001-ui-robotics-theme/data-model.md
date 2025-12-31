# Data Model: UI Enhancement - Robotics Theme & Advanced UX

**Feature**: 001-ui-robotics-theme
**Date**: 2025-12-18
**Status**: Completed

## Entity: User Highlights

**Description**: Represents text selections made by users with associated color categories and persistence across sessions

**Fields**:
- `id` (string): Unique identifier for the highlight
- `text` (string): The highlighted text content
- `elementId` (string): DOM element identifier where the text is located
- `pageUrl` (string): URL of the page containing the highlight
- `colorCategory` (enum): One of ["Important", "Definition", "Revision", "Question"]
- `timestamp` (Date): When the highlight was created
- `position` (object): {startOffset, endOffset} for text position

**Relationships**:
- Belongs to a specific user session (via localStorage)
- Associated with a specific page and document element

**Validation Rules**:
- Text must not be empty
- Color category must be one of the four defined values
- Position must be valid within the element bounds

## Entity: Knowledge Map Nodes

**Description**: Represents Modules, Lessons, and Concepts with relationships and navigation paths between them

**Fields**:
- `id` (string): Unique identifier for the node
- `type` (enum): One of ["Module", "Lesson", "Concept"]
- `title` (string): Display title of the node
- `description` (string): Brief description of the content
- `url` (string): Navigation URL to the content
- `position` (object): {x, y} coordinates for visualization
- `parentId` (string, optional): ID of parent node (null for root modules)
- `children` (array): Array of child node IDs
- `metadata` (object): Additional properties for styling and behavior

**Relationships**:
- Hierarchical: Parent-child relationships forming the knowledge tree
- Navigation: Links to actual content pages

**Validation Rules**:
- Title must not be empty
- Type must be one of the three defined values
- Position coordinates must be valid numbers
- URL must be a valid relative path

## Entity: Search Index

**Description**: Represents the searchable content across pages, headers, and paragraphs with metadata for filtering

**Fields**:
- `id` (string): Unique identifier for the search entry
- `title` (string): Title of the content section
- `content` (string): The searchable text content
- `url` (string): URL to the content location
- `type` (enum): One of ["Page", "Header", "Paragraph", "Code"]
- `module` (string): Module name for filtering
- `chapter` (string): Chapter name for filtering
- `lastModified` (Date): When the content was last updated

**Relationships**:
- Maps to actual content pages
- Organized by module and chapter for filtering

**Validation Rules**:
- Title and content must not be empty
- URL must be a valid path
- Type must be one of the defined values

## Entity: Floating Dock State

**Description**: Represents the position, visibility, and configuration of the floating action dock across user sessions

**Fields**:
- `isVisible` (boolean): Whether the dock is currently visible
- `position` (object): {x, y} coordinates on screen
- `isCollapsed` (boolean): Whether the dock is in collapsed state
- `activeTool` (string): Currently selected tool (Search, Highlight, etc.)
- `pinnedTools` (array): Array of tool IDs that are pinned to dock
- `dockSize` (object): {width, height} dimensions of the dock
- `lastUpdated` (Date): When the state was last modified

**Relationships**:
- Connected to user's localStorage
- Affects visibility of floating tools

**Validation Rules**:
- Position coordinates must be within screen bounds
- Active tool must be one of the available tools
- Dock size must be within reasonable limits

## Entity: User Preferences

**Description**: Represents user-specific preferences for the UI experience

**Fields**:
- `theme` (enum): One of ["dark", "night-vision"] for theme selection
- `fontSize` (string): User preferred font size
- `animationEnabled` (boolean): Whether UI animations are enabled
- `highlightOpacity` (number): Opacity level for text highlights (0.1 to 1.0)
- `dockTransparency` (number): Transparency level for floating dock (0.1 to 1.0)
- `lastUpdated` (Date): When preferences were last changed

**Relationships**:
- Applied globally across the UI
- Stored in localStorage per user session

**Validation Rules**:
- Theme must be one of the defined values
- Font size must be valid CSS value
- Opacity values must be between 0.1 and 1.0