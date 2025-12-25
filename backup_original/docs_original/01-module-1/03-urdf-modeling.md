---
title: "URDF Modeling: Creating Robot Descriptions for Humanoids"
slug: "/module-1/urdf-modeling"
sidebar_position: 4
---

# URDF Modeling: Creating Robot Descriptions for Humanoids

## Introduction to URDF

Unified Robot Description Format (URDF) is an XML-based format used to describe robots in ROS. It defines the physical and visual properties of a robot, including its links, joints, and other properties. URDF is fundamental to robotics simulation, visualization, and control, as it provides a standardized way to represent robot models for tasks like kinematic analysis, collision detection, and visualization.

For humanoid robots, URDF becomes particularly important as it must accurately represent the complex kinematic chains and multiple degrees of freedom that characterize these systems.

## Theory: URDF Fundamentals

### Core URDF Concepts

URDF describes robots as a collection of **links** connected by **joints**:

#### Links
- **Physical Components**: Represent rigid parts of the robot (e.g., base, arms, legs)
- **Visual Properties**: Define how the link appears in simulation and visualization
- **Collision Properties**: Define collision geometry for physics simulation
- **Inertial Properties**: Define mass, center of mass, and inertia tensor

#### Joints
- **Connectivity**: Define how links are connected to each other
- **Degrees of Freedom**: Specify the type of motion allowed between links
- **Limits**: Define position, velocity, and effort constraints
- **Dynamics**: Include friction and damping parameters

### URDF Element Hierarchy

```
<robot>
├── <link> (multiple)
│   ├── <visual>
│   │   ├── <geometry>
│   │   └── <material>
│   ├── <collision>
│   │   └── <geometry>
│   └── <inertial>
│       ├── <mass>
│       ├── <origin>
│       └── <inertia>
├── <joint> (multiple)
│   ├── <parent>
│   ├── <child>
│   ├── <origin>
│   ├── <axis>
│   ├── <limit>
│   └── <dynamics>
└── <gazebo> (optional for simulation)
```

### Joint Types in URDF

1. **Fixed**: No movement between parent and child
2. **Revolute**: Single degree of freedom rotation with limits
3. **Continuous**: Single degree of freedom rotation without limits
4. **Prismatic**: Single degree of freedom translation with limits
5. **Floating**: Six degrees of freedom with no limits
6. **Planar**: Three degrees of freedom in a plane

### Coordinate Systems and Conventions

URDF follows the right-hand rule for coordinate systems:
- **X**: Forward direction
- **Y**: Left direction
- **Z**: Up direction

All transformations are relative to the parent link's coordinate frame.

## Simulation: Creating Humanoid Robot Models

### Basic URDF Structure

Let's start with a simple humanoid model structure:

```xml
<!-- File: ~/ros2_ws/src/my_robot_description/urdf/humanoid_base.urdf -->
<?xml version="1.0"?>
<robot name="simple_humanoid" xmlns:xacro="http://www.ros.org/wiki/xacro">

  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.3 0.2 0.1"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.3 0.2 0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Head -->
  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
      <material name="white">
        <color rgba="1 1 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="0.002" ixy="0" ixz="0" iyy="0.002" iyz="0" izz="0.002"/>
    </inertial>
  </link>

  <joint name="neck_joint" type="revolute">
    <parent link="base_link"/>
    <child link="head"/>
    <origin xyz="0 0 0.25"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
  </joint>

  <!-- Left Arm -->
  <link name="left_upper_arm">
    <visual>
      <geometry>
        <cylinder length="0.3" radius="0.05"/>
      </geometry>
      <material name="gray">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.3" radius="0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <origin xyz="0 0 0.15"/>
      <inertia ixx="0.002" ixy="0" ixz="0" iyy="0.002" iyz="0" izz="0.0001"/>
    </inertial>
  </link>

  <joint name="left_shoulder_joint" type="revolute">
    <parent link="base_link"/>
    <child link="left_upper_arm"/>
    <origin xyz="0.1 0.15 0.1" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="50" velocity="2"/>
  </joint>

</robot>
```

### Advanced Humanoid Model with Xacro

For more complex humanoid robots, Xacro (XML Macros) provides parameterization and reusability:

