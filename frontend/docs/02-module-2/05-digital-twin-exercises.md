---
title: "Digital Twin Exercises"
slug: "/module-2/digital-twin-exercises"
sidebar_position: 6
---

# Digital Twin Exercises

## Learning Objectives

By completing these exercises, students will be able to:
- Integrate physics simulation, rendering, and sensor modeling into cohesive digital twin environments
- Validate digital twin accuracy by comparing simulation results with expected behaviors
- Implement multi-sensor fusion techniques in digital twin environments
- Optimize digital twin performance for real-time applications
- Apply sim-to-real transfer techniques to bridge the reality gap

## Theory Section

### Digital Twin Architecture

A digital twin in robotics consists of three fundamental components that must work together seamlessly:

**Physics Simulation Layer**: The foundation that models the physical behavior of the robot and its environment, including dynamics, collisions, and environmental forces.

**Sensor Simulation Layer**: The perception system that models how the robot's sensors interact with the environment, including noise, accuracy, and limitations.

**Rendering Layer**: The visualization system that provides human-understandable representation of the robot and environment for monitoring and interaction.

### Integration Challenges

Creating effective digital twins requires addressing several integration challenges:

**Synchronization**: All components must operate in sync to maintain consistency between the virtual and physical systems.

**Calibration**: Parameters must be accurately calibrated to match real-world behavior.

**Validation**: The digital twin must be validated against real-world data to ensure accuracy.

**Performance**: The system must operate in real-time to be useful for development and testing.

## Digital Twin Lab (Simulation)

### Exercise 1: Complete Digital Twin Environment

Create a complete digital twin environment that integrates physics, sensors, and rendering. This exercise will combine all the concepts learned in this module.

First, let's create a launch file that brings together all components:

```xml
<!-- digital_twin_complete.launch.xml -->
<launch>
  <!-- Launch Gazebo with our custom world -->
  <include file="$(find gazebo_ros)/launch/gazebo.launch.py">
    <arg name="world" value="$(find my_robot_simulation)/worlds/digital_twin_world.sdf"/>
    <arg name="gui" value="true"/>
    <arg name="verbose" value="false"/>
  </include>

  <!-- Launch robot state publisher -->
  <node pkg="robot_state_publisher" exec="robot_state_publisher" name="robot_state_publisher">
    <param name="robot_description" value="$(var robot_description)"/>
  </node>

  <!-- Launch joint state publisher -->
  <node pkg="joint_state_publisher" exec="joint_state_publisher" name="joint_state_publisher"/>

  <!-- Launch our custom sensors -->
  <node pkg="my_robot_simulation" exec="imu_simulator.py" name="imu_simulator"/>
  <node pkg="my_robot_simulation" exec="lidar_simulator.py" name="lidar_simulator"/>
  <node pkg="my_robot_simulation" exec="realsense_simulator.py" name="realsense_simulator"/>

  <!-- Launch sensor fusion node -->
  <node pkg="my_robot_simulation" exec="sensor_fusion.py" name="sensor_fusion"/>

  <!-- Launch digital twin validator -->
  <node pkg="my_robot_simulation" exec="digital_twin_validator.py" name="digital_twin_validator"/>
</launch>
```

Now, let's create a comprehensive digital twin validator that checks the integration of all components:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu, LaserScan, Image, PointCloud2
from nav_msgs.msg import Odometry
from geometry_msgs.msg import PoseStamped, Twist
from std_msgs.msg import Float64MultiArray, String
from visualization_msgs.msg import Marker, MarkerArray
import numpy as np
import math
from scipy.spatial.transform import Rotation as R
from collections import deque
import time

