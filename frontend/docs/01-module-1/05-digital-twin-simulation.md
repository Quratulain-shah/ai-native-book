---
title: "Digital Twin Simulation"
slug: "/module-1/digital-twin-simulation"
sidebar_position: 6
---

# Digital Twin Simulation

## Introduction to Digital Twins in Robotics

A digital twin is a virtual representation of a physical system that mirrors the real-world object in real-time. In robotics, digital twins enable:

- **Virtual testing** of algorithms before physical deployment
- **System optimization** through simulation
- **Predictive maintenance** and failure analysis
- **Training environments** for AI systems

## Gazebo Simulation Environment

### Setting Up Gazebo with ROS 2

Gazebo is a 3D simulation environment that provides realistic physics, high-quality graphics, and convenient programmatic interfaces.

#### Installation

```bash
# Install Gazebo Garden (or compatible version)
sudo apt install ros-humble-gazebo-ros-pkgs
sudo apt install gazebo
```

### Creating a Simulation World

Create a world file `my_world.sdf`:

```xml
<?xml version="1.0" ?>
<sdf version="1.7">
  <world name="default">
    <!-- Include a model from Gazebo's model database -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Custom environment -->
    <model name="table">
      <pose>2 0 0.5 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </visual>
        <inertial>
          <mass>10</mass>
          <inertia>
            <ixx>1</ixx>
            <ixy>0</ixy>
            <ixz>0</ixz>
            <iyy>1</iyy>
            <iyz>0</iyz>
            <izz>1</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <!-- Physics engine configuration -->
    <physics name="1ms" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1</real_time_factor>
      <real_time_update_rate>1000</real_time_update_rate>
    </physics>
  </world>
</sdf>
```

## Integrating ROS 2 with Gazebo

### Launching Simulation with ROS 2 Bridge

Create a launch file `simulation.launch.py`:

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import PathJoinSubstitution, TextSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    # World file argument
    world_arg = DeclareLaunchArgument(
        'world',
        default_value='my_world.sdf',
        description='Choose one of the world files from `/your_package/worlds`'
    )

    # Launch Gazebo
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            PathJoinSubstitution([
                FindPackageShare('gazebo_ros'),
                'launch',
                'gazebo.launch.py'
            ])
        ]),
        launch_arguments={
            'world': PathJoinSubstitution([
                FindPackageShare('your_package'),
                'worlds',
                'my_world.sdf'
            ])
        }.items()
    )

    return LaunchDescription([
        world_arg,
        gazebo,
    ])
```

### Robot Spawn Script

Create a script to spawn your robot in Gazebo:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from gazebo_msgs.srv import SpawnEntity
import sys
import os

class RobotSpawner(Node):
    def __init__(self):
        super().__init__('robot_spawner')
        self.cli = self.create_client(SpawnEntity, '/spawn_entity')

        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service /spawn_entity not available, waiting again...')

    def spawn_robot(self, robot_name, robot_xml, x=0.0, y=0.0, z=0.0):
        request = SpawnEntity.Request()
        request.name = robot_name
        request.xml = robot_xml
        request.initial_pose.position.x = x
        request.initial_pose.position.y = y
        request.initial_pose.position.z = z

        future = self.cli.call_async(request)
        rclpy.spin_until_future_complete(self, future)

        if future.result() is not None:
            self.get_logger().info(f'Robot {robot_name} spawned successfully')
        else:
            self.get_logger().error(f'Failed to spawn robot {robot_name}')

def main():
    rclpy.init()

    # Read robot URDF
    if len(sys.argv) < 2:
        print("Usage: python3 spawn_robot.py <robot_urdf_file>")
        return

    urdf_path = sys.argv[1]
    with open(urdf_path, 'r') as file:
        robot_xml = file.read()

    spawner = RobotSpawner()
    spawner.spawn_robot('my_robot', robot_xml)

    rclpy.spin(spawner)
    spawner.destroy_node()
    rclpy.shutdown()
```

## Advanced Simulation Techniques

### Sensor Simulation

Gazebo can simulate various sensors. Here's an example of a depth camera simulation:

