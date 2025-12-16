Mendatory
Phase 1: book content
Phase 2: Minimilistic FastAPI backend with OpenAI Agents SDK having single endpoint "/chat"
Phase 3: Integration of Chatbot (chatkit) on UI and connect with FastAPI Backend
Phase 4: Enhancement and consistency In UI (professional robotics theme)
Phase 5: Use Qdrant cloud and make a tool which OpenAI Agent uses for RAG purpose. Also sync your book content into vectordb.


Extra Marks
Phase 6: Make better auth backend for authentication and NeonDB for credentials. (Probably in nodejs or express)
Phase 7: Multilingual option in UI and implementation
Phase 8: Personalization button on every page of content


Agents and Skills



Phase 1
agent: robotics master
    

Phase 2
agent: Backend Python Developer
    skill: fastapi
    skill: context7 mcp

Phase 3
agent: Backend Python Developer
    skill: context7 mcp

Phase 4
agent: React Frontend Developer
    
    


Phase 7
agent: Main orchestrator
    skill: multi linguall
      skill: better-auth
        mcp: better auth own mcp

Phase 8
agent: Main orchestrator


---

Actual Sketch if Agents and Skills

agent: orchestrator (main)
    skills: multilingual-architect
    skills :better-auth

agent: physical-architect
    

agent: backend-agent

CONTEXT:
Define the comprehensive specification for the "Physical AI & Humanoid Robotics" textbook to be generated in `frontend/docs`.

REQUIREMENTS:
1.  **Syllabus Coverage**:
    -   Must strictly follow the 13-week breakdown defined in the course details.
    -   **Module 1 (Weeks 3-5)**: ROS 2, Nodes, Topics, Services, URDF, rclpy.
    -   **Module 2 (Weeks 6-7)**: Digital Twin, Gazebo physics, Unity rendering, Sensors (LiDAR/Depth).
    -   **Module 3 (Weeks 8-10)**: NVIDIA Isaac Sim, Isaac ROS, VSLAM, Nav2, Reinforcement Learning.
    -   **Module 4 (Weeks 11-13)**: Vision-Language-Action (VLA), Whisper, LLM Cognitive Planning, Autonomous Humanoid Capstone.

2.  **Pedagogical Structure (Embodied AI Pedagogy)**:
    -   Each chapter must follow the flow: Theory -> Digital Twin Simulation (Isaac/Gazebo) -> Physical Edge Deployment (Jetson Orin).
    -   Include specific hardware references: NVIDIA Jetson Orin Nano, Intel RealSense D435i, and Unitree Go2/G1.

3.  **Docusaurus Architecture**:
    -   Define the sidebar structure (Intro, Modules 1-4, Capstone).
    -   Specify the Markdown frontmatter requirements (`slug`, `title`, `sidebar_position`) for proper routing.

4.  **Constraints**:
    -   Align with the Global Constitution.
    -   Content must bridge the gap between "Digital Brain" and "Physical Body".