class DigitalTwinValidator(Node):
    def __init__(self):
        super().__init__('digital_twin_validator')

        # Publishers
        self.validation_score_pub = self.create_publisher(Float64MultiArray, '/digital_twin/validation_scores', 10)
        self.status_pub = self.create_publisher(String, '/digital_twin/status', 10)
        self.marker_pub = self.create_publisher(MarkerArray, '/digital_twin/visualization', 10)

        # Subscribers for all sensor types
        self.imu_sub = self.create_subscription(Imu, '/imu/data', self.imu_callback, 10)
        self.scan_sub = self.create_subscription(LaserScan, '/scan', self.scan_callback, 10)
        self.depth_sub = self.create_subscription(Image, '/camera/depth/image_raw', self.depth_callback, 10)
        self.odom_sub = self.create_subscription(Odometry, '/odom', self.odom_callback, 10)

        # Timer for validation
        self.validation_timer = self.create_timer(0.5, self.validate_digital_twin)

        # Data buffers
        self.imu_buffer = deque(maxlen=20)
        self.scan_buffer = deque(maxlen=10)
        self.depth_buffer = deque(maxlen=10)
        self.odom_buffer = deque(maxlen=20)

        # Validation thresholds
        self.imu_consistency_threshold = 0.9
        self.scan_consistency_threshold = 0.85
        self.odom_consistency_threshold = 0.95

        # Validation metrics
        self.validation_metrics = {
            'imu_health': 1.0,
            'scan_health': 1.0,
            'depth_health': 1.0,
            'odom_health': 1.0,
            'integration_health': 1.0
        }

        # Visualization markers
        self.marker_id = 0

        self.get_logger().info('Digital Twin Validator initialized')

    def imu_callback(self, msg):
        """Process IMU data"""
        self.imu_buffer.append({
            'timestamp': msg.header.stamp,
            'orientation': [msg.orientation.x, msg.orientation.y, msg.orientation.z, msg.orientation.w],
            'angular_velocity': [msg.angular_velocity.x, msg.angular_velocity.y, msg.angular_velocity.z],
            'linear_acceleration': [msg.linear_acceleration.x, msg.linear_acceleration.y, msg.linear_acceleration.z]
        })

    def scan_callback(self, msg):
        """Process LiDAR data"""
        self.scan_buffer.append({
            'timestamp': msg.header.stamp,
            'ranges': list(msg.ranges),
            'intensities': list(msg.intensities),
            'angle_min': msg.angle_min,
            'angle_max': msg.angle_max,
            'angle_increment': msg.angle_increment
        })

    def depth_callback(self, msg):
        """Process depth camera data"""
        self.depth_buffer.append({
            'timestamp': msg.header.stamp,
            'height': msg.height,
            'width': msg.width,
            'encoding': msg.encoding
        })

    def odom_callback(self, msg):
        """Process odometry data"""
        self.odom_buffer.append({
            'timestamp': msg.header.stamp,
            'position': [msg.pose.pose.position.x, msg.pose.pose.position.y, msg.pose.pose.position.z],
            'orientation': [msg.pose.pose.orientation.x, msg.pose.pose.orientation.y, msg.pose.pose.orientation.z, msg.pose.pose.orientation.w],
            'linear_velocity': [msg.twist.twist.linear.x, msg.twist.twist.linear.y, msg.twist.twist.linear.z],
            'angular_velocity': [msg.twist.twist.angular.x, msg.twist.twist.angular.y, msg.twist.twist.angular.z]
        })

    def validate_digital_twin(self):
        """Perform comprehensive digital twin validation"""
        # Validate individual components
        self.validate_imu_data()
        self.validate_scan_data()
        self.validate_depth_data()
        self.validate_odom_data()

        # Validate integration between components
        self.validate_integration()

        # Publish validation scores
        self.publish_validation_scores()

        # Publish status
        self.publish_status()

        # Publish visualization
        self.publish_visualization()

    def validate_imu_data(self):
        """Validate IMU data quality and consistency"""
        if len(self.imu_buffer) < 5:
            self.validation_metrics['imu_health'] = 0.0
            return

        # Check for consistency in measurements
        angular_velocities = []
        linear_accelerations = []

        for imu_data in self.imu_buffer:
            ang_vel = imu_data['angular_velocity']
            lin_acc = imu_data['linear_acceleration']
            angular_velocities.append(np.linalg.norm(ang_vel))
            linear_accelerations.append(np.linalg.norm(lin_acc))

        # Calculate consistency (lower variance indicates more consistent data)
        if len(angular_velocities) > 1:
            ang_vel_variance = np.var(angular_velocities)
            # Convert variance to a health score (lower variance = higher health)
            ang_health = max(0.0, 1.0 - ang_vel_variance)
        else:
            ang_health = 1.0

        if len(linear_accelerations) > 1:
            lin_acc_variance = np.var(linear_accelerations)
            lin_health = max(0.0, 1.0 - lin_acc_variance)
        else:
            lin_health = 1.0

        # Combine scores
        self.validation_metrics['imu_health'] = (ang_health + lin_health) / 2.0

    def validate_scan_data(self):
        """Validate LiDAR scan data quality"""
        if len(self.scan_buffer) < 3:
            self.validation_metrics['scan_health'] = 0.0
            return

        # Check for reasonable range values
        recent_scans = list(self.scan_buffer)
        total_ranges = 0
        valid_ranges = 0

        for scan in recent_scans:
            total_ranges += len(scan['ranges'])
            for r in scan['ranges']:
                if 0.1 <= r <= 10.0:  # Reasonable range
                    valid_ranges += 1

        if total_ranges > 0:
            valid_ratio = valid_ranges / total_ranges
            self.validation_metrics['scan_health'] = valid_ratio
        else:
            self.validation_metrics['scan_health'] = 0.0

    def validate_depth_data(self):
        """Validate depth camera data quality"""
        if len(self.depth_buffer) < 3:
            self.validation_metrics['depth_health'] = 0.0
            return

        # Check for consistent image dimensions
        widths = [d['width'] for d in self.depth_buffer]
        heights = [d['height'] for d in self.depth_buffer]

        width_consistent = len(set(widths)) == 1
        height_consistent = len(set(heights)) == 1

        if width_consistent and height_consistent:
            self.validation_metrics['depth_health'] = 1.0
        else:
            self.validation_metrics['depth_health'] = 0.5  # Partial credit for partial consistency

    def validate_odom_data(self):
        """Validate odometry data consistency"""
        if len(self.odom_buffer) < 5:
            self.validation_metrics['odom_health'] = 0.0
            return

        # Check for reasonable velocity values
        velocities = []
        positions = []

        for odom_data in self.odom_buffer:
            vel = odom_data['linear_velocity']
            pos = odom_data['position']
            velocities.append(np.linalg.norm(vel))
            positions.append(np.array(pos))

        # Calculate average velocity
        avg_velocity = np.mean(velocities) if velocities else 0.0

        # Check if velocity is reasonable (not too high, not stuck)
        if 0.01 <= avg_velocity <= 2.0:  # Reasonable range for most robots
            vel_health = 1.0
        elif avg_velocity == 0.0:
            # Robot might be stationary, which is okay
            vel_health = 0.8
        else:
            # Too fast
            vel_health = 0.3

        # Check position consistency
        if len(positions) > 1:
            pos_changes = []
            for i in range(1, len(positions)):
                change = np.linalg.norm(positions[i] - positions[i-1])
                pos_changes.append(change)

            avg_change = np.mean(pos_changes) if pos_changes else 0.0
            if avg_change < 10.0:  # Reasonable position changes
                pos_health = 1.0
            else:
                pos_health = 0.2  # Large jumps might indicate errors
        else:
            pos_health = 1.0

        self.validation_metrics['odom_health'] = (vel_health + pos_health) / 2.0

    def validate_integration(self):
        """Validate integration between different sensor systems"""
        # Check if all sensors are publishing data consistently
        if (len(self.imu_buffer) > 0 and
            len(self.scan_buffer) > 0 and
            len(self.depth_buffer) > 0 and
            len(self.odom_buffer) > 0):

            # Calculate integration health based on how well components work together
            avg_health = np.mean(list(self.validation_metrics.values()))
            self.validation_metrics['integration_health'] = avg_health
        else:
            self.validation_metrics['integration_health'] = 0.0

    def publish_validation_scores(self):
        """Publish validation scores"""
        scores_msg = Float64MultiArray()
        scores_msg.data = [
            self.validation_metrics['imu_health'],
            self.validation_metrics['scan_health'],
            self.validation_metrics['depth_health'],
            self.validation_metrics['odom_health'],
            self.validation_metrics['integration_health']
        ]
        self.validation_score_pub.publish(scores_msg)

    def publish_status(self):
        """Publish overall system status"""
        status_msg = String()

        avg_health = np.mean(list(self.validation_metrics.values()))

        if avg_health > 0.9:
            status_msg.data = "OPTIMAL"
        elif avg_health > 0.7:
            status_msg.data = "GOOD"
        elif avg_health > 0.5:
            status_msg.data = "FAIR"
        else:
            status_msg.data = "POOR"

        self.status_pub.publish(status_msg)

    def publish_visualization(self):
        """Publish visualization markers for digital twin state"""
        marker_array = MarkerArray()

        # Create markers for each validation metric
        for i, (metric_name, score) in enumerate(self.validation_metrics.items()):
            marker = Marker()
            marker.header.frame_id = "map"
            marker.header.stamp = self.get_clock().now().to_msg()
            marker.ns = "digital_twin_validation"
            marker.id = self.marker_id
            self.marker_id += 1
            marker.type = Marker.TEXT_VIEW_FACING
            marker.action = Marker.ADD

            # Position markers in a row
            marker.pose.position.x = i * 2.0
            marker.pose.position.y = 0.0
            marker.pose.position.z = 1.0

            marker.pose.orientation.x = 0.0
            marker.pose.orientation.y = 0.0
            marker.pose.orientation.z = 0.0
            marker.pose.orientation.w = 1.0

            marker.scale.z = 0.3  # Text scale

            # Color based on score
            marker.color.r = 1.0 - score  # Red for low scores
            marker.color.g = score  # Green for high scores
            marker.color.b = 0.0
            marker.color.a = 1.0

            marker.text = f"{metric_name}: {score:.2f}"

            marker_array.markers.append(marker)

        self.marker_pub.publish(marker_array)

def main(args=None):
    rclpy.init(args=args)
    validator = DigitalTwinValidator()

    try:
        rclpy.spin(validator)
    except KeyboardInterrupt:
        validator.get_logger().info('Shutting down digital twin validator')
    finally:
        validator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Exercise 2: Physics-Sensor Integration

