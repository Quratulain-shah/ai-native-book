---
title: "Gazebo Physics Simulation"
slug: "/module-2/gazebo-physics"
sidebar_position: 2
---

# Gazebo Physics Simulation

## Learning Objectives

By the end of this chapter, students will be able to:
- Understand the fundamental physics concepts implemented in Gazebo simulation
- Configure realistic gravity, collision, and rigid body dynamics parameters
- Create and validate physics environments that accurately reflect real-world behavior
- Implement physics-based robot models with proper mass, friction, and damping properties
- Integrate physics simulation with ROS 2 for safe-to-fail development

## Theory Section

### Physics Simulation Fundamentals

Physics simulation in robotics is critical for creating safe-to-fail environments where algorithms can be tested without risk to expensive hardware. Gazebo provides a sophisticated physics engine that simulates real-world forces, collisions, and dynamic behaviors.

#### Core Physics Concepts

**Gravity Simulation**: Gazebo implements realistic gravitational forces that affect all objects in the simulation environment. The gravitational constant can be adjusted to simulate different environments (Earth, Moon, etc.) and is applied consistently to all objects based on their mass properties.

**Collision Detection**: The simulation engine implements both broad-phase and narrow-phase collision detection to efficiently identify when objects come into contact. This includes:
- **Geometric collision detection** using bounding volumes (AABB, OBB)
- **Primitive collision shapes** (spheres, boxes, cylinders, meshes)
- **Contact point calculation** for realistic interaction responses

**Rigid Body Dynamics**: Objects in Gazebo are modeled as rigid bodies with specific properties:
- **Mass**: Determines how objects respond to forces
- **Inertia**: Affects rotational behavior and stability
- **Center of mass**: Critical for balance and stability calculations
- **Friction coefficients**: Determine surface interaction properties
- **Damping**: Simulates energy loss through air resistance and internal friction

#### Physics Engine Options

Gazebo supports multiple physics engines, each with different performance and accuracy characteristics:

**ODE (Open Dynamics Engine)**: The original physics engine for Gazebo, offering stable simulation for most robotics applications. It provides good performance and is well-tested across many robotics platforms.

**Bullet Physics**: Offers more advanced features including soft body simulation and improved collision detection. It's particularly useful for complex multi-body systems.

**DART (Dynamic Animation and Robotics Toolkit)**: Provides advanced articulated body simulation and constraint-based dynamics, ideal for humanoid robotics applications.

### Mathematical Foundations

The physics simulation is based on Newtonian mechanics with additional considerations for computational efficiency:

**Force Integration**: F = ma, where forces are integrated over time steps to calculate velocity and position changes.

**Constraint Solving**: Joint constraints and contact constraints are solved using iterative methods to maintain physical accuracy while ensuring simulation stability.

**Time Stepping**: The simulation advances in discrete time steps, with smaller steps providing greater accuracy but requiring more computational resources.

## Digital Twin Lab (Simulation)

### Setting Up Gazebo Environment

First, let's create a basic Gazebo world with realistic physics parameters:

```xml
<?xml version="1.0" ?>
<sdf version="1.7">
  <world name="physics_lab">
    <!-- Physics engine configuration -->
    <physics type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
      <real_time_update_rate>1000.0</real_time_update_rate>
      <gravity>0 0 -9.8</gravity>
    </physics>

    <!-- Include default ground plane -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <!-- Include default lighting -->
    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Create a simple robot model with physics properties -->
    <model name="physics_test_robot">
      <pose>0 0 0.5 0 0 0</pose>
      <link name="chassis">
        <inertial>
          <mass>1.0</mass>
          <inertia>
            <ixx>0.01</ixx>
            <ixy>0</ixy>
            <ixz>0</ixz>
            <iyy>0.01</iyy>
            <iyz>0</iyz>
            <izz>0.01</izz>
          </inertia>
        </inertial>

        <collision name="collision">
          <geometry>
            <box>
              <size>0.2 0.2 0.1</size>
            </box>
          </geometry>
        </collision>

        <visual name="visual">
          <geometry>
            <box>
              <size>0.2 0.2 0.1</size>
            </box>
          </geometry>
        </visual>

        <!-- Add friction properties -->
        <surface>
          <friction>
            <ode>
              <mu>1.0</mu>
              <mu2>1.0</mu2>
            </ode>
          </friction>
          <bounce>
            <restitution_coefficient>0.1</restitution_coefficient>
            <threshold>100000</threshold>
          </bounce>
        </surface>
      </link>
    </model>
  </world>
</sdf>
```

### Implementing Physics-Based ROS 2 Node

Now let's create a ROS 2 node that interacts with the physics simulation:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from gazebo_msgs.srv import GetEntityState
from gazebo_msgs.msg import ModelState
from std_msgs.msg import Float64
import math