```xml
<!-- File: ~/ros2_ws/src/my_robot_description/urdf/humanoid.xacro -->
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="advanced_humanoid">

  <!-- Include other xacro files -->
  <xacro:include filename="$(find my_robot_description)/urdf/materials.xacro"/>
  <xacro:include filename="$(find my_robot_description)/urdf/transmission.xacro"/>

  <!-- Define constants -->
  <xacro:property name="M_PI" value="3.1415926535897931"/>
  <xacro:property name="base_width" value="0.3"/>
  <xacro:property name="base_length" value="0.4"/>
  <xacro:property name="base_height" value="0.15"/>
  <xacro:property name="base_mass" value="10.0"/>

  <!-- Macro for creating limbs -->
  <xacro:macro name="limb" params="side parent_link position_yaw joint_limits_torso joint_limits_elbow">
    <!-- Upper limb -->
    <link name="${side}_upper_limb">
      <visual>
        <geometry>
          <cylinder length="0.4" radius="0.04"/>
        </geometry>
        <material name="light_gray">
          <color rgba="0.7 0.7 0.7 1"/>
        </material>
        <origin xyz="0 0 0.2" rpy="0 0 0"/>
      </visual>
      <collision>
        <geometry>
          <cylinder length="0.4" radius="0.04"/>
        </geometry>
        <origin xyz="0 0 0.2" rpy="0 0 0"/>
      </collision>
      <inertial>
        <mass value="1.0"/>
        <origin xyz="0 0 0.2"/>
        <inertia ixx="0.015" ixy="0" ixz="0" iyy="0.015" iyz="0" izz="0.0005"/>
      </inertial>
    </link>

    <joint name="${side}_shoulder_joint" type="revolute">
      <parent link="${parent_link}"/>
      <child link="${side}_upper_limb"/>
      <origin xyz="${0.1 if side == 'left' else -0.1} 0 ${base_height/2}" rpy="0 0 ${position_yaw}"/>
      <axis xyz="0 1 0"/>
      <limit lower="${joint_limits_torso[0]}" upper="${joint_limits_torso[1]}" effort="100" velocity="2"/>
      <dynamics damping="0.5" friction="0.1"/>
    </joint>

    <!-- Lower limb -->
    <link name="${side}_lower_limb">
      <visual>
        <geometry>
          <cylinder length="0.4" radius="0.035"/>
        </geometry>
        <material name="light_gray"/>
        <origin xyz="0 0 0.2" rpy="0 0 0"/>
      </visual>
      <collision>
        <geometry>
          <cylinder length="0.4" radius="0.035"/>
        </geometry>
        <origin xyz="0 0 0.2" rpy="0 0 0"/>
      </collision>
      <inertial>
        <mass value="0.8"/>
        <origin xyz="0 0 0.2"/>
        <inertia ixx="0.01" ixy="0" ixz="0" iyy="0.01" iyz="0" izz="0.0003"/>
      </inertial>
    </link>

    <joint name="${side}_elbow_joint" type="revolute">
      <parent link="${side}_upper_limb"/>
      <child link="${side}_lower_limb"/>
      <origin xyz="0 0 0.4" rpy="0 0 0"/>
      <axis xyz="0 1 0"/>
      <limit lower="${joint_limits_elbow[0]}" upper="${joint_limits_elbow[1]}" effort="50" velocity="2"/>
      <dynamics damping="0.3" friction="0.1"/>
    </joint>
  </xacro:macro>

  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="${base_length} ${base_width} ${base_height}"/>
      </geometry>
      <material name="dark_gray">
        <color rgba="0.3 0.3 0.3 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="${base_length} ${base_width} ${base_height}"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="${base_mass}"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="0.2" ixy="0" ixz="0" iyy="0.3" iyz="0" izz="0.4"/>
    </inertial>
  </link>

  <!-- Head -->
  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
      <material name="white">
        <color rgba="1 1 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2.0"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="0.008" ixy="0" ixz="0" iyy="0.008" iyz="0" izz="0.008"/>
    </inertial>
  </link>

  <joint name="neck_joint" type="revolute">
    <parent link="base_link"/>
    <child link="head"/>
    <origin xyz="0 0 ${base_height/2 + 0.15}"/>
    <axis xyz="0 0 1"/>
    <limit lower="-0.785" upper="0.785" effort="20" velocity="1"/>
  </joint>

  <!-- Create arms using the macro -->
  <xacro:limb side="left"
             parent_link="base_link"
             position_yaw="0"
             joint_limits_torso="[-1.57, 1.57]"
             joint_limits_elbow="[-2.35, 0]"/>

  <xacro:limb side="right"
             parent_link="base_link"
             position_yaw="0"
             joint_limits_torso="[-1.57, 1.57]"
             joint_limits_elbow="[0, 2.35]"/>

  <!-- Create legs using the macro -->
  <xacro:limb side="left_leg"
             parent_link="base_link"
             position_yaw="0"
             joint_limits_torso="[-0.785, 0.785]"
             joint_limits_elbow="[-2.35, 0]"/>

  <xacro:limb side="right_leg"
             parent_link="base_link"
             position_yaw="0"
             joint_limits_torso="[-0.785, 0.785]"
             joint_limits_elbow="[0, 2.35]"/>

  <!-- Sensors -->
  <link name="camera_link">
    <visual>
      <geometry>
        <box size="0.05 0.03 0.02"/>
      </geometry>
      <material name="black">
        <color rgba="0 0 0 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.05 0.03 0.02"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <origin xyz="0 0 0"/>
      <inertia ixx="0.0001" ixy="0" ixz="0" iyy="0.0001" iyz="0" izz="0.0001"/>
    </inertial>
  </link>

  <joint name="camera_joint" type="fixed">
    <parent link="head"/>
    <child link="camera_link"/>
    <origin xyz="0.05 0 0" rpy="0 0 0"/>
  </joint>

</robot>
```