Create a physics-aware sensor simulator that adjusts sensor behavior based on physical conditions:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, Imu, JointState
from geometry_msgs.msg import Twist
from nav_msgs.msg import Odometry
from std_msgs.msg import Float64
import numpy as np
import math
from collections import deque

class PhysicsAwareSensorSimulator(Node):
    def __init__(self):
        super().__init__('physics_aware_sensor_simulator')

        # Publishers
        self.scan_pub = self.create_publisher(LaserScan, '/scan', 10)
        self.imu_pub = self.create_publisher(Imu, '/imu/data', 10)
        self.odom_pub = self.create_publisher(Odometry, '/odom', 10)

        # Subscribers
        self.cmd_vel_sub = self.create_subscription(Twist, '/cmd_vel', self.cmd_vel_callback, 10)

        # Timer for sensor updates
        self.timer = self.create_timer(0.05, self.update_physics_aware_sensors)  # 20 Hz

        # Physics state
        self.position = np.array([0.0, 0.0, 0.0])  # x, y, theta
        self.velocity = np.array([0.0, 0.0, 0.0])  # vx, vy, omega
        self.acceleration = np.array([0.0, 0.0, 0.0])
        self.cmd_vel = np.array([0.0, 0.0])  # linear, angular

        # Robot physical parameters
        self.wheel_radius = 0.05  # meters
        self.wheel_base = 0.3  # meters
        self.robot_mass = 10.0  # kg
        self.robot_inertia = 0.5  # kg*m^2

        # Sensor parameters that change with physics state
        self.base_scan_noise = 0.02  # base noise level
        self.velocity_scan_noise_factor = 0.01  # noise increases with velocity
        self.acceleration_scan_noise_factor = 0.02  # noise increases with acceleration

        # Initialize
        self.time = 0.0

        self.get_logger().info('Physics-Aware Sensor Simulator initialized')

    def cmd_vel_callback(self, msg):
        """Process velocity commands"""
        self.cmd_vel = np.array([msg.linear.x, msg.angular.z])

    def update_physics_aware_sensors(self):
        """Update sensors based on physics state"""
        # Update physics
        self.update_physics()

        # Generate physics-aware sensor data
        self.publish_physics_aware_scan()
        self.publish_physics_aware_imu()
        self.publish_odometry()

        # Update time
        self.time += 0.05

    def update_physics(self):
        """Update robot physics based on commands"""
        dt = 0.05  # time step

        # Simple differential drive kinematics
        v_linear = self.cmd_vel[0]
        v_angular = self.cmd_vel[1]

        # Update velocities based on commands (with some dynamics)
        target_vx = v_linear * math.cos(self.position[2])
        target_vy = v_linear * math.sin(self.position[2])
        target_omega = v_angular

        # Apply first-order dynamics (with time constant)
        tau = 0.1  # time constant
        self.velocity[0] += (target_vx - self.velocity[0]) * dt / tau
        self.velocity[1] += (target_vy - self.velocity[1]) * dt / tau
        self.velocity[2] += (target_omega - self.velocity[2]) * dt / tau

        # Calculate accelerations
        self.acceleration = (self.velocity - np.array([target_vx, target_vy, target_omega])) / tau

        # Update positions
        self.position[0] += self.velocity[0] * dt
        self.position[1] += self.velocity[1] * dt
        self.position[2] += self.velocity[2] * dt

        # Normalize angle
        self.position[2] = math.atan2(math.sin(self.position[2]), math.cos(self.position[2]))

    def publish_physics_aware_scan(self):
        """Publish LiDAR scan with physics-aware noise"""
        # Calculate noise level based on current physics state
        speed = np.linalg.norm(self.velocity[:2])
        accel_magnitude = np.linalg.norm(self.acceleration)

        # Dynamic noise based on motion
        dynamic_noise = (speed * self.velocity_scan_noise_factor +
                        accel_magnitude * self.acceleration_scan_noise_factor)
        total_noise = self.base_scan_noise + dynamic_noise

        # Generate scan with motion-aware noise
        num_points = 360
        angle_increment = 2 * math.pi / num_points
        ranges = []

        for i in range(num_points):
            angle = i * angle_increment

            # Simulate environment (simple room with obstacles)
            distance = self.calculate_environment_distance(angle)

            # Add physics-aware noise
            noise = np.random.normal(0, total_noise)
            noisy_distance = max(0.1, min(10.0, distance + noise))
            ranges.append(noisy_distance)

        # Create and publish LaserScan
        scan_msg = LaserScan()
        scan_msg.header.stamp = self.get_clock().now().to_msg()
        scan_msg.header.frame_id = 'laser_frame'
        scan_msg.angle_min = 0.0
        scan_msg.angle_max = 2 * math.pi
        scan_msg.angle_increment = angle_increment
        scan_msg.time_increment = 0.0
        scan_msg.scan_time = 0.05
        scan_msg.range_min = 0.1
        scan_msg.range_max = 10.0
        scan_msg.ranges = ranges

        self.scan_pub.publish(scan_msg)

    def calculate_environment_distance(self, angle):
        """Calculate distance to obstacle at given angle"""
        # Simple environment: 5m x 5m room with some obstacles
        robot_x, robot_y = self.position[0], self.position[1]

        # Calculate room boundaries
        room_half_size = 2.5
        dist_right = (room_half_size - robot_x) / math.cos(angle) if math.cos(angle) > 0.001 else float('inf')
        dist_left = (robot_x + room_half_size) / -math.cos(angle) if math.cos(angle) < -0.001 else float('inf')
        dist_front = (room_half_size - robot_y) / math.sin(angle) if math.sin(angle) > 0.001 else float('inf')
        dist_back = (robot_y + room_half_size) / -math.sin(angle) if math.sin(angle) < -0.001 else float('inf')

        wall_distance = min(d for d in [dist_right, dist_left, dist_front, dist_back] if d > 0)

        # Add some moving obstacles that respond to robot motion
        obstacles = [
            {'x': 1.0 + 0.5 * math.sin(0.5 * self.time), 'y': 0.5, 'radius': 0.3},
            {'x': -1.0, 'y': -1.0 + 0.3 * math.cos(0.3 * self.time), 'radius': 0.4}
        ]

        min_obstacle_distance = float('inf')
        for obs in obstacles:
            dx = obs['x'] - robot_x
            dy = obs['y'] - robot_y
            center_dist = math.sqrt(dx*dx + dy*dy)
            obstacle_dist = center_dist - obs['radius']

            if obstacle_dist > 0:
                obs_angle = math.atan2(dy, dx)
                angle_diff = abs(angle - obs_angle)
                if angle_diff < math.pi / 3:  # 60-degree sector
                    min_obstacle_distance = min(min_obstacle_distance, obstacle_dist)

        return min(wall_distance, min_obstacle_distance)

    def publish_physics_aware_imu(self):
        """Publish IMU data with physics-aware characteristics"""
        imu_msg = Imu()
        imu_msg.header.stamp = self.get_clock().now().to_msg()
        imu_msg.header.frame_id = 'imu_link'

        # Set orientation (from robot pose)
        from scipy.spatial.transform import Rotation as R
        r = R.from_euler('z', self.position[2])
        quat = r.as_quat()
        imu_msg.orientation.x = quat[0]
        imu_msg.orientation.y = quat[1]
        imu_msg.orientation.z = quat[2]
        imu_msg.orientation.w = quat[3]

        # Set angular velocity (from robot motion)
        imu_msg.angular_velocity.z = float(self.velocity[2])  # yaw rate

        # Set linear acceleration (from physics)
        imu_msg.linear_acceleration.x = float(self.acceleration[0])
        imu_msg.linear_acceleration.y = float(self.acceleration[1])
        imu_msg.linear_acceleration.z = 9.81 + float(self.acceleration[2])  # include gravity

        # Add noise based on motion
        motion_intensity = np.linalg.norm(self.velocity)
        noise_factor = 0.01 + 0.005 * motion_intensity

        # Add noise to measurements
        imu_msg.angular_velocity.x += np.random.normal(0, noise_factor)
        imu_msg.angular_velocity.y += np.random.normal(0, noise_factor)
        imu_msg.angular_velocity.z += np.random.normal(0, noise_factor)

        imu_msg.linear_acceleration.x += np.random.normal(0, noise_factor)
        imu_msg.linear_acceleration.y += np.random.normal(0, noise_factor)
        imu_msg.linear_acceleration.z += np.random.normal(0, noise_factor)

        # Set covariance
        imu_msg.orientation_covariance = [0.01] * 9
        imu_msg.angular_velocity_covariance = [0.01] * 9
        imu_msg.linear_acceleration_covariance = [0.01] * 9

        self.imu_pub.publish(imu_msg)

    def publish_odometry(self):
        """Publish odometry based on physics simulation"""
        odom_msg = Odometry()
        odom_msg.header.stamp = self.get_clock().now().to_msg()
        odom_msg.header.frame_id = 'odom'
        odom_msg.child_frame_id = 'base_link'

        # Set position
        odom_msg.pose.pose.position.x = float(self.position[0])
        odom_msg.pose.pose.position.y = float(self.position[1])
        odom_msg.pose.pose.position.z = 0.0

        # Set orientation
        r = R.from_euler('z', self.position[2])
        quat = r.as_quat()
        odom_msg.pose.pose.orientation.x = quat[0]
        odom_msg.pose.pose.orientation.y = quat[1]
        odom_msg.pose.pose.orientation.z = quat[2]
        odom_msg.pose.pose.orientation.w = quat[3]

        # Set velocities
        odom_msg.twist.twist.linear.x = float(self.velocity[0])
        odom_msg.twist.twist.linear.y = float(self.velocity[1])
        odom_msg.twist.twist.angular.z = float(self.velocity[2])

        self.odom_pub.publish(odom_msg)

