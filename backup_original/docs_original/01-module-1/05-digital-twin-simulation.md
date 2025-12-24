---
title: "Digital Twin Simulation: ROS 2 Nodes in Simulation Environment"
slug: "/module-1/digital-twin-simulation"
sidebar_position: 6
---

# Digital Twin Simulation: ROS 2 Nodes in Simulation Environment

## Introduction to Digital Twin Simulation

A digital twin in robotics represents a virtual replica of a physical robot system that mirrors its real-world counterpart in real-time. In the context of ROS 2, digital twin simulation involves creating accurate virtual models of robots and their environments that behave identically to their physical counterparts. This approach enables safe testing, validation, and optimization of robotic systems before physical deployment.

Digital twin simulation is particularly valuable in robotics because it allows for:
- **Safe Development**: Test algorithms without risk to physical hardware
- **Cost Reduction**: Reduce wear and tear on physical robots
- **Scalability**: Run multiple simulation instances simultaneously
- **Repeatability**: Exact reproduction of scenarios for debugging
- **Risk Mitigation**: Identify and fix issues before physical deployment

## Theory: Digital Twin Architecture and Principles

### Core Components of Digital Twin Simulation

#### 1. Physical Model Replication
The digital twin must accurately replicate the physical robot's:
- **Kinematic Structure**: Accurate URDF models representing joint limits and link properties
- **Dynamic Properties**: Mass, inertia, and friction parameters
- **Sensor Models**: Realistic sensor simulation with noise and limitations
- **Actuator Models**: Motor dynamics, delays, and limitations
- **Environmental Interactions**: Physics simulation of forces, collisions, and contacts

#### 2. Data Synchronization
The digital twin maintains synchronization with the physical system through:
- **State Estimation**: Real-time state estimation algorithms
- **Sensor Fusion**: Integration of multiple sensor inputs
- **Kalman Filtering**: Prediction and correction of state estimates
- ** مواصلات پروٹوکول **: جسمانی اور ورچوئل سسٹم کے مابین اصل وقت کا ڈیٹا ایکسچینج

#### 3. دو طرفہ مواصلات
جدید ڈیجیٹل جڑواں سپورٹ:
- ** فارورڈ تخروپن **: جسمانی → ورچوئل ڈیٹا فلو
- ** ریورس کنٹرول **: ورچوئل → جسمانی کمانڈ فلو
- ** انشانکن کی تازہ کاری **: حقیقی دنیا کے اعداد و شمار پر مبنی پیرامیٹر ایڈجسٹمنٹ
- ** کارکردگی کی آراء **: حقیقی دنیا کی کارکردگی میٹرکس کو کھانا کھلانے میں تخروپن میں بہتری

### تخروپن کی وفاداری کی سطح

#### کم مخلصی
- ** مقصد **: الگورتھم کی توثیق اور بنیادی فعالیت کی جانچ
- ** خصوصیات **: آسان طبیعیات ، بنیادی سینسر ماڈل
- ** معاملات استعمال کریں **: راہ کی منصوبہ بندی ، بنیادی نیویگیشن ، کنٹرول الگورتھم کی توثیق

#### درمیانے درجے کی وفاداری
- ** مقصد **: جامع نظام کی توثیق اور انضمام کی جانچ
- ** خصوصیات **: تفصیلی طبیعیات ، حقیقت پسندانہ سینسر ماڈل ، ماحولیاتی عوامل
- ** معاملات استعمال کریں **: پیچیدہ طرز عمل ، ملٹی روبوٹ کوآرڈینیشن ، سینسر فیوژن

#### اعلی مخلصی
-** مقصد **: قریب کی دنیا کی توثیق اور حفاظت کی سند
- ** خصوصیات **: فوٹووریالسٹک رینڈرنگ ، تفصیلی طبیعیات ، عین مطابق سینسر ماڈل
-** معاملات استعمال کریں **: حفاظتی اہم ایپلی کیشنز ، پیچیدہ تاثرات کے کام ، سم سے حقیقی منتقلی

### ڈیجیٹل جڑواں بچوں کے لئے نقلی ماحول

#### گیزبو
- ** طبیعیات کا انجن **: حقیقت پسندانہ طبیعیات کی نقالی کے لئے اوڈ ، گولی ، یا ڈارٹ
- ** سینسر تخروپن **: کیمرے ، لیدر ، آئی ایم یو ، جی پی ایس ، اور کسٹم سینسر
- ** رینڈرنگ **: حقیقت پسندانہ روشنی کے ساتھ اوپن جی ایل پر مبنی تصور
- ** پلگ انز **: کسٹم سینسر اور ایکٹیویٹر ماڈلز کے لئے قابل توسیع پلگ ان سسٹم

#### اسحاق سم
- ** فوٹووریالسٹک رینڈرنگ **: مصنوعی اعداد و شمار کے لئے NVIDIA RTX پر مبنی رینڈرنگ
- ** AI انضمام **: NVIDIA AI ٹولز اور فریم ورک کے ساتھ مقامی انضمام
- ** مصنوعی ڈیٹا جنریشن **: تربیت کے لئے بڑے پیمانے پر ڈیٹاسیٹ جنریشن
- ** USD فارمیٹ **: پیچیدہ منظر کی نمائندگی کے لئے عالمگیر منظر کی تفصیل

#### اتحاد روبوٹکس
-** اعلی معیار کے گرافکس **: تصور کے لئے صنعت کے معیاری گیم انجن- **XR Support**: Virtual and augmented reality integration- **Physics Simulation**: PhysX engine for realistic interactions
- **ROS Integration**: Native ROS bridge for seamless communication

## Simulation: Implementing Digital Twin with ROS 2

### Setting Up Gazebo Simulation Environment

First, let's create a complete simulation environment for our humanoid robot:

```xml
<!-- File: ~/ros2_ws/src/my_robot_gazebo/urdf/humanoid_sim.urdf.xacro -->
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="humanoid_sim">

  <!-- Include basic robot model -->
  <xacro:include filename="$(find my_robot_description)/urdf/humanoid.xacro"/>

  <!-- Gazebo-specific plugins for simulation -->
  <gazebo>
    <!-- ROS Control plugin -->
    <plugin name="gazebo_ros_control" filename="libgazebo_ros_control.so">
      <robotNamespace>/humanoid_robot</robotNamespace>
      <robotSimType>gazebo_ros_control/DefaultRobotHWSim</robotSimType>
    </plugin>
  </gazebo>

  <!-- Gazebo properties for each link -->
  <gazebo reference="base_link">
    <material>Gazebo/DarkGrey</material>
    <mu1>0.2</mu1>
    <mu2>0.2</mu2>
    <kp>1000000.0</kp>
    <kd>100.0</kd>
    <fdir1>1 0 0</fdir1>
    <maxVel>1.0</maxVel>
    <minDepth>0.001</minDepth>
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
        <noise>
          <type>gaussian</type>
          <mean>0.0</mean>
          <stddev>0.007</stddev>
        </noise>
      </camera>
      <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
        <frame_name>camera_optical_frame</frame_name>
        <min_depth>0.1</min_depth>
        <max_depth>100.0</max_depth>
      </plugin>
    </sensor>
  </gazebo>

  <!-- LiDAR sensor -->
  <gazebo reference="lidar_link">
    <sensor type="ray" name="laser_scanner">
      <pose>0 0 0 0 0 0</pose>
      <visualize>true</visualize>
      <update_rate>10</update_rate>
      <ray>
        <scan>
          <horizontal>
            <samples>720</samples>
            <resolution>1</resolution>
            <min_angle>-1.570796</min_angle>
            <max_angle>1.570796</max_angle>
          </horizontal>
        </scan>
        <range>
          <min>0.1</min>
          <max>30.0</max>
          <resolution>0.01</resolution>
        </range>
        <noise>
          <type>gaussian</type>
          <mean>0.0</mean>
          <stddev>0.01</stddev>
        </noise>
      </ray>
      <plugin name="laser_controller" filename="libgazebo_ros_laser.so">
        <topic_name>scan</topic_name>
        <frame_name>lidar_frame</frame_name>
      </plugin>
    </sensor>
  </gazebo>

  <!-- IMU sensor -->
  <gazebo reference="imu_link">
    <sensor name="imu_sensor" type="imu">
      <always_on>true</always_on>
      <update_rate>100</update_rate>
      <visualize>false</visualize>
      <topic>__default_topic__</topic>
      <plugin filename="libgazebo_ros_imu_sensor.so" name="imu_plugin">
        <topicName>imu/data</topicName>
        <bodyName>imu_link</bodyName>
        <updateRateHZ>100.0</updateRateHZ>
        <gaussianNoise>0.01</gaussianNoise>
        <xyzOffset>0 0 0</xyzOffset>
        <rpyOffset>0 0 0</rpyOffset>
        <frameName>imu_link</frameName>
      </plugin>
      <pose>0 0 0 0 0 0</pose>
    </sensor>
  </gazebo>

</robot>
```