### Materials and Transmissions

```xml
<!-- File: ~/ros2_ws/src/my_robot_description/urdf/materials.xacro -->
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro">

  <material name="black">
    <color rgba="0.0 0.0 0.0 1.0"/>
  </material>

  <material name="blue">
    <color rgba="0.0 0.0 0.8 1.0"/>
  </material>

  <material name="green">
    <color rgba="0.0 0.8 0.0 1.0"/>
  </material>

  <material name="grey">
    <color rgba="0.5 0.5 0.5 1.0"/>
  </material>

  <material name="orange">
    <color rgba="1.0 0.423529411765 0.0392156862745 1.0"/>
  </material>

  <material name="brown">
    <color rgba="0.870588235294 0.811764705882 0.764705882353 1.0"/>
  </material>

  <material name="red">
    <color rgba="0.8 0.0 0.0 1.0"/>
  </material>

  <material name="white">
    <color rgba="1.0 1.0 1.0 1.0"/>
  </material>

</robot>
```

```xml
<!-- File: ~/ros2_ws/src/my_robot_description/urdf/transmission.xacro -->
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro">

  <xacro:macro name="transmission_block" params="name">
    <transmission name="${name}_trans">
      <type>transmission_interface/SimpleTransmission</type>
      <joint name="${name}">
        <hardwareInterface>hardware_interface/EffortJointInterface</hardwareInterface>
      </joint>
      <actuator name="${name}_motor">
        <hardwareInterface>hardware_interface/EffortJointInterface</hardwareInterface>
        <mechanicalReduction>1</mechanicalReduction>
      </actuator>
    </transmission>
  </xacro:macro>

</robot>
```

### Gazebo Integration

```xml
<!-- File: ~/ros2_ws/src/my_robot_description/urdf/humanoid.gazebo.xacro -->
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro">

  <!-- Gazebo-specific properties -->
  <gazebo reference="base_link">
    <material>Gazebo/Black</material>
    <mu1>0.2</mu1>
    <mu2>0.2</mu2>
  </gazebo>

  <gazebo reference="head">
    <material>Gazebo/White</material>
  </gazebo>

  <!-- Camera sensor -->
  <gazebo reference="camera_link">
    <sensor type="camera" name="camera1">
      <update_rate>30.0</update_rate>
      <camera name="head_camera">
        <horizontal_fov>1.3962634</horizontal_fov>
        <image>
          <width>800</width>
          <height>600</height>
          <format>R8G8B8</format>
        </image>
        <clip>
          <near>0.02</near>
          <far>300</far>
        </clip>
      </camera>
      <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
        <frame_name>camera_link</frame_name>
      </plugin>
    </sensor>
  </gazebo>

  <!-- Physics properties -->
  <gazebo>
    <plugin name="gazebo_ros_control" filename="libgazebo_ros_control.so">
      <robotNamespace>/my_humanoid</robotNamespace>
    </plugin>
  </gazebo>

</robot>
```

