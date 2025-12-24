---
title: UI Component Showcase
---

# Robotics Textbook UI Showcase

This page demonstrates all the glassmorphic UI components implemented for the robotics textbook.

## Book Reader Component

import BookReader from '@site/src/components/ui/BookReader';

<BookReader currentPage={1} totalPages={5} onPageChange={() => {}}>
  <h1>Sample Chapter Content</h1>
  <p>This is sample content that would appear in the book reader component. The glassmorphism effect creates a modern, immersive reading experience.</p>

  <h2>Section Title</h2>
  <p>Additional content with interactive features like text highlighting and page navigation.</p>
</BookReader>

## Table of Contents

import TableOfContents from '@site/src/components/ui/TableOfContents';

{(() => {
  const chapters = [
    {
      title: "Introduction to Physical AI",
      sections: [
        { title: "What is Physical AI?" },
        { title: "Historical Context" },
        { title: "Key Concepts" }
      ]
    },
    {
      title: "Humanoid Robotics Fundamentals",
      sections: [
        { title: "Design Principles" },
        { title: "Kinematics" },
        { title: "Dynamics" }
      ]
    }
  ];
  return <TableOfContents chapters={chapters} currentChapter={0} onChapterSelect={() => {}} />;
})()}

## Robotics Diagram

import RoboticsDiagram from '@site/src/components/ui/RoboticsDiagram';

<RoboticsDiagram
  title="Humanoid Robot Anatomy"
  description="Interactive diagram showing the major components of a humanoid robot."
  diagramType="humanoid"
  interactive={true}
/>

## Code Example

import CodeExample from '@site/src/components/ui/CodeExample';

<CodeExample
  title="Robot Control Code"
  description="Example of controlling a robot's movement"
  language="python"
  code={`import robotics

# Initialize robot
robot = robotics.Robot("humanoid")

# Move to position
robot.move_to(x=1.0, y=2.0, z=0.5)

# Execute action
robot.gripper.close()`}
/>

## Exercise Box

import ExerciseBox from '@site/src/components/ui/ExerciseBox';

<ExerciseBox
  title="Kinematics Exercise"
  difficulty="medium"
  points={20}
  hints={[
    "Consider joint angles",
    "Think about transformation matrices"
  ]}
  solution="Forward kinematics can be calculated using DH parameters."
>
  <p>Calculate the forward kinematics for a 3-DOF robotic arm given the joint angles.</p>
</ExerciseBox>

## Hardware Specifications

import HardwareSpecs from '@site/src/components/ui/HardwareSpecs';

<HardwareSpecs
  title="Robot Hardware Specifications"
  specs={[
    {name: "Processor", value: "ARM Cortex-A78", unit: "MHz", detail: "High-performance processor for real-time control"},
    {name: "Memory", value: "8", unit: "GB", detail: "LPDDR5 RAM for fast data processing"},
    {name: "Sensors", value: "IMU, LIDAR, Cameras", detail: "Multiple sensors for environmental perception"}
  ]}
  comparison={{
    models: [
      {name: "Model A", values: {processor: "4-core", memory: "4GB", sensors: "basic"}},
      {name: "Model B", values: {processor: "8-core", memory: "8GB", sensors: "advanced"}},
      {name: "Model C", values: {processor: "16-core", memory: "16GB", sensors: "premium"}}
    ],
    specs: [
      {name: "Processor", key: "processor"},
      {name: "Memory", key: "memory"},
      {name: "Sensors", key: "sensors"}
    ]
  }}
/>

## 3D Visualization

import Advanced3DVisualization from '@site/src/components/ui/Advanced3DVisualization';

<Advanced3DVisualization
  title="Kinematics Visualization"
  visualizationType="kinematics"
  autoRotate={true}
/>
