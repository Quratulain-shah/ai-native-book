# Data Model: Physical AI & Humanoid Robotics Textbook

## Overview
This document defines the data models for the textbook content management and backend services, including content structure, user data, and chatbot interaction models.

## Textbook Content Entities

### Textbook Module
- **name**: String (e.g., "Module 1: The Robotic Nervous System")
- **module_number**: Integer (1-4)
- **weeks**: Integer range (e.g., 3-5 for Module 1)
- **description**: String (module overview)
- **learning_objectives**: Array of strings (specific learning goals)
- **prerequisites**: Array of strings (required knowledge/skills)
- **target_hardware**: Array of strings (NVIDIA Jetson Orin Nano, Intel RealSense D435i, etc.)
- **content_units**: Array of ContentUnit references
- **total_duration_hours**: Integer (estimated hours to complete)

### Content Unit (Chapter/Lesson)
- **title**: String (chapter title)
- **slug**: String (URL-friendly identifier)
- **sidebar_position**: Integer (for Docusaurus navigation)
- **module_reference**: String (link to parent module)
- **content_type**: Enum (theory, simulation_lab, physical_deployment)
- **learning_objectives**: Array of strings
- **duration_minutes**: Integer (estimated time to complete)
- **prerequisites**: Array of strings (required prior knowledge)
- **required_equipment**: Array of strings (specific hardware needed)
- **theoretical_content**: String (Markdown format)
- **simulation_content**: String (Markdown with code examples)
- **physical_deployment_content**: String (Markdown with hardware instructions)
- **exercises**: Array of Exercise objects
- **assets**: Array of Asset objects

### Exercise
- **id**: String (unique identifier)
- **title**: String (exercise title)
- **description**: String (what the student should accomplish)
- **difficulty_level**: Enum (beginner, intermediate, advanced)
- **estimated_completion_time**: Integer (minutes)
- **solution_reference**: String (link to solution or hints)
- **related_concepts**: Array of strings (concepts this exercise reinforces)

### Asset
- **id**: String (unique identifier)
- **filename**: String (original file name)
- **file_path**: String (relative path from /static/img/)
- **alt_text**: String (accessibility description)
- **caption**: String (descriptive caption)
- **related_content_unit**: String (link to associated content unit)
- **asset_type**: Enum (diagram, photo, video, code_example)

## User Management Entities

### User
- **id**: String (unique user identifier, likely from authentication provider)
- **email**: String (user's email address)
- **name**: String (display name)
- **role**: Enum (student, instructor, admin)
- **enrollment_status**: Enum (active, completed, dropped)
- **current_module**: Integer (currently enrolled module number)
- **progress_data**: Array of Progress objects
- **personalization_preferences**: Object (language, accessibility settings, etc.)
- **created_at**: DateTime (account creation timestamp)
- **last_accessed**: DateTime (last login timestamp)

### Progress
- **user_id**: String (reference to User)
- **content_unit_id**: String (reference to ContentUnit)
- **completion_status**: Enum (not_started, in_progress, completed)
- **completion_date**: DateTime (when unit was completed)
- **exercise_scores**: Array of ExerciseScore objects
- **time_spent_minutes**: Integer (total time spent on unit)
- **notes**: String (user's personal notes on the content)

### ExerciseScore
- **exercise_id**: String (reference to Exercise)
- **user_id**: String (reference to User)
- **score**: Float (0.0 to 1.0)
- **attempt_count**: Integer (number of attempts)
- **last_attempt_date**: DateTime (when last attempted)
- **feedback**: String (instructor or automated feedback)

## Chatbot Interaction Entities

### ChatSession
- **id**: String (unique session identifier)
- **user_id**: String (reference to User, null for anonymous)
- **session_start**: DateTime (when session began)
- **session_end**: DateTime (when session ended, null if active)
- **context_module**: String (current module context)
- **context_unit**: String (current content unit context)
- **is_active**: Boolean (whether session is currently active)

### ChatMessage
- **id**: String (unique message identifier)
- **session_id**: String (reference to ChatSession)
- **sender_type**: Enum (user, ai_assistant)
- **content**: String (message text)
- **timestamp**: DateTime (when message was sent)
- **related_content**: String (reference to relevant content unit or concept)
- **message_type**: Enum (query, response, suggestion, error)

### KnowledgeChunk
- **id**: String (unique chunk identifier)
- **content_unit_id**: String (reference to ContentUnit)
- **chunk_text**: String (text content for RAG retrieval)
- **embedding_vector**: Array of Floats (vector representation for similarity search)
- **keywords**: Array of strings (important terms in the chunk)
- **relevance_score**: Float (how often this chunk is referenced)
- **last_updated**: DateTime (when chunk was last modified)

## System Configuration

### CurriculumStructure
- **total_modules**: Integer (4 for this textbook)
- **total_weeks**: Integer (13 for this curriculum)
- **modules**: Array of Module objects (defined above)
- **prerequisites_map**: Object (mapping of what content requires what prior knowledge)
- **assessment_structure**: Object (how exercises and assessments are organized)

### HardwareConfiguration
- **target_platforms**: Array of objects containing:
  - **name**: String (e.g., "NVIDIA Jetson Orin Nano")
  - **specifications**: Object (CPU, GPU, memory, etc.)
  - **setup_guide_reference**: String (link to setup guide)
  - **compatibility_notes**: String (version compatibility, etc.)
- **sensor_configurations**: Array of objects for sensors like Intel RealSense
- **robot_models**: Array of objects for Unitree robots (Go2/G1)

## Validation Rules

### Content Unit Validation
- Each ContentUnit must have at least one learning objective
- Content type must be one of: theory, simulation_lab, physical_deployment
- Duration must be a positive integer
- Prerequisites must reference valid prior content units
- Theoretical content must be in valid Markdown format

### Module Validation
- Module number must be between 1 and 4
- Week range must be valid (e.g., 3-5, 6-7, etc.)
- Module must contain at least one content unit
- Module must have a non-empty description

### User Validation
- Email must be a valid email format
- Role must be one of: student, instructor, admin
- Progress entries must reference valid content units
- User cannot have multiple active sessions simultaneously

## State Transitions

### Content Unit States
- not_started → in_progress (when user begins content)
- in_progress → completed (when user completes all exercises/requirements)
- completed → in_progress (when user returns to review content)

### User Progress States
- active → completed (when user finishes entire module)
- active → dropped (when user discontinues course)
- dropped → active (if user resumes course)

## Relationships

### Module to Content Unit
- One Module contains many ContentUnits
- Each ContentUnit belongs to exactly one Module
- ContentUnits are ordered within Module based on sidebar_position

### User to Progress
- One User has many Progress entries
- Each Progress entry belongs to exactly one User
- Progress entries are specific to ContentUnits

### ChatSession to ChatMessage
- One ChatSession contains many ChatMessages
- Each ChatMessage belongs to exactly one ChatSession
- Messages are ordered chronologically within sessions