### Launch File for Visualization

```xml
<!-- File: ~/ros2_ws/src/my_robot_description/launch/view_humanoid.launch.py -->
import launch
from launch.substitutions import Command, LaunchConfiguration
from launch.actions import DeclareLaunchArgument
from launch_ros.actions import Node
from launch.conditions import IfCondition
from ament_index_python.packages import get_package_share_directory
import os


def generate_launch_description():
    pkg_share = get_package_share_directory('my_robot_description')

    # Declare launch arguments
    model_path = LaunchConfiguration('model')
    model_arg = DeclareLaunchArgument(
        'model',
        default_value=os.path.join(pkg_share, 'urdf', 'humanoid.xacro'),
        description='Absolute path to robot urdf file'
    )

    # Robot state publisher node
    robot_state_publisher_node = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[
            {'robot_description': Command(['xacro ', model_path])}
        ]
    )

    # Joint state publisher GUI node
    joint_state_publisher_gui_node = Node(
        package='joint_state_publisher_gui',
        executable='joint_state_publisher_gui'
    )

    # RViz node
    rviz_node = Node(
        package='rviz2',
        executable='rviz2',
        name='rviz2',
        arguments=['-d', os.path.join(pkg_share, 'rviz', 'urdf.rviz')]
    )

    return launch.LaunchDescription([
        model_arg,
        joint_state_publisher_gui_node,
        robot_state_publisher_node,
        rviz_node
    ])
```

## Real: Physical Deployment Considerations

### Optimizing URDF for Jetson Orin Nano

When deploying URDF models to run on the Jetson Orin Nano, several optimizations are important:

