---
sidebar_position: 0
slug: /
---

# Module 3: The AI-Robot Brain

## Learning Objectives

By the end of this module, students will be able to:

- Understand the NVIDIA Isaac ecosystem for AI-powered robotics applications
- Implement Visual SLAM (Simultaneous Localization and Mapping) algorithms using Intel RealSense cameras
- Configure and deploy Navigation2 systems for autonomous robot navigation
- Apply reinforcement learning techniques for robot control and decision-making
- Train AI models in digital twin environments and transfer them to physical robots
- Deploy AI systems on the NVIDIA Jetson Orin Nano edge computing platform

## Module Structure

This module follows the **Theory → Sim → Real** pedagogical flow:

import KnowledgeMap from '@site/src/components/ui/KnowledgeMap';

<div className="knowledge-map-section my-8">
  <KnowledgeMap height="500px" />
</div>

1. **Theory**: Foundational concepts of AI-powered robotics, Isaac ecosystem, and autonomous navigation
2. **Sim**: Implementation and testing in NVIDIA Isaac Sim with synthetic data generation
3. **Real**: Deployment on NVIDIA Jetson Orin Nano with Intel RealSense and Unitree robots

## Prerequisites

Before starting this module, students should have:

- Completed Module 1 (ROS 2 fundamentals) and Module 2 (Digital Twin concepts)
- Basic understanding of computer vision and machine learning concepts
- Familiarity with Python programming for robotics applications
- Access to a high-performance workstation with RTX 4070 Ti or equivalent for Isaac Sim

## Target Hardware

This module focuses on:

- **Simulation Platform**: NVIDIA Isaac Sim (requires RTX 4070 Ti or equivalent)
- **Edge Computing**: NVIDIA Jetson Orin Nano
- **Sensors**: Intel RealSense depth cameras
- **Robots**: Unitree Go2/G1 quadruped robots

## Duration

This module spans **Weeks 8-10** of the 13-week curriculum, with approximately 10-12 hours of study per week.

## Key Concepts

- NVIDIA Isaac Sim for photorealistic simulation and synthetic data generation
- Isaac ROS for hardware-accelerated perception and navigation
- Visual SLAM algorithms for environment mapping and robot localization
- Navigation2 framework for path planning and obstacle avoidance
- Reinforcement learning for adaptive robot behavior
- Digital twin training and sim-to-real transfer techniques