### Launch Files for Simulation

```xml
<!-- File: ~/ros2_ws/src/my_robot_gazebo/launch/humanoid_simulation.launch.py -->
import launch
from launch.substitutions import Command, LaunchConfiguration
from launch.actions import DeclareLaunchArgument, RegisterEventHandler, TimerAction
from launch.event_handlers import OnProcessStart
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare
from ament_index_python.packages import get_package_share_directory
import os


def generate_launch_description():
    pkg_share = get_package_share_directory('my_robot_gazebo')
    robot_description_path = os.path.join(pkg_share, 'urdf', 'humanoid_sim.urdf.xacro')

    # Declare launch arguments
    use_sim_time = LaunchConfiguration('use_sim_time', default='true')
    robot_name = LaunchConfiguration('robot_name', default='humanoid_robot')
    world = LaunchConfiguration('world', default='empty')

    # Robot state publisher
    robot_state_publisher_node = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[
            {'use_sim_time': use_sim_time},
            {'robot_description': Command(['xacro ', robot_description_path])}
        ]
    )

    # Gazebo launch
    gazebo = launch.actions.IncludeLaunchDescription(
        launch.launch_description_sources.PythonLaunchDescriptionSource(
            os.path.join(get_package_share_directory('gazebo_ros'), 'launch', 'gazebo.launch.py')
        ),
        launch_arguments={
            'world': world,
            'verbose': 'false',
            'gui': 'true'
        }.items()
    )

    # Spawn robot in Gazebo
    spawn_entity = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-topic', 'robot_description',
            '-entity', robot_name,
            '-x', '0', '-y', '0', '-z', '1.0'  # Start 1m above ground
        ],
        output='screen'
    )

    # Joint state publisher (GUI for testing)
    joint_state_publisher_gui = Node(
        package='joint_state_publisher_gui',
        executable='joint_state_publisher_gui',
        condition=launch.conditions.IfCondition(
            launch.substitutions.LaunchConfiguration('use_gui', default='false')
        )
    )

    # Controllers (example joint trajectory controller)
    joint_trajectory_controller = Node(
        package='controller_manager',
        executable='spawner',
        arguments=['joint_trajectory_controller'],
        parameters=[{'use_sim_time': use_sim_time}],
        output='screen'
    )

    # Velocity controller
    velocity_controller = Node(
        package='controller_manager',
        executable='spawner',
        arguments=['velocity_controller'],
        parameters=[{'use_sim_time': use_sim_time}],
        output='screen'
    )

    # Return the launch description
    return launch.LaunchDescription([
        DeclareLaunchArgument(
            'use_sim_time',
            default_value='true',
            description='Use simulation (Gazebo) clock if true'
        ),
        DeclareLaunchArgument(
            'robot_name',
            default_value='humanoid_robot',
            description='Name of the robot to spawn in Gazebo'
        ),
        DeclareLaunchArgument(
            'world',
            default_value='empty',
            description='Choose one of the world files from `/gazebo_ros/worlds`'
        ),
        DeclareLaunchArgument(
            'use_gui',
            default_value='false',
            description='Whether to launch joint state publisher GUI'
        ),

        # Launch Gazebo first
        gazebo,

        # Then robot state publisher
        robot_state_publisher_node,

        # After Gazebo is started, spawn the robot
        RegisterEventHandler(
            event_handler=OnProcessStart(
                target_action=gazebo,
                on_start=[
                    # Add a delay before spawning to ensure Gazebo is ready
                    TimerAction(
                        period=3.0,
                        actions=[spawn_entity]
                    )
                ]
            )
        ),

        # Launch controllers after robot is spawned
        RegisterEventHandler(
            event_handler=OnProcessStart(
                target_action=spawn_entity,
                on_start=[
                    TimerAction(
                        period=5.0,
                        actions=[
                            joint_trajectory_controller,
                            velocity_controller
                        ]
                    )
                ]
            )
        ),

        joint_state_publisher_gui
    ])
```

### Simulation Nodes

Now let's create simulation-specific nodes that demonstrate digital twin concepts:

```python
# File: ~/ros2_ws/src/my_robot_gazebo/my_robot_gazebo/simulation_manager.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy
from std_msgs.msg import String, Bool, Float32
from sensor_msgs.msg import JointState, Imu, LaserScan
from geometry_msgs.msg import Twist, Pose
from nav_msgs.msg import Odometry
from tf2_ros import TransformBroadcaster
from builtin_interfaces.msg import Time
import math
import numpy as np
from collections import deque
import threading
import time


class SimulationManager(Node):
    """
    Manages the digital twin simulation environment
    """
    def __init__(self):
        super().__init__('simulation_manager')

        # QoS profiles
        sensor_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.BEST_EFFORT)
        control_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.RELIABLE)

        # Publishers
        self.sim_status_pub = self.create_publisher(String, 'simulation/status', 10)
        self.sim_metrics_pub = self.create_publisher(String, 'simulation/metrics', 10)
        self.tf_broadcaster = TransformBroadcaster(self)

        # Subscribers
        self.joint_state_sub = self.create_subscription(
            JointState, 'joint_states', self.joint_state_callback, sensor_qos)
        self.odom_sub = self.create_subscription(
            Odometry, 'odom', self.odom_callback, sensor_qos)
        self.imu_sub = self.create_subscription(
            Imu, 'imu/data', self.imu_callback, sensor_qos)

        # Simulation control
        self.sim_control_sub = self.create_subscription(
            String, 'simulation/control', self.sim_control_callback, control_qos)

        # Simulation state
        self.simulation_active = True
        self.simulation_time_factor = 1.0
        self.simulation_metrics = {
            'real_time_factor': 1.0,
            'physics_steps': 0,
            'rendered_frames': 0,
            'simulation_time': 0.0
        }

        # Robot state tracking
        self.robot_state = {
            'position': np.array([0.0, 0.0, 0.0]),
            'orientation': np.array([0.0, 0.0, 0.0, 1.0]),  # quaternion
            'velocity': np.array([0.0, 0.0, 0.0]),
            'angular_velocity': np.array([0.0, 0.0, 0.0]),
            'joint_positions': {},
            'joint_velocities': {}
        }

        # Performance monitoring
        self.metrics_history = deque(maxlen=100)
        self.last_update_time = time.time()

        # Timers
        self.status_timer = self.create_timer(1.0, self.publish_simulation_status)
        self.metrics_timer = self.create_timer(5.0, self.update_metrics)

        # Threads for simulation management
        self.physics_thread = threading.Thread(target=self.physics_loop, daemon=True)
        self.rendering_thread = threading.Thread(target=self.rendering_loop, daemon=True)
        self.physics_thread.start()
        self.rendering_thread.start()

        self.get_logger().info('Simulation Manager initialized')

    def joint_state_callback(self, msg):
        """Process joint state updates from simulation"""
        for i, name in enumerate(msg.name):
            if i < len(msg.position):
                self.robot_state['joint_positions'][name] = msg.position[i]
            if i < len(msg.velocity):
                self.robot_state['joint_velocities'][name] = msg.velocity[i]

    def odom_callback(self, msg):
        """Process odometry updates from simulation"""
        self.robot_state['position'] = np.array([
            msg.pose.pose.position.x,
            msg.pose.pose.position.y,
            msg.pose.pose.position.z
        ])

        self.robot_state['orientation'] = np.array([
            msg.pose.pose.orientation.x,
            msg.pose.pose.orientation.y,
            msg.pose.pose.orientation.z,
            msg.pose.pose.orientation.w
        ])

        self.robot_state['velocity'] = np.array([
            msg.twist.twist.linear.x,
            msg.twist.twist.linear.y,
            msg.twist.twist.linear.z
        ])

        self.robot_state['angular_velocity'] = np.array([
            msg.twist.twist.angular.x,
            msg.twist.twist.angular.y,
            msg.twist.twist.angular.z
        ])

    def imu_callback(self, msg):
        """Process IMU data from simulation"""
        # Update robot state with IMU data
        self.robot_state['angular_velocity'] = np.array([
            msg.angular_velocity.x,
            msg.angular_velocity.y,
            msg.angular_velocity.z
        ])

    def sim_control_callback(self, msg):
        """Handle simulation control commands"""
        command = msg.data.lower()

        if command == 'pause':
            self.simulation_active = False
            self.get_logger().info('Simulation paused')
        elif command == 'resume':
            self.simulation_active = True
            self.get_logger().info('Simulation resumed')
        elif command == 'reset':
            self.reset_simulation()
            self.get_logger().info('Simulation reset')
        elif command.startswith('speed_factor'):
            try:
                factor = float(command.split('_')[2])
                self.simulation_time_factor = max(0.1, min(10.0, factor))  # Limit between 0.1x and 10x
                self.get_logger().info(f'Simulation speed factor set to {self.simulation_time_factor}x')
            except (ValueError, IndexError):
                self.get_logger().warn(f'Invalid speed factor command: {command}')

    def physics_loop(self):
        """Simulate physics calculations"""
        while rclpy.ok():
            if self.simulation_active:
                # Update physics simulation
                self.simulation_metrics['physics_steps'] += 1
                self.simulation_metrics['simulation_time'] += 0.001 * self.simulation_time_factor

            time.sleep(0.001)  # 1kHz physics update

    def rendering_loop(self):
        """Simulate rendering calculations"""
        while rclpy.ok():
            if self.simulation_active:
                # Update rendering simulation
                self.simulation_metrics['rendered_frames'] += 1

            time.sleep(0.016)  # ~60 FPS rendering

    def update_metrics(self):
        """Update simulation metrics"""
        current_time = time.time()
        time_diff = current_time - self.last_update_time

        if time_diff > 0:
            # Calculate real-time factor
            physics_steps_per_second = self.simulation_metrics['physics_steps'] / time_diff
            # Assuming 1000 physics steps per second in real time
            self.simulation_metrics['real_time_factor'] = physics_steps_per_second / 1000.0

            # Store metrics for history
            self.metrics_history.append({
                'timestamp': current_time,
                'rtf': self.simulation_metrics['real_time_factor'],
                'steps': self.simulation_metrics['physics_steps'],
                'frames': self.simulation_metrics['rendered_frames']
            })

            self.last_update_time = current_time

    def publish_simulation_status(self):
        """Publish simulation status information"""
        status_msg = String()
        status_msg.data = f"Active: {self.simulation_active}, " \
                         f"Speed: {self.simulation_time_factor}x, " \
                         f"RTF: {self.simulation_metrics['real_time_factor']:.2f}, " \
                         f"Steps: {self.simulation_metrics['physics_steps']}"
        self.sim_status_pub.publish(status_msg)

        # Publish detailed metrics
        metrics_msg = String()
        metrics_msg.data = f"Real-time factor: {self.simulation_metrics['real_time_factor']:.2f}\n" \
                          f"Physics steps: {self.simulation_metrics['physics_steps']}\n" \
                          f"Rendered frames: {self.simulation_metrics['rendered_frames']}\n" \
                          f"Simulation time: {self.simulation_metrics['simulation_time']:.2f}s"
        self.sim_metrics_pub.publish(metrics_msg)

    def reset_simulation(self):
        """Reset simulation to initial state"""
        # Reset robot state
        self.robot_state = {
            'position': np.array([0.0, 0.0, 0.0]),
            'orientation': np.array([0.0, 0.0, 0.0, 1.0]),
            'velocity': np.array([0.0, 0.0, 0.0]),
            'angular_velocity': np.array([0.0, 0.0, 0.0]),
            'joint_positions': {name: 0.0 for name in self.robot_state['joint_positions'].keys()},
            'joint_velocities': {name: 0.0 for name in self.robot_state['joint_velocities'].keys()}
        }

        # Reset metrics
        self.simulation_metrics = {
            'real_time_factor': 1.0,
            'physics_steps': 0,
            'rendered_frames': 0,
            'simulation_time': 0.0
        }

        self.last_update_time = time.time()

    def destroy_node(self):
        """Clean up simulation resources"""
        self.simulation_active = False
        super().destroy_node()


def main(args=None):
    """Main function for simulation manager"""
    rclpy.init(args=args)
    sim_manager = SimulationManager()

    try:
        rclpy.spin(sim_manager)
    except KeyboardInterrupt:
        pass
    finally:
        sim_manager.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Digital Twin Synchronization Node

```python
# File: ~/ros2_ws/src/my_robot_gazebo/my_robot_gazebo/digital_twin_sync.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy
from std_msgs.msg import String, Float32
from sensor_msgs.msg import JointState, Imu, LaserScan
from geometry_msgs.msg import Twist, Pose
from nav_msgs.msg import Odometry
from tf2_ros import TransformListener, Buffer
from builtin_interfaces.msg import Time
import numpy as np
import math
from collections import deque
import time
from scipy.spatial.transform import Rotation as R