```python
# File: ~/ros2_ws/src/my_robot_description/my_robot_description/urdf_optimizer.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from sensor_msgs.msg import JointState
import xml.etree.ElementTree as ET
import math


class URDFOptimizer(Node):
    def __init__(self):
        super().__init__('urdf_optimizer')

        # Subscription to joint states for real-time optimization
        self.joint_state_subscription = self.create_subscription(
            JointState,
            'joint_states',
            self.joint_state_callback,
            10
        )

        # Publisher for optimized robot state
        self.optimized_state_publisher = self.create_publisher(
            JointState,
            'optimized_joint_states',
            10
        )

        # Parameters for optimization
        self.optimization_frequency = 10  # Hz
        self.optimization_timer = self.create_timer(
            1.0 / self.optimization_frequency,
            self.optimize_callback
        )

        # Store joint limits and current states
        self.joint_limits = {}
        self.current_states = {}

        # Initialize with common humanoid joint limits
        self.initialize_joint_limits()

        self.get_logger().info('URDF Optimizer initialized')

    def initialize_joint_limits(self):
        """Initialize joint limits for humanoid robot"""
        # Example limits for a humanoid robot
        humanoid_joints = [
            'left_shoulder_joint', 'right_shoulder_joint',
            'left_elbow_joint', 'right_elbow_joint',
            'left_hip_joint', 'right_hip_joint',
            'left_knee_joint', 'right_knee_joint',
            'neck_joint'
        ]

        for joint in humanoid_joints:
            # Default limits - in a real system, these would come from URDF
            self.joint_limits[joint] = {
                'lower': -math.pi,
                'upper': math.pi,
                'max_velocity': 2.0,
                'max_effort': 100.0
            }

    def joint_state_callback(self, msg):
        """Process incoming joint states"""
        for i, name in enumerate(msg.name):
            if i < len(msg.position):
                self.current_states[name] = {
                    'position': msg.position[i],
                    'velocity': msg.velocity[i] if i < len(msg.velocity) else 0.0,
                    'effort': msg.effort[i] if i < len(msg.effort) else 0.0
                }

    def optimize_callback(self):
        """Optimize joint states for performance"""
        if not self.current_states:
            return

        # Create optimized joint state message
        optimized_msg = JointState()
        optimized_msg.header.stamp = self.get_clock().now().to_msg()
        optimized_msg.header.frame_id = 'optimized'

        # Apply optimizations to each joint
        for joint_name, state in self.current_states.items():
            # Check if joint is within limits
            if joint_name in self.joint_limits:
                limits = self.joint_limits[joint_name]

                # Apply soft limits with safety margin
                safety_margin = 0.1  # radians
                lower_safe = limits['lower'] + safety_margin
                upper_safe = limits['upper'] - safety_margin

                # Clamp position to safe limits
                safe_position = max(lower_safe, min(upper_safe, state['position']))

                # Add to optimized message
                optimized_msg.name.append(joint_name)
                optimized_msg.position.append(safe_position)
                optimized_msg.velocity.append(state['velocity'])
                optimized_msg.effort.append(state['effort'])

        # Publish optimized states
        self.optimized_state_publisher.publish(optimized_msg)

    def validate_urdf_model(self, urdf_path):
        """Validate URDF model for physical deployment"""
        try:
            # Parse URDF file
            tree = ET.parse(urdf_path)
            root = tree.getroot()

            # Check for common issues
            issues = []

            # Validate all links have required elements
            for link in root.findall('link'):
                link_name = link.get('name')

                # Check for visual and collision elements
                visual = link.find('visual')
                collision = link.find('collision')
                inertial = link.find('inertial')

                if visual is None:
                    issues.append(f"Link {link_name} missing visual element")
                if collision is None:
                    issues.append(f"Link {link_name} missing collision element")
                if inertial is None:
                    issues.append(f"Link {link_name} missing inertial element")

            # Validate joints
            for joint in root.findall('joint'):
                joint_name = joint.get('name')
                joint_type = joint.get('type')

                if joint_type not in ['revolute', 'continuous', 'prismatic', 'fixed']:
                    issues.append(f"Joint {joint_name} has invalid type: {joint_type}")

            # Report validation results
            if issues:
                for issue in issues:
                    self.get_logger().error(issue)
                return False
            else:
                self.get_logger().info(f"URDF validation passed for {urdf_path}")
                return True

        except ET.ParseError as e:
            self.get_logger().error(f"URDF parse error: {str(e)}")
            return False
        except Exception as e:
            self.get_logger().error(f"URDF validation error: {str(e)}")
            return False


def main(args=None):
    rclpy.init(args=args)
    optimizer = URDFOptimizer()

    # Validate URDF model
    urdf_path = "/path/to/robot/model.urdf"  # This would be the actual path
    # optimizer.validate_urdf_model(urdf_path)

    try:
        rclpy.spin(optimizer)
    except KeyboardInterrupt:
        pass
    finally:
        optimizer.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Hardware-Specific URDF Considerations

```python
# File: ~/ros2_ws/src/my_robot_description/my_robot_description/hardware_urdf.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState, Imu
from geometry_msgs.msg import Twist
from std_msgs.msg import Float32
import time
import threading
from collections import deque
import numpy as np