class PhysicsController(Node):
    def __init__(self):
        super().__init__('physics_controller')

        # Publisher for robot movement
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)

        # Client for getting entity state from Gazebo
        self.get_state_client = self.create_client(
            GetEntityState, '/gazebo/get_entity_state'
        )

        # Timer for physics updates
        self.timer = self.create_timer(0.01, self.physics_callback)  # 100 Hz

        # Initialize robot state
        self.robot_state = {
            'x': 0.0,
            'y': 0.0,
            'z': 0.0,
            'roll': 0.0,
            'pitch': 0.0,
            'yaw': 0.0
        }

        # Physics parameters
        self.mass = 1.0  # kg
        self.gravity = 9.81  # m/s^2
        self.friction_coefficient = 0.1

        self.get_logger().info('Physics Controller initialized')

    def physics_callback(self):
        """Main physics update loop"""
        # Get current state from Gazebo
        self.get_robot_state()

        # Apply physics calculations
        self.apply_gravity()
        self.check_collisions()

        # Publish control commands based on physics
        self.publish_control_commands()

    def get_robot_state(self):
        """Get current robot state from Gazebo"""
        if self.get_state_client.wait_for_service(timeout_sec=1.0):
            request = GetEntityState.Request()
            request.name = 'physics_test_robot'
            request.relative_entity_name = 'world'

            future = self.get_state_client.call_async(request)
            future.add_done_callback(self.state_callback)
        else:
            self.get_logger().warn('Gazebo service not available')

    def state_callback(self, future):
        """Process robot state response"""
        try:
            response = future.result()
            if response.success:
                self.robot_state['x'] = response.state.pose.position.x
                self.robot_state['y'] = response.state.pose.position.y
                self.robot_state['z'] = response.state.pose.position.z

                # Convert quaternion to euler angles
                orientation = response.state.pose.orientation
                self.robot_state['roll'], self.robot_state['pitch'], self.robot_state['yaw'] = \
                    self.quaternion_to_euler(orientation)

        except Exception as e:
            self.get_logger().error(f'State callback error: {e}')

    def quaternion_to_euler(self, q):
        """Convert quaternion to euler angles"""
        import math
        sinr_cosp = 2 * (q.w * q.x + q.y * q.z)
        cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y)
        roll = math.atan2(sinr_cosp, cosr_cosp)

        sinp = 2 * (q.w * q.y - q.z * q.x)
        pitch = math.asin(sinp)

        siny_cosp = 2 * (q.w * q.z + q.x * q.y)
        cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z)
        yaw = math.atan2(siny_cosp, cosy_cosp)

        return roll, pitch, yaw

    def apply_gravity(self):
        """Apply gravitational force to the robot"""
        # Calculate gravitational force
        gravity_force = self.mass * self.gravity

        # If robot is above ground, apply downward acceleration
        if self.robot_state['z'] > 0.05:  # Assuming robot height is 0.1m
            # In simulation, gravity is handled by Gazebo
            # Here we just monitor the effect
            pass
        else:
            # Robot is on ground, apply friction
            self.apply_friction()

    def apply_friction(self):
        """Apply friction force to slow down the robot"""
        # This is a simplified friction model
        # In real simulation, Gazebo handles this automatically
        pass

    def check_collisions(self):
        """Check for collisions with environment"""
        # In real implementation, this would check for collisions
        # For now, we'll just log the current state
        self.get_logger().debug(
            f'Robot position: ({self.robot_state["x"]:.2f}, {self.robot_state["y"]:.2f}, {self.robot_state["z"]:.2f})'
        )

    def publish_control_commands(self):
        """Publish control commands based on physics state"""
        msg = Twist()

        # Simple example: if robot is tilted, apply corrective force
        if abs(self.robot_state['roll']) > 0.1 or abs(self.robot_state['pitch']) > 0.1:
            # Apply corrective rotation
            msg.angular.z = -self.robot_state['roll'] * 2.0  # Proportional control
            msg.angular.y = -self.robot_state['pitch'] * 2.0

        self.cmd_vel_pub.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    physics_controller = PhysicsController()

    try:
        rclpy.spin(physics_controller)
    except KeyboardInterrupt:
        physics_controller.get_logger().info('Shutting down physics controller')
    finally:
        physics_controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Advanced Physics Configuration

For more complex physics scenarios, you can configure advanced parameters:

```xml
<physics type="ode">
  <!-- Time stepping parameters -->
  <max_step_size>0.001</max_step_size>
  <real_time_factor>1.0</real_time_factor>
  <real_time_update_rate>1000.0</real_time_update_rate>

  <!-- Gravity -->
  <gravity>0 0 -9.8</gravity>

  <!-- ODE-specific parameters -->
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

### Running the Simulation

To run this simulation, create a launch file:

```python
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import PathJoinSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    # Launch Gazebo with our world file
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
                FindPackageShare('my_robot_simulation'),
                'worlds',
                'physics_lab.world'
            ])
        }.items()
    )

    # Launch our physics controller node
    physics_controller = Node(
        package='my_robot_simulation',
        executable='physics_controller',
        name='physics_controller',
        output='screen'
    )

    return LaunchDescription([
        gazebo,
        physics_controller
    ])