def main(args=None):
    rclpy.init(args=args)
    simulator = PhysicsAwareSensorSimulator()

    try:
        rclpy.spin(simulator)
    except KeyboardInterrupt:
        simulator.get_logger().info('Shutting down physics-aware simulator')
    finally:
        simulator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Exercise 3: Multi-Sensor Fusion and Environment Mapping

Create a comprehensive system that fuses multiple sensors to build a consistent environment map:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, Image, PointCloud2
from geometry_msgs.msg import PointStamped, PoseStamped
from nav_msgs.msg import OccupancyGrid
from std_msgs.msg import Header
from visualization_msgs.msg import Marker, MarkerArray
import numpy as np
import math
from sensor_msgs_py import point_cloud2
from cv_bridge import CvBridge
from collections import deque
import threading

class MultiSensorFusionMapper(Node):
    def __init__(self):
        super().__init__('multi_sensor_fusion_mapper')

        # Publishers
        self.map_pub = self.create_publisher(OccupancyGrid, '/map', 5)
        self.fused_cloud_pub = self.create_publisher(PointCloud2, '/fused_cloud', 5)
        self.visualization_pub = self.create_publisher(MarkerArray, '/map_visualization', 5)

        # Subscribers
        self.scan_sub = self.create_subscription(LaserScan, '/scan', self.scan_callback, 10)
        self.depth_sub = self.create_subscription(Image, '/camera/depth/image_raw', self.depth_callback, 10)
        self.odom_sub = self.create_subscription(PoseStamped, '/pose', self.pose_callback, 10)

        # Timer for map updates
        self.map_timer = self.create_timer(0.5, self.update_fused_map)

        # CV Bridge
        self.bridge = CvBridge()

        # Map parameters
        self.map_width = 200  # cells
        self.map_height = 200  # cells
        self.map_resolution = 0.1  # meters per cell
        self.map_origin_x = -10.0  # meters
        self.map_origin_y = -10.0  # meters

        # Initialize occupancy grid
        self.occupancy_grid = np.full((self.map_height, self.map_width), -1, dtype=np.int8)  # -1 = unknown

        # Sensor data buffers
        self.scan_buffer = deque(maxlen=5)
        self.depth_buffer = deque(maxlen=5)
        self.pose_buffer = deque(maxlen=5)

        # Fusion parameters
        self.lidar_influence = 0.8
        self.depth_influence = 0.6
        self.temporal_decay = 0.99

        # Threading lock for map updates
        self.map_lock = threading.Lock()

        self.get_logger().info('Multi-Sensor Fusion Mapper initialized')

    def scan_callback(self, msg):
        """Process LiDAR scan data"""
        with self.map_lock:
            self.scan_buffer.append({
                'timestamp': msg.header.stamp,
                'ranges': list(msg.ranges),
                'angle_min': msg.angle_min,
                'angle_increment': msg.angle_increment,
                'pose': self.get_current_pose()
            })

    def depth_callback(self, msg):
        """Process depth camera data"""
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='16UC1')
            with self.map_lock:
                self.depth_buffer.append({
                    'timestamp': msg.header.stamp,
                    'image': cv_image,
                    'pose': self.get_current_pose()
                })
        except Exception as e:
            self.get_logger().error(f'Depth callback error: {e}')

    def pose_callback(self, msg):
        """Process pose data"""
        with self.map_lock:
            self.pose_buffer.append({
                'timestamp': msg.header.stamp,
                'x': msg.pose.position.x,
                'y': msg.pose.position.y,
                'theta': self.quaternion_to_yaw(msg.pose.orientation)
            })

    def get_current_pose(self):
        """Get the most recent pose from buffer"""
        if self.pose_buffer:
            return self.pose_buffer[-1]
        else:
            return {'x': 0.0, 'y': 0.0, 'theta': 0.0}

    def quaternion_to_yaw(self, quat):
        """Convert quaternion to yaw angle"""
        import math
        siny_cosp = 2 * (quat.w * quat.z + quat.x * quat.y)
        cosy_cosp = 1 - 2 * (quat.y * quat.y + quat.z * quat.z)
        return math.atan2(siny_cosp, cosy_cosp)

    def update_fused_map(self):
        """Update the fused occupancy grid"""
        with self.map_lock:
            # Process LiDAR data
            self.process_scan_data()

            # Process depth camera data
            self.process_depth_data()

            # Apply temporal decay to reduce old information
            self.apply_temporal_decay()

            # Publish updated map
            self.publish_map()

            # Publish visualization
            self.publish_visualization()

    def process_scan_data(self):
        """Process LiDAR scans to update occupancy grid"""
        if not self.scan_buffer:
            return

        for scan_data in self.scan_buffer:
            pose = scan_data['pose']
            ranges = scan_data['ranges']
            angle_min = scan_data['angle_min']
            angle_increment = scan_data['angle_increment']

            robot_map_x = self.world_to_map_x(pose['x'])
            robot_map_y = self.world_to_map_y(pose['y'])

            for i, r in enumerate(ranges):
                if 0.1 <= r <= 10.0:  # Valid range
                    angle = angle_min + i * angle_increment + pose['theta']
                    world_x = pose['x'] + r * math.cos(angle)
                    world_y = pose['y'] + r * math.sin(angle)

                    map_x = self.world_to_map_x(world_x)
                    map_y = self.world_to_map_y(world_y)

                    if self.is_valid_map_cell(map_x, map_y):
                        # Update cell based on LiDAR reading
                        if r < 9.5:  # Not max range, so there's likely an obstacle
                            self.update_cell_probability(map_x, map_y, self.lidar_influence, is_occupied=True)
                        else:  # Max range, so free space up to this point
                            self.update_free_space(robot_map_x, robot_map_y, map_x, map_y)

    def process_depth_data(self):
        """Process depth camera data to update occupancy grid"""
        if not self.depth_buffer:
            return

        for depth_data in self.depth_buffer:
            pose = depth_data['pose']
            depth_image = depth_data['image']

            # Convert depth image to 3D points and project to 2D map
            self.project_depth_to_map(pose, depth_image)

    def project_depth_to_map(self, pose, depth_image):
        """Project depth image points to 2D occupancy grid"""
        # Simple projection: convert depth pixels to world coordinates, then to map coordinates
        height, width = depth_image.shape

        # Use every Nth pixel to reduce computation
        step = 8  # Use every 8th pixel

        for v in range(0, height, step):
            for u in range(0, width, step):
                depth = depth_image[v, u] / 1000.0  # Convert to meters

                if 0.1 < depth < 5.0:  # Valid depth range
                    # Convert pixel to 3D point (simplified camera model)
                    # Assume fixed camera height and orientation
                    camera_height = 0.5  # meters above ground
                    camera_fov_h = math.pi / 3  # 60 degrees horizontal

                    # Convert pixel coordinates to angles
                    pixel_angle = (u - width/2) * camera_fov_h / width
                    world_x = pose['x'] + depth * math.cos(pixel_angle)
                    world_y = pose['y'] + depth * math.sin(pixel_angle)

                    # Convert to map coordinates
                    map_x = self.world_to_map_x(world_x)
                    map_y = self.world_to_map_y(world_y)

                    if self.is_valid_map_cell(map_x, map_y):
                        self.update_cell_probability(map_x, map_y, self.depth_influence, is_occupied=True)

    def update_cell_probability(self, x, y, influence, is_occupied):
        """Update cell occupancy probability"""
        if not self.is_valid_map_cell(x, y):
            return

        current_value = self.occupancy_grid[y, x]

        if current_value == -1:  # Unknown
            if is_occupied:
                self.occupancy_grid[y, x] = int(50 + 50 * influence)  # Start with 50-100% occupancy
            else:
                self.occupancy_grid[y, x] = int(50 - 50 * influence)  # Start with 0-50% occupancy
        else:
            # Update existing probability
            if is_occupied:
                # Increase occupancy probability
                new_prob = min(100, current_value + int(50 * influence))
            else:
                # Decrease occupancy probability
                new_prob = max(0, current_value - int(50 * influence))

            self.occupancy_grid[y, x] = new_prob

    def update_free_space(self, start_x, start_y, end_x, end_y):
        """Update cells along ray as free space"""
        # Use Bresenham's line algorithm to trace ray
        dx = abs(end_x - start_x)
        dy = abs(end_y - start_y)
        sx = 1 if start_x < end_x else -1
        sy = 1 if start_y < end_y else -1
        err = dx - dy

        x, y = start_x, start_y

        while True:
            if self.is_valid_map_cell(x, y):
                # Update as free space
                current_value = self.occupancy_grid[y, x]
                if current_value > 0 and current_value != -1:
                    self.occupancy_grid[y, x] = max(0, current_value - 20)  # Reduce occupancy

            if x == end_x and y == end_y:
                break

            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x += sx
            if e2 < dx:
                err += dx
                y += sy

    def apply_temporal_decay(self):
        """Apply temporal decay to reduce old information"""
        mask = self.occupancy_grid != -1  # Only decay known cells
        self.occupancy_grid[mask] = (self.occupancy_grid[mask] * self.temporal_decay).astype(np.int8)

        # Ensure values stay in range [0, 100]
        self.occupancy_grid = np.clip(self.occupancy_grid, 0, 100)

        # Reset cells that have decayed to very low values
        low_prob_mask = (self.occupancy_grid < 10) & (self.occupancy_grid != -1)
        self.occupancy_grid[low_prob_mask] = -1  # Mark as unknown

    def world_to_map_x(self, x):
        """Convert world X coordinate to map X index"""
        return int((x - self.map_origin_x) / self.map_resolution)

    def world_to_map_y(self, y):
        """Convert world Y coordinate to map Y index"""
        return int((y - self.map_origin_y) / self.map_resolution)

    def is_valid_map_cell(self, x, y):
        """Check if map coordinates are valid"""
        return 0 <= x < self.map_width and 0 <= y < self.map_height

    def publish_map(self):
        """Publish the occupancy grid map"""
        map_msg = OccupancyGrid()
        map_msg.header.stamp = self.get_clock().now().to_msg()
        map_msg.header.frame_id = 'map'
        map_msg.info.resolution = self.map_resolution
        map_msg.info.width = self.map_width
        map_msg.info.height = self.map_height
        map_msg.info.origin.position.x = self.map_origin_x
        map_msg.info.origin.position.y = self.map_origin_y
        map_msg.info.origin.position.z = 0.0
        map_msg.info.origin.orientation.w = 1.0

        # Flatten the grid for publishing
        map_msg.data = self.occupancy_grid.flatten().tolist()

        self.map_pub.publish(map_msg)

    def publish_visualization(self):
        """Publish visualization markers for the map"""
        marker_array = MarkerArray()

        # Create markers for occupied cells (sample some for performance)
        marker = Marker()
        marker.header.frame_id = 'map'
        marker.header.stamp = self.get_clock().now().to_msg()
        marker.ns = 'map_occupied_cells'
        marker.id = 0
        marker.type = Marker.POINTS
        marker.action = Marker.ADD

        marker.pose.orientation.w = 1.0
        marker.scale.x = self.map_resolution * 0.8
        marker.scale.y = self.map_resolution * 0.8

        # Add occupied cells to marker (sample every 5th cell to reduce number)
        for y in range(0, self.map_height, 5):
            for x in range(0, self.map_width, 5):
                if self.occupancy_grid[y, x] > 50:  # Occupied
                    world_x = self.map_origin_x + x * self.map_resolution + self.map_resolution/2
                    world_y = self.map_origin_y + y * self.map_resolution + self.map_resolution/2

                    point = PointStamped()
                    point.point.x = world_x
                    point.point.y = world_y
                    point.point.z = 0.0

                    marker.points.append(point.point)

                    # Color based on occupancy probability
                    occ_prob = self.occupancy_grid[y, x] / 100.0
                    marker.colors.append(self.get_color_from_probability(occ_prob))

        marker_array.markers.append(marker)
        self.visualization_pub.publish(marker_array)

    def get_color_from_probability(self, prob):
        """Get color based on occupancy probability"""
        from std_msgs.msg import ColorRGBA
        color = ColorRGBA()
        if prob > 0.7:
            color.r = 1.0  # Red for high probability
            color.g = 0.0
            color.b = 0.0
        elif prob > 0.3:
            color.r = 1.0  # Yellow for medium
            color.g = 1.0
            color.b = 0.0
        else:
            color.r = 0.0  # Green for low
            color.g = 1.0
            color.b = 0.0
        color.a = 0.8
        return color