```xml
<sdf version="1.7">
  <model name="robot_with_camera">
    <!-- Robot body -->
    <link name="base_link">
      <pose>0 0 0.1 0 0 0</pose>
      <collision name="collision">
        <geometry>
          <box>
            <size>0.5 0.3 0.2</size>
          </box>
        </geometry>
      </collision>
      <visual name="visual">
        <geometry>
          <box>
            <size>0.5 0.3 0.2</size>
          </box>
        </geometry>
      </visual>
      <inertial>
        <mass>1</mass>
        <inertia>
          <ixx>0.1</ixx>
          <ixy>0</ixy>
          <ixz>0</ixz>
          <iyy>0.1</iyy>
          <iyz>0</iyz>
          <izz>0.1</izz>
        </inertia>
      </inertial>
    </link>

    <!-- Depth camera sensor -->
    <link name="camera_link">
      <pose>0.2 0 0.1 0 0 0</pose>
      <sensor name="depth_camera" type="depth">
        <camera name="head">
          <horizontal_fov>1.047</horizontal_fov>
          <image>
            <width>640</width>
            <height>480</height>
            <format>R8G8B8</format>
          </image>
          <clip>
            <near>0.1</near>
            <far>10</far>
          </clip>
        </camera>
        <always_on>1</always_on>
        <update_rate>30</update_rate>
        <visualize>true</visualize>
      </sensor>
    </link>

    <!-- Joint connecting camera to robot -->
    <joint name="camera_joint" type="fixed">
      <parent>base_link</parent>
      <child>camera_link</child>
    </joint>

    <!-- Gazebo ROS plugin for the camera -->
    <gazebo reference="camera_link">
      <sensor name="depth_camera" type="depth">
        <always_on>true</always_on>
        <update_rate>30</update_rate>
        <camera name="head">
          <horizontal_fov>1.047</horizontal_fov>
          <image>
            <width>640</width>
            <height>480</height>
            <format>R8G8B8</format>
          </image>
          <clip>
            <near>0.1</near>
            <far>10</far>
          </clip>
        </camera>
        <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
          <frame_name>camera_link</frame_name>
          <min_depth>0.1</min_depth>
          <max_depth>10.0</max_depth>
          <topic_name>camera/depth/image_raw</topic_name>
        </plugin>
      </sensor>
    </gazebo>
  </model>
</sdf>
```

### Physics Configuration

Fine-tune physics parameters for accurate simulation:

```xml
<physics name="accurate_physics" type="ode">
  <!-- Time step -->
  <max_step_size>0.001</max_step_size>

  <!-- Real-time update rate -->
  <real_time_update_rate>1000</real_time_update_rate>

  <!-- Real-time factor (1.0 = real-time, >1.0 = faster than real-time) -->
  <real_time_factor>1.0</real_time_factor>

  <!-- Solver settings -->
  <ode>
    <solver>
      <type>quick</type>
      <iters>10</iters>
      <sor>1.3</sor>
    </solver>
    <constraints>
      <cfm>0.0</cfm>
      <erp>0.2</erp>
      <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
      <contact_surface_layer>0.001</contact_surface_layer>
    </constraints>
  </ode>
</physics>
```

## Simulation Control and Monitoring

### Teleoperation Node

Create a node to control the simulated robot:

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import sys
import select
import termios
import tty

class TeleopNode(Node):
    def __init__(self):
        super().__init__('teleop_node')
        self.publisher = self.create_publisher(Twist, 'cmd_vel', 10)

        # Robot parameters
        self.linear_speed = 0.5
        self.angular_speed = 1.0

        self.get_logger().info('Teleoperation node started')
        self.get_logger().info('Use WASD keys to control the robot:')
        self.get_logger().info('W - Forward')
        self.get_logger().info('S - Backward')
        self.get_logger().info('A - Rotate Left')
        self.get_logger().info('D - Rotate Right')
        self.get_logger().info('Q - Stop')

    def run(self):
        rate = self.create_rate(10)  # 10 Hz

        while rclpy.ok():
            key = self.getKey()

            twist = Twist()

            if key == 'w':
                twist.linear.x = self.linear_speed
                twist.angular.z = 0.0
            elif key == 's':
                twist.linear.x = -self.linear_speed
                twist.angular.z = 0.0
            elif key == 'a':
                twist.linear.x = 0.0
                twist.angular.z = self.angular_speed
            elif key == 'd':
                twist.linear.x = 0.0
                twist.angular.z = -self.angular_speed
            elif key == 'q':
                twist.linear.x = 0.0
                twist.angular.z = 0.0
            else:
                continue  # Skip publishing if no valid key pressed

            self.publisher.publish(twist)
            self.get_logger().info(f'Published: linear={twist.linear.x}, angular={twist.angular.z}')

            rate.sleep()

    def getKey(self):
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setcbreak(sys.stdin.fileno())
            if select.select([sys.stdin], [], [], 0.1)[0]:
                key = sys.stdin.read(1)
            else:
                key = ''
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return key

def main():
    rclpy.init()
    node = TeleopNode()

    try:
        node.run()
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

### Simulation Monitoring

Monitor simulation performance and robot state:

```python
import rclpy
from rclpy.node import Node
from gazebo_msgs.msg import LinkStates
from std_msgs.msg import Float32
import time

class SimulationMonitor(Node):
    def __init__(self):
        super().__init__('simulation_monitor')

        # Subscribe to Gazebo link states
        self.link_states_sub = self.create_subscription(
            LinkStates,
            '/gazebo/link_states',
            self.link_states_callback,
            10
        )

        # Publish performance metrics
        self.fps_pub = self.create_publisher(Float32, 'simulation_fps', 10)
        self.timing_pub = self.create_publisher(Float32, 'simulation_timing', 10)

        self.last_time = time.time()
        self.frame_count = 0

    def link_states_callback(self, msg):
        current_time = time.time()
        self.frame_count += 1

        # Calculate FPS every second
        if current_time - self.last_time >= 1.0:
            fps = self.frame_count / (current_time - self.last_time)

            fps_msg = Float32()
            fps_msg.data = fps
            self.fps_pub.publish(fps_msg)

            self.get_logger().info(f'Simulation FPS: {fps:.2f}')

            self.frame_count = 0
            self.last_time = current_time

def main():
    rclpy.init()
    monitor = SimulationMonitor()

    try:
        rclpy.spin(monitor)
    except KeyboardInterrupt:
        pass
    finally:
        monitor.destroy_node()
        rclpy.shutdown()
```

## Practical Exercise: Complete Simulation Setup

Create a complete simulation package with all necessary components:

### 1. Create the package structure

```
simulation_package/
├── CMakeLists.txt
├── package.xml
├── launch/
│   └── simulation.launch.py
├── worlds/
│   └── my_world.sdf
├── models/
│   └── my_robot/
│       ├── model.sdf
│       └── meshes/
│           └── (robot meshes)
├── config/
│   └── robot_control.yaml
└── scripts/
    ├── spawn_robot.py
    └── teleop.py
```

### 2. Launch file with complete simulation

```python
# launch/simulation.launch.py
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription, DeclareLaunchArgument
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import PathJoinSubstitution, LaunchConfiguration
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    # Launch arguments
    world_arg = DeclareLaunchArgument(
        'world',
        default_value='my_world.sdf',
        description='World file to load'
    )

    # Gazebo launch
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            PathJoinSubstitution([
                FindPackageShare('gazebo_ros'),
                'launch',
                'gazebo.launch.py'
            ])
        ]),
        launch_arguments={
            'world': LaunchConfiguration('world'),
            'verbose': 'true'
        }.items()
    )

    # Robot spawn node
    spawn_robot = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-entity', 'my_robot',
            '-file', PathJoinSubstitution([
                FindPackageShare('simulation_package'),
                'models',
                'my_robot',
                'model.sdf'
            ])
        ],
        output='screen'
    )

    # Robot controller node
    robot_controller = Node(
        package='simulation_package',
        executable='robot_controller',
        name='robot_controller',
        output='screen'
    )

    return LaunchDescription([
        world_arg,
        gazebo,
        spawn_robot,
        robot_controller,
    ])
```

## Performance Optimization

### Simulation Optimization Tips

1. **Reduce Update Rates**: Lower sensor update rates where possible
2. **Simplify Models**: Use simpler collision models than visual models
3. **Adjust Physics**: Tune physics parameters for your specific use case
4. **Limit Visuals**: Disable unnecessary visual elements in headless mode

```python
# Example: Performance optimization parameters
class SimulationOptimizer(Node):
    def __init__(self):
        super().__init__('simulation_optimizer')

        # Parameters for optimization
        self.declare_parameter('sensor_update_rate', 10.0)  # Hz
        self.declare_parameter('physics_accuracy', 'fast')  # 'accurate' or 'fast'
        self.declare_parameter('visual_effects', False)
```

## Testing and Validation

### Unit Testing for Simulation

```python
import unittest
import rclpy
from rclpy.executors import SingleThreadedExecutor
from geometry_msgs.msg import Twist

class TestSimulation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        rclpy.init()

    @classmethod
    def tearDownClass(cls):
        rclpy.shutdown()

    def setUp(self):
        self.node = rclpy.create_node('test_simulation_node')
        self.publisher = self.node.create_publisher(Twist, 'cmd_vel', 10)
        self.executor = SingleThreadedExecutor()
        self.executor.add_node(self.node)

    def test_cmd_vel_publish(self):
        msg = Twist()
        msg.linear.x = 1.0
        msg.angular.z = 0.5

        self.publisher.publish(msg)

        # Test passes if no exceptions are raised
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main()
```

## Summary

This section covered digital twin simulation using Gazebo and ROS 2 integration. You learned how to create simulation environments, integrate ROS 2 with Gazebo, implement sensor simulation, control robots in simulation, and optimize performance. Digital twin simulation is a crucial component of the Physical AI curriculum, allowing you to test and validate algorithms before physical deployment. The skills learned here will be applied throughout the course as you develop increasingly complex robotic systems.