class DigitalTwinSynchronizer(Node):
    """
    Synchronizes the digital twin with real-world data
    """
    def __init__(self):
        super().__init__('digital_twin_synchronizer')

        # QoS profiles
        sensor_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.BEST_EFFORT)
        control_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.RELIABLE)

        # Publishers for digital twin state
        self.digital_odom_pub = self.create_publisher(Odometry, 'digital_twin/odom', 10)
        self.digital_joint_pub = self.create_publisher(JointState, 'digital_twin/joint_states', 10)
        self.calibration_pub = self.create_publisher(String, 'calibration/status', 10)

        # Subscribers for real-world data
        self.real_odom_sub = self.create_subscription(
            Odometry, 'real_robot/odom', self.real_odom_callback, sensor_qos)
        self.real_joint_sub = self.create_subscription(
            JointState, 'real_robot/joint_states', self.real_joint_callback, sensor_qos)
        self.real_imu_sub = self.create_subscription(
            Imu, 'real_robot/imu/data', self.real_imu_callback, sensor_qos)

        # Calibration and synchronization parameters
        self.sync_enabled = True
        self.calibration_threshold = 0.05  # 5cm threshold for position sync
        self.orientation_threshold = 0.1   # 0.1 rad threshold for orientation sync
        self.calibration_required = True

        # State tracking
        self.real_state = {
            'position': np.array([0.0, 0.0, 0.0]),
            'orientation': np.array([0.0, 0.0, 0.0, 1.0]),
            'velocity': np.array([0.0, 0.0, 0.0]),
            'angular_velocity': np.array([0.0, 0.0, 0.0]),
            'joint_positions': {},
            'joint_velocities': {}
        }

        self.sim_state = {
            'position': np.array([0.0, 0.0, 0.0]),
            'orientation': np.array([0.0, 0.0, 0.0, 1.0]),
            'velocity': np.array([0.0, 0.0, 0.0]),
            'angular_velocity': np.array([0.0, 0.0, 0.0]),
            'joint_positions': {},
            'joint_velocities': {}
        }

        # Calibration and correction factors
        self.position_offset = np.array([0.0, 0.0, 0.0])
        self.orientation_offset = np.array([0.0, 0.0, 0.0, 1.0])
        self.joint_calibration_factors = {}  # Joint-specific calibration

        # Synchronization history
        self.sync_history = deque(maxlen=100)
        self.calibration_history = deque(maxlen=50)

        # Timers
        self.sync_timer = self.create_timer(0.1, self.synchronize_states)
        self.calibration_timer = self.create_timer(5.0, self.evaluate_calibration)

        # TF listener for transforms
        self.tf_buffer = Buffer()
        self.tf_listener = TransformListener(self.tf_buffer, self)

        self.get_logger().info('Digital Twin Synchronizer initialized')

    def real_odom_callback(self, msg):
        """Process real robot odometry data"""
        self.real_state['position'] = np.array([
            msg.pose.pose.position.x,
            msg.pose.pose.position.y,
            msg.pose.pose.position.z
        ])

        self.real_state['orientation'] = np.array([
            msg.pose.pose.orientation.x,
            msg.pose.pose.orientation.y,
            msg.pose.pose.orientation.z,
            msg.pose.pose.orientation.w
        ])

        self.real_state['velocity'] = np.array([
            msg.twist.twist.linear.x,
            msg.twist.twist.linear.y,
            msg.twist.twist.linear.z
        ])

        self.real_state['angular_velocity'] = np.array([
            msg.twist.twist.angular.x,
            msg.twist.twist.angular.y,
            msg.twist.twist.angular.z
        ])

    def real_joint_callback(self, msg):
        """Process real robot joint state data"""
        for i, name in enumerate(msg.name):
            if i < len(msg.position):
                self.real_state['joint_positions'][name] = msg.position[i]
            if i < len(msg.velocity):
                self.real_state['joint_velocities'][name] = msg.velocity[i]

    def real_imu_callback(self, msg):
        """Process real robot IMU data"""
        # Use IMU to validate orientation
        real_orientation = np.array([
            msg.orientation.x,
            msg.orientation.y,
            msg.orientation.z,
            msg.orientation.w
        ])

        # Validate against odometry orientation
        orientation_diff = self.quaternion_difference(
            self.real_state['orientation'],
            real_orientation
        )

        if orientation_diff > self.orientation_threshold:
            # Use IMU orientation if it's more reliable
            self.real_state['orientation'] = real_orientation

    def synchronize_states(self):
        """Synchronize digital twin with real robot state"""
        if not self.sync_enabled:
            return

        # Calculate differences between real and simulated states
        pos_diff = np.linalg.norm(self.real_state['position'] - self.sim_state['position'])
        orient_diff = self.quaternion_difference(
            self.real_state['orientation'],
            self.sim_state['orientation']
        )

        sync_needed = False
        sync_details = []

        # Check if position synchronization is needed
        if pos_diff > self.calibration_threshold:
            sync_needed = True
            sync_details.append(f'Position diff: {pos_diff:.3f}m')

            # Apply position correction
            correction = self.real_state['position'] - self.sim_state['position']
            self.position_offset += correction * 0.1  # Apply 10% correction per sync

        # Check if orientation synchronization is needed
        if orient_diff > self.orientation_threshold:
            sync_needed = True
            sync_details.append(f'Orientation diff: {orient_diff:.3f}rad')

            # Apply orientation correction
            self.orientation_offset = self.interpolate_quaternions(
                self.orientation_offset,
                self.calculate_orientation_correction(),
                0.1  # Apply 10% correction
            )

        # Check joint position synchronization
        joint_sync_needed = False
        for joint_name, real_pos in self.real_state['joint_positions'].items():
            if joint_name in self.sim_state['joint_positions']:
                sim_pos = self.sim_state['joint_positions'][joint_name]
                joint_diff = abs(real_pos - sim_pos)

                if joint_diff > 0.05:  # 5 degrees threshold
                    joint_sync_needed = True
                    # Apply joint-specific calibration
                    if joint_name not in self.joint_calibration_factors:
                        self.joint_calibration_factors[joint_name] = 1.0

                    # Update calibration factor gradually
                    current_factor = self.joint_calibration_factors[joint_name]
                    target_factor = real_pos / (sim_pos + 1e-6)  # Avoid division by zero
                    self.joint_calibration_factors[joint_name] = current_factor * 0.95 + target_factor * 0.05

        if sync_needed or joint_sync_needed:
            # Log synchronization event
            sync_info = f"Sync event: {', '.join(sync_details)}"
            if joint_sync_needed:
                sync_info += " + joint calibration"
            self.get_logger().info(sync_info)

            # Update sync history
            self.sync_history.append({
                'timestamp': time.time(),
                'position_diff': pos_diff,
                'orientation_diff': orient_diff,
                'sync_needed': sync_needed,
                'joint_sync_needed': joint_sync_needed
            })

            # Publish synchronization status
            sync_status = String()
            sync_status.data = f"Sync: Pos={pos_diff:.3f}m, Orient={orient_diff:.3f}rad"
            self.calibration_pub.publish(sync_status)

    def quaternion_difference(self, q1, q2):
        """Calculate the difference between two quaternions"""
        # Convert to rotation vectors and calculate difference
        r1 = R.from_quat(q1)
        r2 = R.from_quat(q2)
        relative_rotation = r1.inv() * r2
        rotation_vector = relative_rotation.as_rotvec()
        return np.linalg.norm(rotation_vector)

    def interpolate_quaternions(self, q1, q2, t):
        """Interpolate between two quaternions"""
        r1 = R.from_quat(q1)
        r2 = R.from_quat(q2)
        interpolated_r = R.from_quat(R.concatenate([r1, r2]).as_quat()[1])  # Simplified interpolation
        # Use spherical linear interpolation (SLERP) for better results
        return R.from_quat(q1).slerp(R.from_quat(q2), t).as_quat()

    def calculate_orientation_correction(self):
        """Calculate orientation correction based on real and simulated states"""
        # This would typically use more sophisticated algorithms like EKF or UKF
        # For simplicity, we'll return the real orientation as correction
        return self.real_state['orientation']

    def evaluate_calibration(self):
        """Evaluate the quality of calibration and synchronization"""
        if not self.sync_history:
            return

        # Calculate average synchronization metrics
        avg_pos_diff = np.mean([entry['position_diff'] for entry in self.sync_history])
        avg_orient_diff = np.mean([entry['orientation_diff'] for entry in self.sync_history])
        sync_frequency = len([entry for entry in self.sync_history if entry['sync_needed']]) / 5.0  # per second

        calibration_quality = "GOOD"
        if avg_pos_diff > 0.1 or avg_orient_diff > 0.2 or sync_frequency > 2.0:
            calibration_quality = "POOR"
        elif avg_pos_diff > 0.05 or avg_orient_diff > 0.1 or sync_frequency > 1.0:
            calibration_quality = "FAIR"

        # Log calibration evaluation
        eval_msg = f"Calibration evaluation: Quality={calibration_quality}, " \
                  f"Avg Pos Diff={avg_pos_diff:.3f}m, " \
                  f"Avg Orient Diff={avg_orient_diff:.3f}rad, " \
                  f"Sync Freq={sync_frequency:.2f}Hz"
        self.get_logger().info(eval_msg)

        # Store in history
        self.calibration_history.append({
            'timestamp': time.time(),
            'quality': calibration_quality,
            'avg_pos_diff': avg_pos_diff,
            'avg_orient_diff': avg_orient_diff,
            'sync_frequency': sync_frequency
        })

        # Publish evaluation results
        eval_status = String()
        eval_status.data = f"Quality: {calibration_quality}, Pos Diff: {avg_pos_diff:.3f}m, Freq: {sync_frequency:.2f}Hz"
        self.calibration_pub.publish(eval_status)

        # Adjust synchronization parameters based on quality
        if calibration_quality == "POOR":
            # Increase synchronization frequency
            self.get_logger().warn("Poor calibration detected, increasing sync frequency")
        elif calibration_quality == "GOOD":
            # Decrease synchronization frequency to reduce overhead
            self.get_logger().info("Good calibration maintained")

    def update_digital_twin_state(self):
        """Update digital twin state based on synchronization"""
        # This would publish corrected state to the digital twin
        # For now, we'll just log the updates
        pass

    def destroy_node(self):
        """Clean up synchronizer resources"""
        self.sync_enabled = False
        super().destroy_node()