def main(args=None):
    rclpy.init(args=args)
    mapper = MultiSensorFusionMapper()

    try:
        rclpy.spin(mapper)
    except KeyboardInterrupt:
        mapper.get_logger().info('Shutting down multi-sensor fusion mapper')
    finally:
        mapper.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Physical AI Deployment (Edge)

### Exercise 4: Edge-Optimized Digital Twin

Create an optimized version of the digital twin system for deployment on NVIDIA Jetson Orin Nano:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, Image, PointCloud2
from std_msgs.msg import Float64MultiArray, Header
from cv_bridge import CvBridge
import numpy as np
import math
from collections import deque
import time
import psutil

class EdgeOptimizedDigitalTwin(Node):
    def __init__(self):
        super().__init__('edge_optimized_digital_twin')

        # Publishers with reduced queue sizes
        self.scan_pub = self.create_publisher(LaserScan, '/scan', 3)
        self.depth_pub = self.create_publisher(Image, '/camera/depth/image_raw', 3)
        self.status_pub = self.create_publisher(Float64MultiArray, '/edge_status', 3)

        # Timer with adaptive frequency
        self.main_timer = self.create_timer(0.1, self.edge_optimized_update)  # 10 Hz base

        # CV Bridge
        self.bridge = CvBridge()

        # Edge optimization parameters
        self.lidar_resolution = 180  # Reduced from 360 for efficiency
        self.depth_width = 160       # Reduced resolution
        self.depth_height = 120      # Reduced resolution
        self.map_resolution = 0.2    # Lower resolution map (20cm)

        # Resource monitoring
        self.cpu_threshold = 75.0
        self.memory_threshold = 80.0
        self.adaptive_frequency = 10.0  # Start at 10 Hz

        # Simplified environment representation
        self.time = 0.0
        self.robot_position = np.array([0.0, 0.0])
        self.robot_heading = 0.0

        # Reduced complexity scene
        self.static_obstacles = [
            {'x': 2.0, 'y': 1.0, 'radius': 0.5},
            {'x': -1.5, 'y': -2.0, 'radius': 0.4},
            {'x': 0.0, 'y': 3.0, 'radius': 0.6}
        ]

        self.get_logger().info('Edge Optimized Digital Twin initialized')

    def edge_optimized_update(self):
        """Main update loop optimized for edge devices"""
        # Monitor system resources
        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent

        # Adjust update frequency based on resource usage
        if cpu_percent > self.cpu_threshold or memory_percent > self.memory_threshold:
            self.adaptive_frequency = max(5.0, self.adaptive_frequency * 0.9)  # Reduce frequency
            self.get_logger().debug(f'High resource usage, reducing frequency to {self.adaptive_frequency:.2f} Hz')
        elif cpu_percent < 50.0 and memory_percent < 60.0:
            self.adaptive_frequency = min(15.0, self.adaptive_frequency * 1.05)  # Increase frequency

        # Update robot position (simple motion model)
        self.update_robot_motion()

        # Publish optimized sensor data
        self.publish_optimized_scan()
        self.publish_optimized_depth()

        # Publish system status
        self.publish_edge_status(cpu_percent, memory_percent)

        # Update time
        self.time += 0.1

    def update_robot_motion(self):
        """Simple motion model for robot"""
        # Simple circular motion for demonstration
        radius = 2.0
        angular_speed = 0.3  # rad/s

        self.robot_position[0] = radius * math.cos(angular_speed * self.time)
        self.robot_position[1] = radius * math.sin(angular_speed * self.time)
        self.robot_heading = angular_speed * self.time + math.pi/2  # Heading perpendicular to motion

    def publish_optimized_scan(self):
        """Publish optimized LiDAR scan"""
        # Reduced resolution scan
        angle_increment = 2 * math.pi / self.lidar_resolution
        ranges = []

        for i in range(self.lidar_resolution):
            angle = i * angle_increment + self.robot_heading
            distance = self.calculate_optimized_distance(angle)

            # Add minimal noise
            noise = np.random.normal(0, 0.03)  # Reduced noise for efficiency
            noisy_distance = max(0.1, min(8.0, distance + noise))
            ranges.append(noisy_distance)

        # Create and publish LaserScan
        scan_msg = LaserScan()
        scan_msg.header.stamp = self.get_clock().now().to_msg()
        scan_msg.header.frame_id = 'laser_frame'
        scan_msg.angle_min = 0.0
        scan_msg.angle_max = 2 * math.pi
        scan_msg.angle_increment = angle_increment
        scan_msg.time_increment = 0.0
        scan_msg.scan_time = 0.1
        scan_msg.range_min = 0.1
        scan_msg.range_max = 8.0
        scan_msg.ranges = ranges

        self.scan_pub.publish(scan_msg)

    def calculate_optimized_distance(self, angle):
        """Calculate distance with optimized computation"""
        # Simplified distance calculation
        # Ray-casting to static obstacles
        min_distance = float('inf')

        for obs in self.static_obstacles:
            # Vector from robot to obstacle
            dx = obs['x'] - self.robot_position[0]
            dy = obs['y'] - self.robot_position[1]

            # Distance from robot to obstacle center
            center_dist = math.sqrt(dx*dx + dy*dy)

            # Calculate angle to obstacle
            obs_angle = math.atan2(dy, dx)

            # Check if ray intersects obstacle
            angle_diff = abs(angle - obs_angle)
            if angle_diff < math.pi:  # Within reasonable range
                distance_to_surface = center_dist - obs['radius']
                if distance_to_surface > 0:
                    min_distance = min(min_distance, distance_to_surface)

        # Also check for boundary (simple square boundary)
        boundary_size = 5.0
        dist_to_boundary = self.calculate_distance_to_boundary(angle)
        min_distance = min(min_distance, dist_to_boundary)

        return min_distance if min_distance != float('inf') else 8.0  # Max range if no obstacles

    def calculate_distance_to_boundary(self, angle):
        """Calculate distance to square boundary"""
        # Calculate intersection with boundaries
        robot_x, robot_y = self.robot_position[0], self.robot_position[1]
        boundary = 5.0

        # Calculate distance to each wall
        dist_right = (boundary - robot_x) / math.cos(angle) if math.cos(angle) > 0.001 else float('inf')
        dist_left = (robot_x + boundary) / -math.cos(angle) if math.cos(angle) < -0.001 else float('inf')
        dist_top = (boundary - robot_y) / math.sin(angle) if math.sin(angle) > 0.001 else float('inf')
        dist_bottom = (robot_y + boundary) / -math.sin(angle) if math.sin(angle) < -0.001 else float('inf')

        valid_distances = [d for d in [dist_right, dist_left, dist_top, dist_bottom] if d > 0]
        return min(valid_distances) if valid_distances else float('inf')

    def publish_optimized_depth(self):
        """Publish optimized depth image"""
        # Create simplified depth image
        depth_image = np.zeros((self.depth_height, self.depth_width), dtype=np.uint16)

        # Simplified scene generation
        center_x, center_y = self.depth_width // 2, self.depth_height // 2

        for y in range(self.depth_height):
            for x in range(self.depth_width):
                # Calculate normalized coordinates (-1 to 1)
                norm_x = (x - center_x) / center_x
                norm_y = (y - center_y) / center_y

                # Calculate distance with simple gradient
                base_depth = 1500 + 1000 * math.sqrt(norm_x*norm_x + norm_y*norm_y)

                # Add obstacles
                min_depth = base_depth
                for obs in self.static_obstacles:
                    # Transform obstacle position to camera-relative coordinates
                    rel_x = obs['x'] - self.robot_position[0]
                    rel_y = obs['y'] - self.robot_position[1]

                    # Project to image coordinates (simplified)
                    if rel_x != 0:  # Avoid division by zero
                        proj_x = int(center_x + (rel_x / rel_y) * center_x) if rel_y != 0 else center_x
                        proj_y = int(center_y + (rel_y / rel_x) * center_y) if rel_x != 0 else center_y

                        pixel_dist = math.sqrt((x - proj_x)**2 + (y - proj_y)**2)
                        if pixel_dist < 20:  # Within 20 pixels of projected obstacle
                            min_depth = min(min_depth, 1000)  # Obstacle distance

                # Add minimal noise
                noise = np.random.normal(0, 15)
                depth = max(200, min(5000, min_depth + noise))
                depth_image[y, x] = int(depth)

        # Convert to ROS message and publish
        depth_msg = self.bridge.cv2_to_imgmsg(depth_image, encoding='16UC1')
        depth_msg.header.stamp = self.get_clock().now().to_msg()
        depth_msg.header.frame_id = 'camera_depth_optical_frame'

        self.depth_pub.publish(depth_msg)

    def publish_edge_status(self, cpu_percent, memory_percent):
        """Publish edge device status information"""
        status_msg = Float64MultiArray()
        status_msg.data = [
            cpu_percent,           # CPU usage %
            memory_percent,        # Memory usage %
            self.adaptive_frequency,  # Current frequency
            self.time              # Simulation time
        ]
        self.status_pub.publish(status_msg)