```

## Physical AI Deployment (Edge)

### Physics Validation on Real Hardware

When transferring physics-based algorithms to real hardware, several considerations must be validated:

#### Mass Property Validation
Real robots have different mass distributions than simulation models. It's crucial to validate:

- **Center of Mass**: Physical robots may have different center of mass positions due to battery placement, sensor mounting, or manufacturing variations
- **Inertia Tensors**: Real inertia values may differ from CAD-based estimates
- **Actuator Dynamics**: Motor response characteristics, gear ratios, and friction may not match simulation

#### Sensor Fusion for Physics Validation
Implement sensor fusion to validate physics simulation accuracy:

```python
class PhysicsValidator(Node):
    def __init__(self):
        super().__init__('physics_validator')

        # Subscribe to IMU data for real physics validation
        self.imu_sub = self.create_subscription(
            Imu, '/imu/data', self.imu_callback, 10
        )

        # Subscribe to wheel encoders
        self.encoder_sub = self.create_subscription(
            JointState, '/joint_states', self.encoder_callback, 10
        )

        # Compare with simulation expectations
        self.sim_state_sub = self.create_subscription(
            ModelState, '/gazebo/model_states', self.sim_state_callback, 10
        )

        # Timer for validation checks
        self.validation_timer = self.create_timer(0.1, self.validate_physics)

        self.real_state = None
        self.sim_state = None

    def validate_physics(self):
        """Compare real and simulated physics behavior"""
        if self.real_state and self.sim_state:
            # Calculate differences between real and simulated behavior
            pos_diff = self.calculate_position_difference()
            vel_diff = self.calculate_velocity_difference()

            # Log validation results
            if pos_diff > 0.1:  # 10cm threshold
                self.get_logger().warn(f'Position validation failed: {pos_diff:.3f}m')
            if vel_diff > 0.5:  # 0.5 m/s threshold
                self.get_logger().warn(f'Velocity validation failed: {vel_diff:.3f}m/s')

    def calculate_position_difference(self):
        """Calculate position difference between real and sim"""
        # Implementation would compare real sensor data with simulation
        pass

    def calculate_velocity_difference(self):
        """Calculate velocity difference between real and sim"""
        # Implementation would compare real vs simulated velocities
        pass
```

#### Tuning Physics Parameters

For successful sim-to-real transfer, physics parameters often need adjustment:

1. **Friction Coefficients**: Real surfaces have different friction properties than simulation
2. **Damping Parameters**: Real systems often have more damping than simulation models
3. **Control Gains**: PID controller gains may need adjustment for real system dynamics
4. **Noise Models**: Add realistic noise to simulation to match sensor characteristics

### Hardware-in-the-Loop Simulation

For complex validation, implement hardware-in-the-loop (HIL) simulation:

```python
class HardwareInLoopSimulator(Node):
    def __init__(self):
        super().__init__('hil_simulator')

        # Interface with real sensors and actuators
        self.sensor_interface = self.create_subscription(
            SensorData, '/sensor_data', self.sensor_callback, 10
        )

        self.actuator_interface = self.create_publisher(
            ActuatorCommand, '/actuator_commands', 10
        )

        # Connect to simulation environment
        self.sim_client = self.create_client(
            SetModelState, '/gazebo/set_model_state'
        )

        # Synchronize real and simulated environments
        self.sync_timer = self.create_timer(0.01, self.synchronize_systems)

    def synchronize_systems(self):
        """Synchronize real and simulated systems"""
        # Update simulation based on real sensor data
        # Apply real actuator commands in simulation
        pass
```

## Summary

Gazebo physics simulation provides a crucial foundation for safe-to-fail robotics development. By accurately modeling gravity, collisions, and rigid body dynamics, developers can test complex algorithms without risking expensive hardware. The key to successful physics simulation lies in:

1. **Accurate Parameter Configuration**: Proper mass, inertia, friction, and damping parameters
2. **Realistic Environment Modeling**: Accurate representation of real-world physics conditions
3. **Validation and Tuning**: Comparing simulation results with real-world behavior
4. **Sim-to-Real Transfer**: Systematic approaches to bridge the simulation-to-reality gap

The physics simulation environment serves as a digital twin of the physical robot, allowing for extensive testing and validation before hardware deployment.

## Exercises

1. Create a Gazebo world with multiple objects of different masses and shapes, and observe their collision behavior
2. Implement a physics-based controller that maintains robot balance on a sloped surface
3. Compare the physics behavior of your simulation with real-world data from sensors
4. Create a physics validation system that compares simulated and real robot motion
5. Design a physics-based obstacle avoidance algorithm that accounts for momentum and friction