def main(args=None):
    """Main function for digital twin synchronizer"""
    rclpy.init(args=args)
    synchronizer = DigitalTwinSynchronizer()

    try:
        rclpy.spin(synchronizer)
    except KeyboardInterrupt:
        pass
    finally:
        synchronizer.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Simulation Testing Node

```python
# File: ~/ros2_ws/src/my_robot_gazebo/my_robot_gazebo/simulation_tester.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy
from std_msgs.msg import String, Bool
from geometry_msgs.msg import Twist, Pose
from sensor_msgs.msg import JointState, LaserScan
from nav_msgs.msg import Odometry
from builtin_interfaces.msg import Time
import math
import numpy as np
import time
from collections import deque
import threading


class SimulationTester(Node):
    """
    Tests and validates the simulation environment
    """
    def __init__(self):
        super().__init__('simulation_tester')

        # QoS profiles
        sensor_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.BEST_EFFORT)
        control_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.RELIABLE)

        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.test_results_pub = self.create_publisher(String, 'simulation/test_results', 10)
        self.test_status_pub = self.create_publisher(Bool, 'simulation/test_running', 10)

        # Subscribers
        self.odom_sub = self.create_subscription(
            Odometry, 'odom', self.odom_callback, sensor_qos)
        self.joint_state_sub = self.create_subscription(
            JointState, 'joint_states', self.joint_state_callback, sensor_qos)
        self.scan_sub = self.create_subscription(
            LaserScan, 'scan', self.scan_callback, sensor_qos)

        # Test control
        self.test_control_sub = self.create_subscription(
            String, 'simulation/test_control', self.test_control_callback, control_qos)

        # Test state
        self.testing_active = False
        self.current_test = None
        self.test_results = {}
        self.test_history = deque(maxlen=50)

        # Robot state tracking
        self.current_pose = Pose()
        self.current_twist = Twist()
        self.joint_states = {}
        self.scan_data = None

        # Test parameters
        self.test_sequences = {
            'basic_movement': self.test_basic_movement,
            'rotation_test': self.test_rotation,
            'obstacle_avoidance': self.test_obstacle_avoidance,
            'precision_navigation': self.test_precision_navigation,
            'long_term_stability': self.test_long_term_stability
        }

        # Performance monitoring
        self.performance_metrics = {
            'loop_rate': 0,
            'message_rate': 0,
            'cpu_usage': 0,
            'memory_usage': 0
        }

        # Timers
        self.test_timer = self.create_timer(0.1, self.run_active_test)
        self.performance_timer = self.create_timer(1.0, self.update_performance_metrics)

        # Threading for test execution
        self.test_thread = threading.Thread(target=self.execute_tests, daemon=True)
        self.test_thread.start()

        self.get_logger().info('Simulation Tester initialized')

    def odom_callback(self, msg):
        """Process odometry data"""
        self.current_pose = msg.pose.pose
        self.current_twist = msg.twist.twist

    def joint_state_callback(self, msg):
        """Process joint state data"""
        for i, name in enumerate(msg.name):
            if i < len(msg.position):
                self.joint_states[name] = {
                    'position': msg.position[i],
                    'velocity': msg.velocity[i] if i < len(msg.velocity) else 0.0,
                    'effort': msg.effort[i] if i < len(msg.effort) else 0.0
                }

    def scan_callback(self, msg):
        """Process laser scan data"""
        self.scan_data = msg

    def test_control_callback(self, msg):
        """Handle test control commands"""
        command = msg.data.lower()

        if command.startswith('start_'):
            test_name = command[6:]  # Remove 'start_' prefix
            if test_name in self.test_sequences:
                self.start_test(test_name)
            else:
                self.get_logger().warn(f'Unknown test: {test_name}')
        elif command == 'stop':
            self.stop_test()
        elif command == 'list':
            available_tests = ', '.join(self.test_sequences.keys())
            self.get_logger().info(f'Available tests: {available_tests}')

    def start_test(self, test_name):
        """Start a specific test"""
        if self.testing_active:
            self.get_logger().warn('Test already running, stopping current test')
            self.stop_test()

        self.current_test = test_name
        self.testing_active = True
        self.test_results[test_name] = {
            'start_time': time.time(),
            'results': [],
            'passed': False,
            'metrics': {}
        }

        self.get_logger().info(f'Starting test: {test_name}')
        self.publish_test_status(True)

    def stop_test(self):
        """Stop the current test"""
        if self.testing_active:
            test_name = self.current_test
            if test_name:
                self.test_results[test_name]['end_time'] = time.time()
                self.test_results[test_name]['passed'] = self.evaluate_test_results(test_name)

                # Store in history
                self.test_history.append(self.test_results[test_name])

                # Log results
                passed = self.test_results[test_name]['passed']
                self.get_logger().info(f'Test {test_name} completed - Passed: {passed}')

        self.testing_active = False
        self.current_test = None
        self.publish_test_status(False)

    def run_active_test(self):
        """Run the currently active test"""
        if not self.testing_active or not self.current_test:
            return

        test_func = self.test_sequences.get(self.current_test)
        if test_func:
            try:
                result = test_func()
                if result is not None:
                    self.test_results[self.current_test]['results'].append(result)
            except Exception as e:
                self.get_logger().error(f'Test {self.current_test} error: {str(e)}')
                self.stop_test()

    def test_basic_movement(self):
        """Test basic forward movement"""
        if 'movement_counter' not in self.__dict__:
            self.movement_counter = 0
            self.initial_x = self.current_pose.position.x

        # Move forward for 5 seconds
        if self.movement_counter < 50:  # 50 iterations at 0.1s = 5 seconds
            cmd = Twist()
            cmd.linear.x = 0.5  # Move forward at 0.5 m/s
            self.cmd_vel_pub.publish(cmd)
            self.movement_counter += 1
        else:
            # Stop and evaluate
            self.cmd_vel_pub.publish(Twist())  # Stop command

            # Calculate distance traveled
            distance_traveled = abs(self.current_pose.position.x - self.initial_x)
            expected_distance = 0.5 * 5.0  # 0.5 m/s * 5 seconds

            accuracy = abs(distance_traveled - expected_distance) / expected_distance
            success = accuracy < 0.1  # Less than 10% error

            result = {
                'test': 'basic_movement',
                'distance_traveled': distance_traveled,
                'expected_distance': expected_distance,
                'accuracy': accuracy,
                'success': success
            }

            self.movement_counter = 0  # Reset for next test
            return result

    def test_rotation(self):
        """Test rotational movement"""
        if 'rotation_counter' not in self.__dict__:
            self.rotation_counter = 0
            self.initial_yaw = self.get_yaw_from_quaternion(self.current_pose.orientation)

        # Rotate for 3 seconds
        if self.rotation_counter < 30:  # 30 iterations at 0.1s = 3 seconds
            cmd = Twist()
            cmd.angular.z = 0.5  # Rotate at 0.5 rad/s
            self.cmd_vel_pub.publish(cmd)
            self.rotation_counter += 1
        else:
            # Stop and evaluate
            self.cmd_vel_pub.publish(Twist())  # Stop command

            # Calculate rotation
            final_yaw = self.get_yaw_from_quaternion(self.current_pose.orientation)
            rotation_traveled = abs(final_yaw - self.initial_yaw)
            expected_rotation = 0.5 * 3.0  # 0.5 rad/s * 3 seconds

            accuracy = abs(rotation_traveled - expected_rotation) / expected_rotation
            success = accuracy < 0.1  # Less than 10% error

            result = {
                'test': 'rotation',
                'rotation_traveled': rotation_traveled,
                'expected_rotation': expected_rotation,
                'accuracy': accuracy,
                'success': success
            }

            self.rotation_counter = 0  # Reset for next test
            return result

    def test_obstacle_avoidance(self):
        """Test obstacle avoidance behavior"""
        if 'obstacle_step' not in self.__dict__:
            self.obstacle_step = 0
            self.obstacle_sequence = [
                ('move_forward', 2.0),
                ('turn_right', 1.0),
                ('move_forward', 1.5),
                ('turn_left', 1.0),
                ('move_forward', 2.0)
            ]

        if self.obstacle_step < len(self.obstacle_sequence):
            action, duration = self.obstacle_sequence[self.obstacle_step]

            cmd = Twist()
            if action == 'move_forward':
                cmd.linear.x = 0.3
            elif action == 'turn_right':
                cmd.angular.z = -0.4
            elif action == 'turn_left':
                cmd.angular.z = 0.4

            self.cmd_vel_pub.publish(cmd)

            # Check if duration has passed
            if not hasattr(self, f'_{action}_start_time'):
                setattr(self, f'_{action}_start_time', time.time())

            if time.time() - getattr(self, f'_{action}_start_time') >= duration:
                self.obstacle_step += 1
                # Reset the timer for the next action
                if self.obstacle_step < len(self.obstacle_sequence):
                    next_action = self.obstacle_sequence[self.obstacle_step][0]
                    setattr(self, f'_{next_action}_start_time', time.time())

        else:
            # Test completed
            self.cmd_vel_pub.publish(Twist())  # Stop
            result = {
                'test': 'obstacle_avoidance',
                'completed': True,
                'success': True  # Assume success if sequence completed
            }
            self.obstacle_step = 0  # Reset for next test
            return result

    def test_precision_navigation(self):
        """Test precision navigation to specific waypoints"""
        # This is a simplified version - a full implementation would be more complex
        target_x, target_y = 2.0, 1.0
        tolerance = 0.1  # 10cm tolerance

        current_x = self.current_pose.position.x
        current_y = self.current_pose.position.y

        distance_to_target = math.sqrt((target_x - current_x)**2 + (target_y - current_y)**2)

        if distance_to_target > tolerance:
            # Move towards target
            cmd = Twist()
            cmd.linear.x = min(0.5, distance_to_target * 0.5)  # Proportional control
            cmd.angular.z = math.atan2(target_y - current_y, target_x - current_x) - self.get_yaw_from_quaternion(self.current_pose.orientation)
            cmd.angular.z = max(-0.5, min(0.5, cmd.angular.z))  # Limit angular velocity

            self.cmd_vel_pub.publish(cmd)
        else:
            # Reached target
            self.cmd_vel_pub.publish(Twist())  # Stop
            result = {
                'test': 'precision_navigation',
                'final_distance': distance_to_target,
                'tolerance': tolerance,
                'success': distance_to_target <= tolerance
            }
            return result

    def test_long_term_stability(self):
        """Test long-term simulation stability"""
        if 'stability_counter' not in self.__dict__:
            self.stability_counter = 0
            self.stability_start_time = time.time()

        # Run for 30 seconds
        if self.stability_counter < 300:  # 300 iterations at 0.1s = 30 seconds
            # Publish a steady command to keep robot moving gently
            cmd = Twist()
            cmd.linear.x = 0.1
            cmd.angular.z = 0.05 * math.sin(time.time() * 0.5)  # Gentle oscillation
            self.cmd_vel_pub.publish(cmd)
            self.stability_counter += 1
        else:
            # Test completed
            duration = time.time() - self.stability_start_time
            result = {
                'test': 'long_term_stability',
                'duration': duration,
                'steps_completed': self.stability_counter,
                'success': True  # Assume success if it ran without errors
            }
            self.stability_counter = 0  # Reset for next test
            self.cmd_vel_pub.publish(Twist())  # Stop
            return result

    def get_yaw_from_quaternion(self, quat):
        """Extract yaw angle from quaternion"""
        siny_cosp = 2 * (quat.w * quat.z + quat.x * quat.y)
        cosy_cosp = 1 - 2 * (quat.y * quat.y + quat.z * quat.z)
        return math.atan2(siny_cosp, cosy_cosp)

    def evaluate_test_results(self, test_name):
        """Evaluate if test passed based on results"""
        results = self.test_results[test_name]['results']
        if not results:
            return False

        # Different tests have different evaluation criteria
        if test_name == 'basic_movement':
            # Check if the last result was successful
            return results[-1]['success'] if results else False
        elif test_name == 'rotation':
            return results[-1]['success'] if results else False
        elif test_name == 'obstacle_avoidance':
            return results[-1]['success'] if results else False
        elif test_name == 'precision_navigation':
            return results[-1]['success'] if results else False
        elif test_name == 'long_term_stability':
            return results[-1]['success'] if results else False

        # Default: return True if we have results
        return len(results) > 0

    def update_performance_metrics(self):
        """Update performance metrics"""
        # This would typically interface with system monitoring tools
        # For simulation, we'll calculate based on our timers
        self.performance_metrics['loop_rate'] = 10.0  # Our timer runs at 10Hz
        self.performance_metrics['message_rate'] = len(self.test_results)  # Simplified

    def publish_test_status(self, running):
        """Publish test running status"""
        status_msg = Bool()
        status_msg.data = running
        self.test_status_pub.publish(status_msg)

    def execute_tests(self):
        """Execute tests in a separate thread"""
        # This method runs in a separate thread to handle complex test logic
        pass

    def destroy_node(self):
        """Clean up tester resources"""
        self.testing_active = False
        super().destroy_node()


def main(args=None):
    """Main function for simulation tester"""
    rclpy.init(args=args)
    tester = SimulationTester()

    try:
        rclpy.spin(tester)
    except KeyboardInterrupt:
        pass
    finally:
        tester.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Real: Physical Deployment Considerations

### Simulation-to-Reality Transfer

When transitioning from simulation to physical deployment, several factors must be considered:

```python
# File: ~/ros2_ws/src/my_robot_gazebo/my_robot_gazebo/sim2real_transfer.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy
from std_msgs.msg import String, Float32
from sensor_msgs.msg import JointState, Imu, LaserScan
from geometry_msgs.msg import Twist
from builtin_interfaces.msg import Time
import numpy as np
import math
import time
from collections import deque
import threading