def main(args=None):
    rclpy.init(args=args)
    edge_twin = EdgeOptimizedDigitalTwin()

    try:
        rclpy.spin(edge_twin)
    except KeyboardInterrupt:
        edge_twin.get_logger().info('Shutting down edge optimized digital twin')
    finally:
        edge_twin.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Exercise 5: Digital Twin Validation and Performance Monitoring

Create a comprehensive validation and monitoring system for the digital twin:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, Image, PointCloud2
from std_msgs.msg import Float64MultiArray, String, Header
from geometry_msgs.msg import PoseStamped
from visualization_msgs.msg import Marker, MarkerArray
import numpy as np
import math
from collections import deque
import time
from cv_bridge import CvBridge

class DigitalTwinValidator(Node):
    def __init__(self):
        super().__init__('digital_twin_validator')

        # Publishers
        self.validation_pub = self.create_publisher(Float64MultiArray, '/validation/scores', 10)
        self.status_pub = self.create_publisher(String, '/validation/status', 10)
        self.performance_pub = self.create_publisher(Float64MultiArray, '/validation/performance', 10)
        self.marker_pub = self.create_publisher(Marker, '/validation/indicator', 10)

        # Subscribers for all sensor types
        self.scan_sub = self.create_subscription(LaserScan, '/scan', self.scan_callback, 10)
        self.depth_sub = self.create_subscription(Image, '/camera/depth/image_raw', self.depth_callback, 10)
        self.pose_sub = self.create_subscription(PoseStamped, '/pose', self.pose_callback, 10)

        # Timer for validation
        self.validation_timer = self.create_timer(1.0, self.perform_validation)

        # Data buffers
        self.scan_buffer = deque(maxlen=10)
        self.depth_buffer = deque(maxlen=10)
        self.pose_buffer = deque(maxlen=20)

        # Timing statistics
        self.scan_times = deque(maxlen=50)
        self.depth_times = deque(maxlen=50)
        self.validation_times = deque(maxlen=50)

        # Validation parameters
        self.consistency_threshold = 0.8
        self.completeness_threshold = 0.9
        self.accuracy_threshold = 0.85

        # Performance metrics
        self.start_time = time.time()
        self.message_count = 0

        # CV Bridge
        self.bridge = CvBridge()

        self.get_logger().info('Digital Twin Validator initialized')

    def scan_callback(self, msg):
        """Process incoming scan and measure timing"""
        start_time = time.time()

        # Store scan data
        self.scan_buffer.append({
            'timestamp': msg.header.stamp,
            'ranges': list(msg.ranges),
            'valid_count': sum(1 for r in msg.ranges if msg.range_min <= r <= msg.range_max)
        })

        # Record processing time
        self.scan_times.append(time.time() - start_time)
        self.message_count += 1

    def depth_callback(self, msg):
        """Process incoming depth image"""
        start_time = time.time()

        try:
            # Just measure the conversion time
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='16UC1')

            self.depth_buffer.append({
                'timestamp': msg.header.stamp,
                'height': msg.height,
                'width': msg.width,
                'size': msg.height * msg.width
            })
        except Exception as e:
            self.get_logger().error(f'Depth callback error: {e}')

        self.depth_times.append(time.time() - start_time)
        self.message_count += 1

    def pose_callback(self, msg):
        """Process pose information"""
        self.pose_buffer.append({
            'timestamp': msg.header.stamp,
            'x': msg.pose.position.x,
            'y': msg.pose.position.y
        })
        self.message_count += 1

    def perform_validation(self):
        """Perform comprehensive validation"""
        start_time = time.time()

        # Calculate various validation metrics
        consistency_score = self.calculate_consistency_score()
        completeness_score = self.calculate_completeness_score()
        accuracy_score = self.calculate_accuracy_score()
        performance_score = self.calculate_performance_score()

        # Overall validation score
        overall_score = (consistency_score + completeness_score + accuracy_score + performance_score) / 4.0

        # Publish validation results
        self.publish_validation_results(
            consistency_score,
            completeness_score,
            accuracy_score,
            performance_score,
            overall_score
        )

        # Publish system status
        self.publish_system_status(overall_score)

        # Publish performance metrics
        self.publish_performance_metrics()

        # Publish visualization
        self.publish_validation_indicator(overall_score)

        # Record validation time
        self.validation_times.append(time.time() - start_time)

    def calculate_consistency_score(self):
        """Calculate consistency of sensor data over time"""
        if len(self.scan_buffer) < 3:
            return 0.0

        # Calculate variance in scan ranges over time
        all_ranges = []
        for scan_data in self.scan_buffer:
            all_ranges.extend(scan_data['ranges'])

        if not all_ranges:
            return 0.0

        # Calculate coefficient of variation (lower is more consistent)
        mean_range = np.mean(all_ranges)
        std_range = np.std(all_ranges)

        if mean_range == 0:
            return 1.0 if std_range == 0 else 0.0

        cv = std_range / mean_range  # Coefficient of variation
        # Convert to score (lower CV = higher score)
        consistency_score = max(0.0, 1.0 - cv)

        return consistency_score

    def calculate_completeness_score(self):
        """Calculate how complete the sensor data is"""
        if not self.scan_buffer:
            return 0.0

        # Calculate average percentage of valid ranges
        total_ranges = 0
        valid_ranges = 0

        for scan_data in self.scan_buffer:
            total_ranges += len(scan_data['ranges'])
            valid_ranges += scan_data['valid_count']

        if total_ranges == 0:
            return 0.0

        completeness = valid_ranges / total_ranges
        return completeness

    def calculate_accuracy_score(self):
        """Calculate accuracy based on sensor behavior"""
        if len(self.pose_buffer) < 2:
            return 0.0

        # Calculate if robot movement is reasonable
        positions = [(p['x'], p['y']) for p in self.pose_buffer]

        if len(positions) < 2:
            return 1.0

        # Calculate average speed
        total_distance = 0
        total_time = 0

        for i in range(1, len(positions)):
            dx = positions[i][0] - positions[i-1][0]
            dy = positions[i][1] - positions[i-1][1]
            distance = math.sqrt(dx*dx + dy*dy)

            # Calculate time between poses (approximate)
            time_diff = 1.0  # Assuming 1 Hz for simplicity

            total_distance += distance
            total_time += time_diff

        if total_time == 0:
            return 1.0

        avg_speed = total_distance / total_time

        # Reasonable speed for most robots is < 2 m/s
        if avg_speed <= 2.0:
            return min(1.0, avg_speed / 2.0)
        else:
            return max(0.1, 2.0 / avg_speed)  # Lower score for excessive speed

    def calculate_performance_score(self):
        """Calculate performance based on timing and resource usage"""
        # Calculate average processing times
        avg_scan_time = np.mean(self.scan_times) if self.scan_times else 0
        avg_depth_time = np.mean(self.depth_times) if self.depth_times else 0
        avg_validation_time = np.mean(self.validation_times) if self.validation_times else 0

        # Target times (in seconds)
        target_scan_time = 0.05  # 20 Hz
        target_depth_time = 0.033  # 30 Hz
        target_validation_time = 0.1  # 10 Hz

        # Calculate time-based scores (lower times = higher scores)
        scan_performance = max(0.0, min(1.0, target_scan_time / max(avg_scan_time, 0.001)))
        depth_performance = max(0.0, min(1.0, target_depth_time / max(avg_depth_time, 0.001)))
        validation_performance = max(0.0, min(1.0, target_validation_time / max(avg_validation_time, 0.001)))

        # Combine scores
        performance_score = (scan_performance + depth_performance + validation_performance) / 3.0
        return performance_score

    def publish_validation_results(self, consistency, completeness, accuracy, performance, overall):
        """Publish validation scores"""
        scores_msg = Float64MultiArray()
        scores_msg.data = [
            consistency,
            completeness,
            accuracy,
            performance,
            overall
        ]
        self.validation_pub.publish(scores_msg)

    def publish_system_status(self, overall_score):
        """Publish system status"""
        status_msg = String()

        if overall_score >= 0.9:
            status_msg.data = "EXCELLENT"
        elif overall_score >= 0.8:
            status_msg.data = "GOOD"
        elif overall_score >= 0.6:
            status_msg.data = "FAIR"
        elif overall_score >= 0.4:
            status_msg.data = "POOR"
        else:
            status_msg.data = "CRITICAL"

        self.status_pub.publish(status_msg)

    def publish_performance_metrics(self):
        """Publish detailed performance metrics"""
        metrics_msg = Float64MultiArray()

        avg_scan_time = np.mean(self.scan_times) if self.scan_times else 0
        avg_depth_time = np.mean(self.depth_times) if self.depth_times else 0
        avg_validation_time = np.mean(self.validation_times) if self.validation_times else 0

        uptime = time.time() - self.start_time
        throughput = self.message_count / max(uptime, 1)  # Messages per second

        metrics_msg.data = [
            avg_scan_time,
            avg_depth_time,
            avg_validation_time,
            uptime,
            throughput,
            float(self.message_count)
        ]

        self.performance_pub.publish(metrics_msg)

    def publish_validation_indicator(self, score):
        """Publish visualization indicator"""
        marker = Marker()
        marker.header.frame_id = "map"
        marker.header.stamp = self.get_clock().now().to_msg()
        marker.ns = "validation"
        marker.id = 0
        marker.type = Marker.SPHERE
        marker.action = Marker.ADD

        marker.pose.position.x = 0.0
        marker.pose.position.y = 0.0
        marker.pose.position.z = 2.0  # Above the robot
        marker.pose.orientation.w = 1.0

        # Size based on score
        marker.scale.x = 0.2 + 0.3 * score  # 0.2 to 0.5m
        marker.scale.y = marker.scale.x
        marker.scale.z = marker.scale.x

        # Color based on score (green to red)
        marker.color.r = 1.0 - score  # Red for low scores
        marker.color.g = score        # Green for high scores
        marker.color.b = 0.0
        marker.color.a = 0.8

        self.marker_pub.publish(marker)

