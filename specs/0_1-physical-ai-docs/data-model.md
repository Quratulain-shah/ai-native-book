# Data Model: Physical AI & Humanoid Robotics Documentation Site

This document outlines the content structure for the documentation site. As a static site generated from Markdown files, there is no traditional database model. Instead, the "data model" refers to the organization and schema of the content files themselves.

## Key Entities

### 1. Module

A **Module** represents a top-level section of the course. It serves as a container for a group of related topics.

-   **Representation**: A subdirectory within the main `docs/` directory, or a standalone markdown file with frontmatter defining it as a category.
-   **Fields**:
    -   `title` (string): The name of the module (e.g., "Module 1: The Robotic Nervous System").
    -   `position` (integer): The order in which the module should appear in the navigation.
-   **Relationships**:
    -   Has many **Topics**.

### 2. Topic

A **Topic** represents a specific lesson or subject within a Module, corresponding to the weekly breakdown.

-   **Representation**: A Markdown file (`.md`) within a module's directory.
-   **Fields**:
    -   `title` (string): The title of the topic (e.g., "ROS 2 Nodes, Topics, and Services").
    -   `sidebar_label` (string, optional): A shorter label for the navigation sidebar.
    -   `position` (integer): The order of the topic within its module.
    -   `content` (Markdown): The full text, code, and images for the lesson.
-   **Relationships**:
    -   Belongs to one **Module**.

### 3. Content Page

This is not a distinct entity from **Topic** but represents the final rendered HTML page for a given topic. Its structure is determined by the Markdown content and Docusaurus's templating.

## Content Structure Example

The file system will be the primary data store and will reflect this model:

```
docs/
├── 01-module-one/
│   ├── 01-topic-a.md
│   └── 02-topic-b.md
├── 02-module-two/
│   ├── 01-topic-c.md
│   └── 02-topic-d.md
...
```