class Sim2RealTransferNode(Node):
    """
    Handles the transition from simulation to real hardware
    """
    def __init__(self):
        super().__init__('sim2real_transfer')

        # QoS profiles
        sensor_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.BEST_EFFORT)
        control_qos = QoSProfile(depth=10, reliability=ReliabilityPolicy.RELIABLE)

        # Publishers
        self.sim_cmd_pub = self.create_publisher(Twist, 'sim/cmd_vel', 10)
        self.real_cmd_pub = self.create_publisher(Twist, 'real/cmd_vel', 10)
        self.transfer_metrics_pub = self.create_publisher(String, 'transfer_metrics', 10)

        # Subscribers
        self.sim_state_sub = self.create_subscription(
            JointState, 'sim/joint_states', self.sim_state_callback, sensor_qos)
        self.real_state_sub = self.create_subscription(
            JointState, 'real/joint_states', self.real_state_callback, sensor_qos)
        self.sim_scan_sub = self.create_subscription(
            LaserScan, 'sim/scan', self.sim_scan_callback, sensor_qos)
        self.real_scan_sub = self.create_subscription(
            LaserScan, 'real/scan', self.real_scan_callback, sensor_qos)

        # Transfer control
        self.transfer_mode = 'simulation'  # 'simulation', 'real', 'blended'
        self.blend_ratio = 0.0  # 0.0 = pure sim, 1.0 = pure real

        # State tracking
        self.sim_states = {}
        self.real_states = {}
        self.sim_scan = None
        self.real_scan = None

        # Transfer metrics
        self.transfer_metrics = {
            'sim_real_correlation': 0.0,
            'transfer_success_rate': 0.0,
            'domain_gap': 0.0,
            'adaptation_rate': 0.0
        }

        # Domain randomization parameters
        self.domain_randomization = {
            'texture_variance': 0.0,
            'lighting_variance': 0.0,
            'dynamics_variance': 0.0,
            'sensor_noise': 0.0
        }

        # Adaptation parameters
        self.adaptation_params = {
            'learning_rate': 0.01,
            'momentum': 0.9,
            'exploration_rate': 0.1
        }

        # Timers
        self.transfer_timer = self.create_timer(0.1, self.perform_transfer_adaptation)
        self.metrics_timer = self.create_timer(2.0, self.update_transfer_metrics)

        # Performance tracking
        self.performance_history = deque(maxlen=100)

        self.get_logger().info('Sim2Real Transfer Node initialized')

    def sim_state_callback(self, msg):
        """Process simulation state"""
        for i, name in enumerate(msg.name):
            if i < len(msg.position):
                self.sim_states[name] = {
                    'position': msg.position[i],
                    'velocity': msg.velocity[i] if i < len(msg.velocity) else 0.0
                }

    def real_state_callback(self, msg):
        """Process real robot state"""
        for i, name in enumerate(msg.name):
            if i < len(msg.position):
                self.real_states[name] = {
                    'position': msg.position[i],
                    'velocity': msg.velocity[i] if i < len(msg.velocity) else 0.0
                }

    def sim_scan_callback(self, msg):
        """Process simulation scan"""
        self.sim_scan = msg

    def real_scan_callback(self, msg):
        """Process real robot scan"""
        self.real_scan = msg

    def perform_transfer_adaptation(self):
        """Perform sim-to-real adaptation"""
        if not (self.sim_states and self.real_states):
            return

        # Calculate state differences (domain gap)
        state_diffs = []
        for joint_name in self.sim_states:
            if joint_name in self.real_states:
                sim_pos = self.sim_states[joint_name]['position']
                real_pos = self.real_states[joint_name]['position']
                diff = abs(sim_pos - real_pos)
                state_diffs.append(diff)

        if state_diffs:
            avg_state_diff = np.mean(state_diffs)
            self.transfer_metrics['domain_gap'] = avg_state_diff

        # Perform domain adaptation if needed
        if self.transfer_metrics['domain_gap'] > 0.1:  # Threshold for adaptation
            self.adapt_domain()

    def adapt_domain(self):
        """Adapt simulation to better match reality"""
        # Update domain randomization parameters based on real-world observations
        # This is a simplified example - real implementations would use ML techniques

        # Increase sensor noise to match real sensor characteristics
        self.domain_randomization['sensor_noise'] = min(
            0.1, self.domain_randomization['sensor_noise'] + 0.001
        )

        # Adjust dynamics to match real robot behavior
        self.domain_randomization['dynamics_variance'] = min(
            0.2, self.domain_randomization['dynamics_variance'] + 0.001
        )

        self.get_logger().info(
            f'Domain adaptation: noise={self.domain_randomization["sensor_noise"]:.3f}, '
            f'dynamics={self.domain_randomization["dynamics_variance"]:.3f}'
        )

    def update_transfer_metrics(self):
        """Update transfer metrics"""
        if not (self.sim_scan and self.real_scan):
            return

        # Calculate similarity between sim and real scans
        if len(self.sim_scan.ranges) == len(self.real_scan.ranges):
            sim_ranges = np.array(self.sim_scan.ranges)
            real_ranges = np.array(self.real_scan.ranges)

            # Filter out invalid ranges
            valid_sim = ~np.isnan(sim_ranges) & ~np.isinf(sim_ranges)
            valid_real = ~np.isnan(real_ranges) & ~np.isinf(real_ranges)
            valid_mask = valid_sim & valid_real

            if np.any(valid_mask):
                # Calculate correlation between valid ranges
                sim_valid = sim_ranges[valid_mask]
                real_valid = real_ranges[valid_mask]

                # Normalize ranges for comparison
                sim_norm = (sim_valid - np.min(sim_valid)) / (np.max(sim_valid) - np.min(sim_valid) + 1e-6)
                real_norm = (real_valid - np.min(real_valid)) / (np.max(real_valid) - np.min(real_valid) + 1e-6)

                correlation = np.corrcoef(sim_norm, real_norm)[0, 1]
                if not np.isnan(correlation):
                    self.transfer_metrics['sim_real_correlation'] = correlation

        # Log metrics
        metrics_str = (
            f"Correlation: {self.transfer_metrics['sim_real_correlation']:.3f}, "
            f"Domain Gap: {self.transfer_metrics['domain_gap']:.3f}"
        )
        self.get_logger().info(f'Transfer metrics: {metrics_str}')

        # Publish metrics
        metrics_msg = String()
        metrics_msg.data = metrics_str
        self.transfer_metrics_pub.publish(metrics_msg)

        # Store for performance history
        self.performance_history.append({
            'timestamp': time.time(),
            'correlation': self.transfer_metrics['sim_real_correlation'],
            'domain_gap': self.transfer_metrics['domain_gap']
        })

    def calculate_reward_shaping(self, sim_reward, real_observation):
        """
        Shape rewards to account for sim-to-real differences
        """
        # This function would implement reward shaping techniques to account for
        # differences between simulation and reality
        shaped_reward = sim_reward

        # Example: adjust for sensor differences
        if self.transfer_metrics['domain_gap'] > 0.1:
            # Reduce reward confidence when domain gap is large
            confidence_factor = max(0.1, 1.0 - self.transfer_metrics['domain_gap'])
            shaped_reward *= confidence_factor

        return shaped_reward

    def get_action_mapping(self, sim_action):
        """
        Map simulation actions to real robot actions considering hardware constraints
        """
        # This function would map simulation actions to real hardware capabilities
        # considering differences in dynamics, sensor noise, and actuator limitations
        real_action = Twist()

        # Example mapping with safety limits
        real_action.linear.x = max(-0.5, min(0.5, sim_action.linear.x * 0.9))  # Apply scaling factor
        real_action.angular.z = max(-0.8, min(0.8, sim_action.angular.z * 0.9))

        return real_action

    def blend_sim_real_commands(self, sim_cmd, real_cmd):
        """
        Blend simulation and real commands based on transfer confidence
        """
        blended_cmd = Twist()

        # Use blend ratio to interpolate between sim and real commands
        blend = self.blend_ratio
        blended_cmd.linear.x = sim_cmd.linear.x * (1 - blend) + real_cmd.linear.x * blend
        blended_cmd.angular.z = sim_cmd.angular.z * (1 - blend) + real_cmd.angular.z * blend

        return blended_cmd

    def evaluate_transfer_success(self):
        """
        Evaluate the success of the sim-to-real transfer
        """
        # This would implement evaluation metrics for transfer success
        # Such as task completion rate, performance degradation, etc.
        if not self.performance_history:
            return 0.0

        # Calculate average correlation over recent history
        recent_correlations = [entry['correlation'] for entry in self.performance_history]
        avg_correlation = np.mean(recent_correlations) if recent_correlations else 0.0

        return max(0.0, avg_correlation)  # Ensure non-negative

    def destroy_node(self):
        """Clean up transfer resources"""
        super().destroy_node()