def main(args=None):
    rclpy.init(args=args)
    validator = DigitalTwinValidator()

    try:
        rclpy.spin(validator)
    except KeyboardInterrupt:
        validator.get_logger().info('Shutting down digital twin validator')
    finally:
        validator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Summary

The digital twin exercises demonstrate the integration of physics simulation, sensor modeling, and rendering into cohesive systems that accurately represent real-world robotic platforms. Key learning outcomes include:

1. **System Integration**: Combining multiple simulation components into unified digital twin environments
2. **Validation Techniques**: Implementing comprehensive validation systems to ensure digital twin accuracy
3. **Performance Optimization**: Adapting simulation complexity for different computational platforms
4. **Multi-Sensor Fusion**: Integrating data from various sensors to create comprehensive environment representations
5. **Edge Deployment**: Optimizing digital twin systems for resource-constrained platforms like NVIDIA Jetson Orin Nano

The exercises progress from basic component integration to advanced multi-sensor fusion and edge optimization, providing students with practical experience in creating realistic digital twin environments.

## Exercises

1. Create a complete digital twin environment that integrates physics, rendering, and sensor simulation
2. Implement a physics-aware sensor simulator that adjusts characteristics based on robot motion
3. Develop a multi-sensor fusion system that combines LiDAR, depth camera, and IMU data
4. Design an edge-optimized digital twin system for deployment on NVIDIA Jetson Orin Nano
5. Create a comprehensive validation and monitoring system for digital twin quality assurance