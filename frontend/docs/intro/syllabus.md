---
title: "Course Syllabus: Physical AI & Humanoid Robotics"
slug: "/syllabus"
sidebar_position: 2
---

# Course Syllabus: Physical AI & Humanoid Robotics

## Course Overview

This comprehensive 13-week course provides university-level instruction in Physical AI and Humanoid Robotics, bridging the gap between theoretical AI concepts and practical embodied intelligence implementations. The curriculum follows a structured progression from fundamental principles to advanced applications, emphasizing hands-on experience with industry-standard tools and platforms.

### Course Information
- **Duration**: 13 weeks (Semester-long course)
- **Prerequisites**: Basic programming experience, linear algebra, calculus, Linux familiarity
- **Credits**: 4 credit hours (150 contact hours)
- **Format**: Theory, simulation labs, and physical deployment exercises
- **Assessment**: Weekly assignments (40%), Midterm project (20%), Final capstone (40%)

## Weekly Breakdown

### Week 1: Course Introduction & Setup
- Course overview and Physical AI fundamentals
- Hardware setup and safety protocols
- Development environment configuration
- Introduction to ROS 2 concepts
- **Learning Objectives**: Understand Physical AI paradigm, configure development environment, establish safety protocols

### Week 2: Mathematical Foundations
- Linear algebra applications in robotics
- Transformations and coordinate systems
- Probability theory for uncertainty representation
- Control theory basics
- **Learning Objectives**: Apply mathematical concepts to robotics problems, understand coordinate transformations, model uncertainty

---

### Module 1: The Robotic Nervous System (Weeks 3-5)

#### Week 3: ROS 2 Fundamentals
- ROS 2 architecture and middleware
- Nodes, topics, services, and actions
- Publisher-subscriber patterns
- Parameter management and launch systems
- **Learning Objectives**: Create basic ROS 2 nodes, implement communication patterns, configure parameters

#### Week 4: URDF and Robot Modeling
- Unified Robot Description Format (URDF)
- Kinematic chains and joint definitions
- Visual and collision properties
- Robot state publisher and TF transforms
- **Learning Objectives**: Model robots using URDF, visualize robot models, manage coordinate transforms

#### Week 5: rclpy and Python Robotics
- Python ROS 2 client library (rclpy)
- Node implementation in Python
- Message handling and service calls
- Basic robot control with Python
- **Learning Objectives**: Implement ROS 2 nodes in Python, handle messages and services, control robots programmatically

---

### Module 2: The Digital Twin (Weeks 6-7)

#### Week 6: Gazebo Physics Simulation
- Gazebo simulation environment setup
- Physics engines (ODE, Bullet, DART)
- Sensor simulation and realistic modeling
- World creation and environment modeling
- **Learning Objectives**: Create realistic simulation environments, model physics accurately, simulate sensors

#### Week 7: Unity Rendering and Digital Twins
- Unity robotics simulation package
- High-fidelity rendering and visualization
- Digital twin methodology
- Sensor integration in Unity
- **Learning Objectives**: Create photorealistic simulation environments, integrate with ROS 2, develop digital twins

---

### Module 3: The AI-Robot Brain (Weeks 8-10)

#### Week 8: NVIDIA Isaac Sim and Perception
- Isaac Sim architecture and setup
- Synthetic data generation
- Computer vision in simulation
- Sensor fusion and calibration
- **Learning Objectives**: Use Isaac Sim for advanced simulation, generate synthetic data, implement perception systems

#### Week 9: Navigation and Path Planning
- Navigation2 (Nav2) framework
- SLAM (Simultaneous Localization and Mapping)
- Path planning algorithms (A*, RRT, Dijkstra)
- VSLAM (Visual SLAM) systems
- **Learning Objectives**: Implement navigation systems, perform SLAM, plan optimal paths

#### Week 10: Reinforcement Learning for Robotics
- Reinforcement learning fundamentals
- Deep Q-Networks (DQN) for robotics
- Policy gradient methods
- Simulation-to-reality transfer
- **Learning Objectives**: Train RL agents for robotics tasks, implement DQN, transfer policies to real robots

---

### Module 4: Vision-Language-Action (Weeks 11-13)