def main(args=None):
    """Main function for sim-to-real transfer"""
    rclpy.init(args=args)
    transfer_node = Sim2RealTransferNode()

    try:
        rclpy.spin(transfer_node)
    except KeyboardInterrupt:
        pass
    finally:
        transfer_node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Exercises and Practical Applications

### Exercise 1: Basic Digital Twin Setup
Create a complete digital twin simulation environment for a simple differential drive robot, including URDF model, Gazebo plugins, and launch files.

### Exercise 2: Sensor Simulation
Implement realistic sensor simulation for cameras, LiDAR, and IMU sensors, including noise models and realistic sensor limitations.

### Exercise 3: Control System Integration
Integrate a control system that operates both in simulation and can be transferred to real hardware with appropriate adaptation.

### Exercise 4: Performance Optimization
Optimize your simulation for real-time performance, including resource management and efficient data processing.

## Troubleshooting Common Issues

### Simulation Instability
- **Physics Parameters**: Adjust ERP, CFM, and constraint parameters
- **Timing Issues**: Ensure consistent update rates
- **Numerical Issues**: Check for singularities in kinematic chains

### Sensor Discrepancies
- **Noise Models**: Implement realistic noise models
- **Latency**: Account for sensor processing delays
- ** انشانکن **: باقاعدگی سے تخروپن کے پیرامیٹرز کیلیبریٹ کریں