class HardwareURDFInterface(Node):
    def __init__(self):
        super().__init__('hardware_urdf_interface')

        # Publishers and subscribers
        self.joint_state_publisher = self.create_publisher(JointState, 'joint_states', 10)
        self.imu_subscription = self.create_subscription(Imu, 'imu/data', self.imu_callback, 10)
        self.cmd_vel_subscription = self.create_subscription(Twist, 'cmd_vel', self.cmd_vel_callback, 10)

        # Robot state tracking
        self.joint_positions = {}
        self.joint_velocities = {}
        self.joint_efforts = {}

        # Initialize with default positions
        self.initialize_robot_state()

        # Timer for publishing joint states
        self.state_publish_timer = self.create_timer(0.05, self.publish_joint_states)  # 20Hz

        # Threading for hardware interface
        self.hardware_thread = threading.Thread(target=self.hardware_interface_loop, daemon=True)
        self.hardware_thread.start()

        # Performance monitoring
        self.state_history = deque(maxlen=100)
        self.performance_timer = self.create_timer(1.0, self.performance_monitor)

        self.get_logger().info('Hardware URDF Interface initialized')

    def initialize_robot_state(self):
        """Initialize robot state with default values"""
        # Define joints for a humanoid robot
        humanoid_joints = [
            'left_hip_joint', 'left_knee_joint', 'left_ankle_joint',
            'right_hip_joint', 'right_knee_joint', 'right_ankle_joint',
            'left_shoulder_joint', 'left_elbow_joint',
            'right_shoulder_joint', 'right_elbow_joint',
            'neck_joint'
        ]

        for joint in humanoid_joints:
            self.joint_positions[joint] = 0.0
            self.joint_velocities[joint] = 0.0
            self.joint_efforts[joint] = 0.0

    def imu_callback(self, msg):
        """Process IMU data to update robot state"""
        # Use IMU data to estimate base orientation
        # This would be used in a real system to update the robot's pose
        pass

    def cmd_vel_callback(self, msg):
        """Process velocity commands and update joint targets"""
        # Convert differential drive commands to joint commands
        # This is a simplified example - real implementation would be more complex
        linear_vel = msg.linear.x
        angular_vel = msg.angular.z

        # Example: Update leg joints based on movement commands
        # In a real system, this would involve inverse kinematics
        self.joint_positions['left_hip_joint'] += linear_vel * 0.01
        self.joint_positions['right_hip_joint'] += linear_vel * 0.01

        # Apply angular velocity to turning joints
        self.joint_positions['left_ankle_joint'] += angular_vel * 0.005
        self.joint_positions['right_ankle_joint'] += angular_vel * 0.005

    def publish_joint_states(self):
        """Publish current joint states"""
        msg = JointState()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.header.frame_id = 'base_link'

        # Add all joint names and states
        for joint_name in self.joint_positions.keys():
            msg.name.append(joint_name)
            msg.position.append(self.joint_positions[joint_name])
            msg.velocity.append(self.joint_velocities[joint_name])
            msg.effort.append(self.joint_efforts[joint_name])

        self.joint_state_publisher.publish(msg)

        # Store for performance monitoring
        self.state_history.append({
            'timestamp': time.time(),
            'num_joints': len(msg.name),
            'publish_rate': 1.0 / 0.05  # Expected rate
        })

    def hardware_interface_loop(self):
        """Interface with real hardware (simulated here)"""
        while rclpy.ok():
            try:
                # Simulate reading from actual hardware
                # In a real system, this would interface with motor controllers
                self.read_hardware_state()

                # Simulate sending commands to hardware
                self.write_hardware_commands()

                # Sleep to match control loop frequency
                time.sleep(0.01)  # 100Hz control loop

            except Exception as e:
                self.get_logger().error(f'Error in hardware interface: {str(e)}')

    def read_hardware_state(self):
        """Read current state from hardware"""
        # Simulate reading joint positions from encoders
        # In a real system, this would communicate with actual hardware
        for joint_name in self.joint_positions.keys():
            # Add small amount of noise to simulate real sensors
            noise = np.random.normal(0, 0.001)
            self.joint_positions[joint_name] += np.random.uniform(-0.01, 0.01) + noise
            self.joint_velocities[joint_name] = np.random.uniform(-0.1, 0.1)
            self.joint_efforts[joint_name] = np.random.uniform(-5, 5)

    def write_hardware_commands(self):
        """Send commands to hardware"""
        # In a real system, this would send commands to motor controllers
        # For simulation, we just log the commands
        pass

    def performance_monitor(self):
        """Monitor performance of URDF interface"""
        if self.state_history:
            avg_publish_rate = sum(s['publish_rate'] for s in self.state_history) / len(self.state_history)
            avg_num_joints = sum(s['num_joints'] for s in self.state_history) / len(self.state_history)

            self.get_logger().info(
                f'Performance: {avg_publish_rate:.1f}Hz, {avg_num_joints:.0f} joints, '
                f'{len(self.state_history)} samples'
            )

            # Check for performance issues
            if avg_publish_rate < 15:  # Below desired rate
                self.get_logger().warn('Joint state publishing rate below desired threshold')

    def destroy_node(self):
        """Clean up hardware connections"""
        # In a real system, this would cleanly disconnect from hardware
        super().destroy_node()


def main(args=None):
    rclpy.init(args=args)
    hardware_interface = HardwareURDFInterface()

    try:
        rclpy.spin(hardware_interface)
    except KeyboardInterrupt:
        pass
    finally:
        hardware_interface.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### URDF Validation and Quality Assurance