#### Week 11: Vision-Language Integration
- Vision-language models (VLMs)
- Object detection and recognition
- Scene understanding
- Cross-modal attention mechanisms
- **Learning Objectives**: Implement vision-language systems, perform object detection, understand scenes

#### Week 12: Natural Language and Cognitive Planning
- Whisper for audio processing
- LLM integration for planning
- Cognitive robotics architectures
- Human-robot interaction
- **Learning Objectives**: Integrate audio processing, implement LLM-based planning, design human-robot interaction

#### Week 13: Autonomous Humanoid Capstone
- Capstone project implementation
- Integration of all learned concepts
- Physical deployment on Unitree robots
- Final presentations and demonstrations
- **Learning Objectives**: Integrate all course concepts, deploy on real hardware, demonstrate autonomous behavior

import KnowledgeMap from '@site/src/components/ui/KnowledgeMap';

<div className="knowledge-map-section my-8">
  <KnowledgeMap height="500px" />
</div>

## Assessment Structure

### Weekly Assignments (40%)
- **Theory Assignments**: Mathematical problems and conceptual questions
- **Simulation Projects**: Implementation in Gazebo, Unity, or Isaac Sim
- **Code Reviews**: Peer evaluation of implementation quality
- **Documentation**: Technical writing and explanation of implementations

### Midterm Project (20%)
- **Project Scope**: Complete implementation of a perception or control system
- **Requirements**: Simulation validation and physical deployment
- **Deliverables**: Code, documentation, presentation, demonstration
- **Timeline**: Weeks 6-8

### Final Capstone Project (40%)
- **Team Size**: 2-3 students per team
- **Scope**: Autonomous humanoid robot system integrating all course concepts
- **Requirements**: Theory → Simulation → Physical deployment
- **Deliverables**: Complete system, documentation, presentation, live demonstration

## Learning Objectives

### Technical Skills
- Proficiency in ROS 2 development and architecture
- Simulation environment expertise (Gazebo, Unity, Isaac Sim)
- AI/ML implementation on edge platforms (Jetson Orin Nano)
- Computer vision and sensor fusion
- Navigation and path planning algorithms
- Reinforcement learning for robotics
- Vision-Language-Action system design

### Professional Skills
- System integration and testing
- Safety protocol implementation
- Technical documentation and communication
- Team collaboration on complex projects
- Problem-solving in uncertain environments
- Ethical considerations in AI deployment

### Theoretical Understanding
- Embodied intelligence principles
- Mathematical foundations of robotics
- Control theory applications
- Uncertainty quantification in physical systems
- Sim-to-real transfer methodologies
- Human-robot interaction principles

## Required Materials

### Hardware
- NVIDIA Jetson Orin Nano development kit
- Intel RealSense D435i depth camera
- Access to Unitree Go2/G1 quadruped robot (lab-based)
- RTX-enabled workstation for simulation development

### Software
- ROS 2 Humble Hawksbill
- Gazebo Garden or Ignition
- Unity 2022.x with Robotics package
- NVIDIA Isaac Sim
- Python 3.10+ with scientific computing libraries
- Git version control system

### Textbook Resources
- This Physical AI & Humanoid Robotics textbook
- ROS 2 documentation and tutorials
- NVIDIA developer documentation
- Research papers and case studies

## Safety Protocols

### Physical Safety
- All hardware operations must follow documented safety procedures
- Emergency stop procedures must be known and practiced
- Personal protective equipment may be required for certain activities
- Robot operation areas must be clear of unauthorized personnel

### Digital Safety
- Secure coding practices for networked systems
- Data privacy and security protocols
- Version control and backup procedures
- Cybersecurity for connected robotic systems

## Academic Integrity

Students are expected to complete all work with integrity. Collaboration is encouraged for learning, but individual assignments must represent individual work. All code must be properly attributed, and academic dishonesty will result in course failure.

## Accommodation Statement

Students with documented disabilities who may need academic accommodations should contact the instructor as soon as possible to ensure appropriate support is provided.

## Schedule Changes

The instructor reserves the right to modify the schedule as needed to ensure optimal learning outcomes. Students will be notified of any changes in advance.