### منتقلی کی ناکامی
- ** ڈومین گیپ **: ڈومین بے ترتیب تکنیک کو نافذ کریں
- ** حرکیات مماثلت **: ٹھیک ٹون جسمانی پیرامیٹرز
- ** کنٹرول اختلافات **: ہارڈ ویئر کی حدود کے لئے کنٹرول کی حکمت عملی کو اپنائیں

## خلاصہ

اس باب میں بنیادی تخروپن سیٹ اپ سے لے کر جدید سم سے حقیقی منتقلی کی تکنیک تک ، آر او ایس 2 میں ڈیجیٹل جڑواں تخروپن کے ضروری تصورات کا احاطہ کیا گیا ہے۔ تھیوری → تخروپن → حقیقی نقطہ نظر اس بات کو یقینی بناتا ہے کہ ڈیجیٹل جڑواں تصورات کو پہلے نظریاتی طور پر سمجھا جاتا ہے ، پھر ان کو نقلی شکل میں نافذ کیا جاتا ہے اور اس کا تجربہ کیا جاتا ہے ، اور آخر کار جسمانی تعیناتی کے لئے توثیق کیا جاتا ہے۔

کلیدی عنوانات کا احاطہ کیا گیا ہے:
- ڈیجیٹل جڑواں فن تعمیر اور اصول
- گیزبو کے ساتھ نقلی ماحول کا سیٹ اپ
- سینسر اور ایکٹیویٹر ماڈلنگ
- سم اور اصلی کے مابین ریاست کی ہم آہنگی
- ریئل ٹائم تخروپن کے لئے کارکردگی کی اصلاح
-سم سے حقیقی منتقلی کے طریقہ کار

ڈیجیٹل جڑواں تخروپن جدید روبوٹکس ڈویلپمنٹ کا ایک اہم جزو ہے ، جو جسمانی تعیناتی سے پہلے پیچیدہ روبوٹک نظاموں کی محفوظ ، لاگت سے موثر اور موثر ترقی کو قابل بناتا ہے۔

::: ٹپ
جب ممکن ہو تو حقیقی دنیا کے اعداد و شمار کے خلاف اپنے نقلی نتائج کو ہمیشہ توثیق کریں۔ مقصد یہ ہے کہ کمپیوٹیشنل کارکردگی کو برقرار رکھتے ہوئے سم سے حقیقی فرق کو کم سے کم کیا جائے۔
:::

::: احتیاط
حفاظتی اہم ایپلی کیشنز کے لئے تخروپن کا استعمال کرتے وقت ، اس بات کو یقینی بنائیں کہ آپ کا نقالی بدترین صورتحال اور حفاظت کے مارجن کی مناسب نمائندگی کرتا ہے۔ تخروپن جسمانی جانچ کی تکمیل ، تبدیل نہیں کرنا چاہئے۔
:::