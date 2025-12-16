# Quickstart: Physical AI & Humanoid Robotics Textbook

## Overview
This quickstart guide provides the essential steps to begin developing and contributing to the Physical AI & Humanoid Robotics textbook. The textbook follows a 13-week curriculum structure with four modules covering ROS 2, Digital Twins, NVIDIA Isaac, and Vision-Language-Action systems.

## Prerequisites

### System Requirements
- Node.js 18+ and npm/yarn for Docusaurus frontend
- Python 3.11+ for backend services
- Git for version control
- GitHub account for collaboration

### Development Tools
- VS Code or similar editor with Markdown support
- Git client (command-line or GUI)
- Modern web browser for testing

## Setup Instructions

### 1. Clone the Repository
```bash
git clone [repository-url]
cd ai-native-book
```

### 2. Set Up Frontend (Docusaurus)
```bash
cd frontend
npm install
```

### 3. Set Up Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
```

### 4. Run the Development Servers

#### Frontend Development Server
```bash
cd frontend
npm start
```
This will start the Docusaurus development server at `http://localhost:3000`

#### Backend Development Server
```bash
cd backend
uvicorn src.main:app --reload
```
This will start the FastAPI server at `http://localhost:8000`

## Textbook Content Structure

### Module Organization
The textbook content is organized in `frontend/docs/` following this structure:

```
frontend/docs/
├── intro/                    # Introduction and syllabus
├── 01-module-1/             # Module 1: The Robotic Nervous System (Weeks 3-5)
│   ├── 01-ros2-fundamentals.md
│   ├── 02-nodes-topics-services.md
│   ├── 03-urdf-modeling.md
│   ├── 04-rclpy-python.md
│   ├── 05-digital-twin-simulation.md
│   └── 06-physical-deployment.md
├── 02-module-2/             # Module 2: The Digital Twin (Weeks 6-7)
│   ├── 01-gazebo-physics.md
│   ├── 02-unity-rendering.md
│   ├── 03-sensor-integration.md
│   ├── 04-lidar-depth-cameras.md
│   ├── 05-digital-twin-exercises.md
│   └── 06-sim-to-real-transfer.md
├── 03-module-3/             # Module 3: The AI-Robot Brain (Weeks 8-10)
│   ├── 01-nvidia-isaac-sim.md
│   ├── 02-isaac-ros.md
│   ├── 03-vslam-navigation.md
│   ├── 04-nav2-systems.md
│   ├── 05-reinforcement-learning.md
│   ├── 06-digital-twin-training.md
│   └── 07-physical-deployment.md
├── 04-module-4/             # Module 4: Vision-Language-Action (Weeks 11-13)
│   ├── 01-vision-language-action.md
│   ├── 02-whisper-audio-processing.md
│   ├── 03-llm-cognitive-planning.md
│   ├── 04-autonomous-humanoid-capstone.md
│   ├── 05-simulated-capstone-project.md
│   └── 06-physical-capstone-deployment.md
└── capstone/                # Capstone project content
```

## Creating New Content

### Content File Template
Each content file should follow this template:

```markdown
---
title: "Descriptive Title"
slug: "/module-1/ros2-fundamentals"
sidebar_position: 1
---

# Module 1: ROS 2 Fundamentals

## Learning Objectives
- Understand the basic concepts of ROS 2
- Learn how to create and run ROS 2 nodes
- Implement basic communication patterns

## Theory Section
[Theoretical content explaining concepts]

## Digital Twin Lab (Simulation)
[Simulation exercises using Isaac/Gazebo with code examples]

## Physical AI Deployment (Edge)
[Deployment instructions for NVIDIA Jetson Orin platform]

## Summary
[Key takeaways from the chapter]

## Exercises
1. [Exercise description]
2. [Exercise description]
```

### File Naming Convention
- Use numbered prefixes for proper sidebar ordering: `01-`, `02-`, `03-`, etc.
- Use descriptive, lowercase names with hyphens: `01-ros2-fundamentals.md`
- Keep filenames under 50 characters for better readability

## Hardware Integration

### Target Platforms
- **NVIDIA Jetson Orin Nano**: For edge AI and robotics deployment
- **Intel RealSense D435i**: For depth sensing and computer vision
- **Unitree Go2/G1**: For humanoid robotics applications

### Hardware Documentation
- Include specific setup instructions for each platform
- Provide troubleshooting guides for common hardware issues
- Document version compatibility requirements

## Development Workflow

### 1. Feature Branch Creation
```bash
git checkout -b feature/descriptive-feature-name
```

### 2. Content Development
- Create or modify content files in `frontend/docs/`
- Update `sidebars.js` to include new content in navigation
- Test locally using `npm start`

### 3. Backend Integration
- If adding new API endpoints, define them in `backend/src/api/`
- Update data models in `backend/src/models/` if needed
- Add corresponding service logic in `backend/src/services/`

### 4. Testing
- Verify content renders correctly in Docusaurus
- Test all code examples and simulation exercises
- Ensure navigation and cross-references work properly

### 5. Commit and Push
```bash
git add .
git commit -m "Add descriptive commit message"
git push origin feature/descriptive-feature-name
```

## RAG Chatbot Integration

### Content Chunking
- Content is automatically chunked for RAG retrieval
- Use clear headings and semantic structure for better chunking
- Include relevant keywords in content for better retrieval

### API Endpoints
- Chat interface: `POST /api/chat`
- Content search: `POST /api/search`
- Session management: `POST /api/session`

## Deployment

### GitHub Pages
- Frontend is automatically deployed to GitHub Pages
- Deployment triggered by pushes to main branch
- Verify deployment at `[repository-name].github.io`

### Backend Deployment
- Backend services deployed separately (configuration specific to hosting provider)
- Environment variables configured for production deployment
- Database connections established for production use

## Best Practices

### Content Writing
- Follow the Theory -> Simulation -> Physical Deployment flow
- Include code examples with proper syntax highlighting
- Use consistent terminology throughout the textbook
- Include learning objectives at the beginning of each chapter

### Technical Accuracy
- Test all code examples in the specified environments
- Verify hardware setup instructions are accurate
- Include version numbers for software dependencies
- Provide troubleshooting tips for common issues

### Accessibility
- Use descriptive alt text for images
- Include captions for diagrams and photos
- Use semantic heading structure (H1, H2, H3)
- Ensure sufficient color contrast for readability