```python
# File: ~/ros2_ws/src/my_robot_description/my_robot_description/urdf_validator.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import xml.etree.ElementTree as ET
import numpy as np
from scipy.spatial.transform import Rotation as R
import math


class URDFValidator(Node):
    def __init__(self):
        super().__init__('urdf_validator')

        # Publisher for validation results
        self.validation_publisher = self.create_publisher(String, 'urdf_validation', 10)

        # Validation parameters
        self.urdf_path = ""  # This would be set to actual URDF path
        self.validation_results = []

        self.get_logger().info('URDF Validator initialized')

    def validate_kinematic_chain(self, urdf_path):
        """Validate the kinematic chain of the URDF"""
        try:
            tree = ET.parse(urdf_path)
            root = tree.getroot()

            # Find all joints and links
            joints = root.findall('joint')
            links = root.findall('link')

            # Build kinematic tree
            parent_child_map = {}
            joint_info = {}

            for joint in joints:
                parent = joint.find('parent').get('link')
                child = joint.find('child').get('link')
                joint_type = joint.get('type')

                parent_child_map[parent] = parent_child_map.get(parent, []) + [child]
                joint_info[joint.get('name')] = {
                    'parent': parent,
                    'child': child,
                    'type': joint_type
                }

            # Check for common kinematic issues
            validation_results = []

            # Check for floating base (no connection to world)
            if 'base_link' not in [link.get('name') for link in links]:
                validation_results.append("ERROR: No base_link found")
            else:
                validation_results.append("OK: base_link found")

            # Check for disconnected links
            all_children = set()
            all_parents = set()

            for joint in joints:
                parent = joint.find('parent').get('link')
                child = joint.find('child').get('link')
                all_parents.add(parent)
                all_children.add(child)

            # Links that are neither parents nor children (disconnected)
            link_names = {link.get('name') for link in links}
            disconnected = link_names - all_parents - all_children
            if disconnected:
                validation_results.append(f"WARNING: Disconnected links: {disconnected}")
            else:
                validation_results.append("OK: All links connected")

            # Check for loops in kinematic chain
            if self.has_kinematic_loop(parent_child_map):
                validation_results.append("ERROR: Kinematic loop detected")
            else:
                validation_results.append("OK: No kinematic loops")

            return validation_results

        except Exception as e:
            return [f"ERROR: Failed to parse URDF - {str(e)}"]

    def has_kinematic_loop(self, parent_child_map):
        """Check if the kinematic chain has loops"""
        visited = set()
        rec_stack = set()

        def dfs(node):
            visited.add(node)
            rec_stack.add(node)

            children = parent_child_map.get(node, [])
            for child in children:
                if child not in visited:
                    if dfs(child):
                        return True
                elif child in rec_stack:
                    return True

            rec_stack.remove(node)
            return False

        for node in parent_child_map:
            if node not in visited:
                if dfs(node):
                    return True
        return False

    def validate_inertial_properties(self, urdf_path):
        """Validate inertial properties of URDF"""
        try:
            tree = ET.parse(urdf_path)
            root = tree.getroot()

            validation_results = []

            for link in root.findall('link'):
                inertial = link.find('inertial')
                if inertial is not None:
                    mass_elem = inertial.find('mass')
                    if mass_elem is not None:
                        mass = float(mass_elem.get('value'))
                        if mass <= 0:
                            validation_results.append(f"ERROR: Link {link.get('name')} has non-positive mass: {mass}")
                        elif mass > 1000:  # Unusually high mass
                            validation_results.append(f"WARNING: Link {link.get('name')} has high mass: {mass}")
                    else:
                        validation_results.append(f"WARNING: Link {link.get('name')} missing mass")

                    # Check inertia matrix for physical validity
                    inertia_elem = inertial.find('inertia')
                    if inertia_elem is not None:
                        ixx = float(inertia_elem.get('ixx'))
                        iyy = float(inertia_elem.get('iyy'))
                        izz = float(inertia_elem.get('izz'))

                        # Check if diagonal elements are positive
                        if ixx <= 0 or iyy <= 0 or izz <= 0:
                            validation_results.append(f"ERROR: Link {link.get('name')} has non-positive inertia diagonal")

                        # Check triangle inequality for inertia (for physical validity)
                        if not (ixx + iyy >= izz and iyy + izz >= ixx and izz + ixx >= iyy):
                            validation_results.append(f"WARNING: Link {link.get('name')} fails triangle inequality for inertia")

            return validation_results

        except Exception as e:
            return [f"ERROR: Failed to validate inertial properties - {str(e)}"]

    def run_complete_validation(self, urdf_path):
        """Run complete URDF validation"""
        self.get_logger().info(f'Validating URDF: {urdf_path}')

        # Run all validation checks
        kinematic_results = self.validate_kinematic_chain(urdf_path)
        inertial_results = self.validate_inertial_properties(urdf_path)

        # Combine results
        all_results = kinematic_results + inertial_results

        # Count errors and warnings
        errors = [r for r in all_results if r.startswith('ERROR')]
        warnings = [r for r in all_results if r.startswith('WARNING')]
        oks = [r for r in all_results if r.startswith('OK')]

        # Publish results
        result_msg = String()
        result_msg.data = f"URDF Validation Results:\n"
        result_msg.data += f"Errors: {len(errors)}\n"
        result_msg.data += f"Warnings: {len(warnings)}\n"
        result_msg.data += f"OK: {len(oks)}\n\n"
        result_msg.data += "\n".join(all_results)

        self.validation_publisher.publish(result_msg)

        # Log summary
        if errors:
            self.get_logger().error(f'URDF validation found {len(errors)} errors')
        if warnings:
            self.get_logger().warn(f'URDF validation found {len(warnings)} warnings')
        if not errors and not warnings:
            self.get_logger().info('URDF validation passed')

        return all_results


def main(args=None):
    rclpy.init(args=args)
    validator = URDFValidator()

    # Example URDF path - in practice this would come from parameters
    urdf_path = "/path/to/humanoid.urdf"
    results = validator.run_complete_validation(urdf_path)

    # Print results
    for result in results:
        print(result)

    validator.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Exercises and Practical Applications

### Exercise 1: Basic URDF Creation
Create a simple URDF model of a humanoid robot with at least 10 links and 9 joints, including proper visual, collision, and inertial properties.

### Exercise 2: Xacro Parameterization
Convert your basic URDF to Xacro format, adding parameters for link dimensions and masses to make it reusable for different robot sizes.

### Exercise 3: Gazebo Integration
Add Gazebo-specific tags to your URDF to enable physics simulation, including sensors and controllers.

### Exercise 4: Validation and Optimization
Implement validation checks for your URDF model and optimize it for performance on the Jetson Orin Nano platform.

## Troubleshooting Common Issues

### URDF Parsing Errors
- **Check XML Syntax**: Ensure proper XML formatting and matching tags
- **Validate Links and Joints**: Verify all parent/child relationships exist
- **Check File Paths**: Ensure referenced mesh files exist and paths are correct

### Kinematic Issues
- **Missing base_link**: Ensure one link serves as the root of the kinematic tree
- **Disconnected Links**: Verify all links are connected through joints
- **Kinematic Loops**: Avoid creating closed loops in the kinematic chain

### Simulation Issues
- **Inertia Problems**: Ensure inertia matrices follow physical laws
- **Mass Issues**: Verify all links have positive mass values
- **Joint Limits**: Check that joint limits are reasonable for your robot

## Summary

This chapter has covered the essential concepts of URDF modeling for humanoid robots, from basic XML structure to advanced Xacro macros and simulation integration. The Theory → Simulation → Real approach ensures that models are first understood conceptually, then implemented and tested in simulation, and finally optimized for physical deployment on platforms like the Jetson Orin Nano.

Proper URDF modeling is crucial for successful robotics applications, as it provides the foundation for simulation, visualization, control, and safety systems. The modular approach using Xacro allows for reusable and maintainable robot descriptions that can be adapted for different robot configurations.

:::tip
Always validate your URDF models before using them in simulation or on physical hardware. Use tools like `check_urdf` to catch common errors early in the development process.
:::

:::caution
When creating URDF models for physical robots, ensure that all physical properties (mass, inertia, joint limits) accurately reflect the real hardware to ensure safe and realistic simulation.
:::

