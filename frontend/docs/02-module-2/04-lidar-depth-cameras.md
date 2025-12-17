---
title: "LiDAR and Depth Camera Simulation"
slug: "/module-2/lidar-depth-cameras"
sidebar_position: 5
---

# LiDAR and Depth Camera Simulation

## Learning Objectives

By the end of this chapter, students will be able to:
- Understand the principles of LiDAR and depth camera simulation in digital twin environments
- Implement realistic models of 3D sensing technologies including Intel RealSense D435i
- Simulate LiDAR point clouds with appropriate noise and accuracy characteristics
- Integrate depth camera simulation with ROS 2 for perception pipeline development
- Validate simulated sensor data against real hardware specifications

## Theory Section

### LiDAR Technology Fundamentals

LiDAR (Light Detection and Ranging) is a critical 3D sensing technology that uses pulsed laser light to measure distances to objects. In robotics, LiDAR provides accurate 3D mapping and obstacle detection capabilities essential for navigation and perception.

#### LiDAR Operating Principles

**Time-of-Flight Measurement**: LiDAR systems measure the time it takes for a laser pulse to travel to an object and back. The distance is calculated using the formula: `distance = (speed_of_light × time) / 2`.

**Scanning Mechanisms**: Different LiDAR systems use various scanning approaches:
- **Mechanical Scanning**: Rotating mirrors or spinning units that scan the environment
- **Solid-State Scanning**: Electronic beam steering without moving parts
- **Flash LiDAR**: Illuminates the entire scene at once with a single "flash"

**Point Cloud Generation**: LiDAR sensors generate point clouds by collecting distance measurements from multiple directions, creating a 3D representation of the environment.

#### LiDAR Performance Characteristics

**Range**: The maximum distance at which the sensor can detect objects, typically ranging from a few meters to hundreds of meters depending on the model.

**Accuracy**: The precision of distance measurements, often specified as a percentage of the measured distance or in absolute terms (e.g., ±2cm).

**Resolution**: The angular resolution determines how densely points are sampled in the environment, affecting the detail of the 3D representation.

**Field of View**: The angular extent of the environment that can be captured in a single scan.

**Update Rate**: The frequency at which scans are acquired, typically ranging from 5-20 Hz for robotics applications.

### Depth Camera Technology

Depth cameras provide 3D information about scenes using various technologies, with stereo vision and structured light being the most common approaches for robotics applications.

#### Stereo Vision Cameras

Stereo cameras use two or more lenses to capture images from slightly different viewpoints, then compute depth by finding corresponding points between images. The depth is calculated using triangulation based on the disparity between corresponding points.

**Advantages**: Works well in well-lit environments, provides dense depth information
**Disadvantages**: Requires textured surfaces, sensitive to lighting conditions

#### Structured Light Cameras

Structured light systems project a known pattern of light onto a scene and analyze how the pattern is deformed by objects to calculate depth.

**Advantages**: Accurate at close range, works in various lighting conditions
**Disadvantages**: Limited range, can be affected by ambient light

#### Intel RealSense D435i Specifics

The Intel RealSense D435i combines a stereo depth camera with an inertial measurement unit (IMU), providing both depth sensing and motion tracking capabilities:

**Depth Specifications**:
- Depth sensing range: 0.2m to 10m
- Depth accuracy: ±1% at 1m distance
- Depth resolution: Up to 1280×720 pixels
- Frame rate: Up to 90 FPS at lower resolutions

**IMU Integration**: The integrated IMU provides additional motion tracking data that can improve depth sensing in dynamic environments.

### 3D Sensing Simulation Challenges

Simulating 3D sensors presents unique challenges compared to traditional cameras:

**Computational Complexity**: Generating realistic point clouds and depth maps requires significant computational resources.

**Noise Modeling**: 3D sensors have complex noise characteristics that vary with distance, surface properties, and environmental conditions.

**Occlusion Handling**: Simulating realistic occlusions and visibility constraints is critical for accurate depth sensing simulation.

## Digital Twin Lab (Simulation)

### LiDAR Simulation Implementation

Let's create a realistic LiDAR simulation in ROS 2:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, PointCloud2, PointField
from std_msgs.msg import Header
import numpy as np
import math
from sensor_msgs_py import point_cloud2
from std_msgs.msg import Float32MultiArray

class LidarSimulator(Node):
    def __init__(self):
        super().__init__('lidar_simulator')

        # Publisher for LiDAR data
        self.scan_pub = self.create_publisher(LaserScan, '/scan', 10)
        self.pc_pub = self.create_publisher(PointCloud2, '/pointcloud', 10)

        # Timer for publishing LiDAR data
        self.timer = self.create_timer(0.1, self.publish_lidar_data)  # 10 Hz

        # LiDAR parameters (modeling a typical 2D LiDAR like Hokuyo URG-04LX-UG01)
        self.angle_min = -math.pi
        self.angle_max = math.pi
        self.angle_increment = 2 * math.pi / 1080  # 1080 points per revolution
        self.time_increment = 0.0  # No time increment between measurements
        self.scan_time = 0.1  # 10 Hz
        self.range_min = 0.06  # 6 cm minimum range
        self.range_max = 5.6  # 5.6 m maximum range

        # Noise parameters
        self.range_noise_std = 0.01  # 1 cm standard deviation
        self.intensity_noise_std = 5.0

        # Initialize simulated environment
        self.time = 0.0

        self.get_logger().info('LiDAR Simulator initialized')

    def publish_lidar_data(self):
        """Generate and publish realistic LiDAR scan data"""
        # Update time
        self.time += 0.1

        # Generate simulated ranges based on environment
        ranges = self.generate_simulated_scan()

        # Add noise to ranges
        noisy_ranges = self.add_range_noise(ranges)

        # Create LaserScan message
        scan_msg = LaserScan()
        scan_msg.header = Header()
        scan_msg.header.stamp = self.get_clock().now().to_msg()
        scan_msg.header.frame_id = 'laser_frame'

        scan_msg.angle_min = self.angle_min
        scan_msg.angle_max = self.angle_max
        scan_msg.angle_increment = self.angle_increment
        scan_msg.time_increment = self.time_increment
        scan_msg.scan_time = self.scan_time
        scan_msg.range_min = self.range_min
        scan_msg.range_max = self.range_max

        scan_msg.ranges = noisy_ranges
        scan_msg.intensities = self.generate_intensities(len(noisy_ranges))

        # Publish scan
        self.scan_pub.publish(scan_msg)

        # Also publish as point cloud
        pc_msg = self.scan_to_pointcloud(scan_msg)
        self.pc_pub.publish(pc_msg)

    def generate_simulated_scan(self):
        """Generate simulated ranges based on a virtual environment"""
        num_points = int((self.angle_max - self.angle_min) / self.angle_increment) + 1
        ranges = []

        for i in range(num_points):
            angle = self.angle_min + i * self.angle_increment

            # Simulate a simple environment with walls and obstacles
            # Calculate distance to nearest obstacle at this angle
            distance = self.calculate_distance_to_obstacle(angle)
            ranges.append(distance)

        return ranges

    def calculate_distance_to_obstacle(self, angle):
        """Calculate distance to obstacle at given angle"""
        # Simple environment: a square room with some obstacles
        robot_x, robot_y = 0.0, 0.0  # Robot position

        # Define room boundaries (5m x 5m room centered at origin)
        room_half_size = 2.5

        # Calculate intersection with room walls
        # Wall distances
        dist_right = (room_half_size - robot_x) / math.cos(angle) if math.cos(angle) > 0.001 else float('inf')
        dist_left = (robot_x + room_half_size) / -math.cos(angle) if math.cos(angle) < -0.001 else float('inf')
        dist_front = (room_half_size - robot_y) / math.sin(angle) if math.sin(angle) > 0.001 else float('inf')
        dist_back = (robot_y + room_half_size) / -math.sin(angle) if math.sin(angle) < -0.001 else float('inf')

        # Take the minimum positive distance to room walls
        wall_distance = min(
            d for d in [dist_right, dist_left, dist_front, dist_back]
            if d > 0
        )

        # Add some virtual obstacles (cylinders)
        obstacles = [
            {'x': 1.0, 'y': 0.5, 'radius': 0.3},  # Obstacle 1
            {'x': -1.0, 'y': -1.0, 'radius': 0.4},  # Obstacle 2
            {'x': 0.0, 'y': 1.5, 'radius': 0.25}  # Obstacle 3
        ]

        min_obstacle_distance = float('inf')
        for obs in obstacles:
            # Calculate distance to obstacle center
            dx = obs['x'] - robot_x
            dy = obs['y'] - robot_y
            center_dist = math.sqrt(dx*dx + dy*dy)

            # Calculate distance to obstacle surface
            obstacle_dist = center_dist - obs['radius']

            # Check if ray intersects obstacle
            if obstacle_dist > 0:
                # Calculate angle to obstacle center
                obs_angle = math.atan2(dy, dx)
                angle_diff = abs(angle - obs_angle)

                # If ray is pointing toward obstacle
                if angle_diff < math.pi / 2:  # Rough check
                    min_obstacle_distance = min(min_obstacle_distance, obstacle_dist)

        # Return the minimum distance (wall or obstacle)
        final_distance = min(wall_distance, min_obstacle_distance)

        # Add some random variation to make it more realistic
        variation = 0.05 * math.sin(10 * angle + self.time)
        final_distance += variation

        # Ensure it's within sensor range
        final_distance = max(self.range_min, min(self.range_max, final_distance))

        return final_distance

    def add_range_noise(self, ranges):
        """Add realistic noise to range measurements"""
        noisy_ranges = []
        for r in ranges:
            if r >= self.range_max:
                # For maximum range values, keep them as is (no obstacle detected)
                noisy_ranges.append(r)
            else:
                # Add Gaussian noise
                noise = np.random.normal(0, self.range_noise_std)
                noisy_range = max(self.range_min, min(self.range_max, r + noise))
                noisy_ranges.append(noisy_range)

        return noisy_ranges

    def generate_intensities(self, num_points):
        """Generate intensity values for the scan"""
        intensities = []
        for i in range(num_points):
            # Base intensity based on distance (closer objects typically have higher intensity)
            base_intensity = 100.0
            # Add some variation
            variation = np.random.normal(0, self.intensity_noise_std)
            intensity = max(0, base_intensity + variation)
            intensities.append(intensity)

        return intensities

    def scan_to_pointcloud(self, scan_msg):
        """Convert LaserScan to PointCloud2"""
        # Calculate points from scan
        points = []
        for i, r in enumerate(scan_msg.ranges):
            if self.range_min <= r <= self.range_max:
                angle = scan_msg.angle_min + i * scan_msg.angle_increment
                x = r * math.cos(angle)
                y = r * math.sin(angle)
                z = 0.0  # 2D LiDAR, so z is 0
                points.append([x, y, z])

        # Create PointCloud2 message
        header = Header()
        header.stamp = scan_msg.header.stamp
        header.frame_id = scan_msg.header.frame_id

        fields = [
            PointField(name='x', offset=0, datatype=PointField.FLOAT32, count=1),
            PointField(name='y', offset=4, datatype=PointField.FLOAT32, count=1),
            PointField(name='z', offset=8, datatype=PointField.FLOAT32, count=1)
        ]

        pc_msg = point_cloud2.create_cloud(header, fields, points)
        return pc_msg

def main(args=None):
    rclpy.init(args=args)
    lidar_simulator = LidarSimulator()

    try:
        rclpy.spin(lidar_simulator)
    except KeyboardInterrupt:
        lidar_simulator.get_logger().info('Shutting down LiDAR simulator')
    finally:
        lidar_simulator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Intel RealSense D435i Depth Camera Simulation

Now let's create a simulation for the Intel RealSense D435i depth camera:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, CameraInfo, PointCloud2
from sensor_msgs_py import point_cloud2
from sensor_msgs.msg import PointField
from cv_bridge import CvBridge
from std_msgs.msg import Header
import numpy as np
import math
import cv2

class RealSenseD435iSimulator(Node):
    def __init__(self):
        super().__init__('realsense_d435i_simulator')

        # Publishers for depth camera data
        self.color_pub = self.create_publisher(Image, '/camera/color/image_raw', 10)
        self.depth_pub = self.create_publisher(Image, '/camera/depth/image_raw', 10)
        self.pc_pub = self.create_publisher(PointCloud2, '/camera/depth/points', 10)
        self.info_pub = self.create_publisher(CameraInfo, '/camera/color/camera_info', 10)

        # Timer for publishing camera data
        self.timer = self.create_timer(0.033, self.publish_camera_data)  # ~30 FPS

        # CV Bridge for image conversion
        self.bridge = CvBridge()

        # RealSense D435i specifications
        self.width = 640
        self.height = 480
        self.fps = 30

        # Camera intrinsics (typical for D435i)
        self.camera_matrix = np.array([
            [616.0679931640625, 0.0, 313.83538818359375],  # fx, 0, cx
            [0.0, 615.7889404296875, 250.99090576171875],  # 0, fy, cy
            [0.0, 0.0, 1.0]                               # 0, 0, 1
        ])

        # Initialize simulated scene
        self.time = 0.0

        self.get_logger().info('RealSense D435i Simulator initialized')

    def publish_camera_data(self):
        """Generate and publish realistic RealSense D435i data"""
        # Update time
        self.time += 0.033

        # Generate simulated color image
        color_image = self.generate_color_image()
        color_msg = self.bridge.cv2_to_imgmsg(color_image, encoding='bgr8')
        color_msg.header.stamp = self.get_clock().now().to_msg()
        color_msg.header.frame_id = 'camera_color_optical_frame'
        self.color_pub.publish(color_msg)

        # Generate simulated depth image
        depth_image = self.generate_depth_image()
        depth_msg = self.bridge.cv2_to_imgmsg(depth_image, encoding='16UC1')
        depth_msg.header.stamp = color_msg.header.stamp
        depth_msg.header.frame_id = 'camera_depth_optical_frame'
        self.depth_pub.publish(depth_msg)

        # Generate and publish point cloud
        pc_msg = self.depth_to_pointcloud(depth_image, color_image)
        pc_msg.header.stamp = color_msg.header.stamp
        pc_msg.header.frame_id = 'camera_depth_optical_frame'
        self.pc_pub.publish(pc_msg)

        # Publish camera info
        info_msg = self.create_camera_info()
        info_msg.header.stamp = color_msg.header.stamp
        info_msg.header.frame_id = 'camera_color_optical_frame'
        self.info_pub.publish(info_msg)

    def generate_color_image(self):
        """Generate a realistic color image with patterns"""
        # Create base image
        image = np.zeros((self.height, self.width, 3), dtype=np.uint8)

        # Add some objects to simulate a scene
        t = self.time

        # Moving cube
        cube_x = int(200 + 100 * math.sin(0.5 * t))
        cube_y = int(150 + 80 * math.cos(0.3 * t))
        cv2.rectangle(image,
                     (cube_x, cube_y),
                     (cube_x + 100, cube_y + 100),
                     (100, 150, 200), -1)  # Blue cube

        # Moving sphere
        sphere_x = int(400 + 120 * math.cos(0.4 * t))
        sphere_y = int(200 + 100 * math.sin(0.6 * t))
        cv2.circle(image, (sphere_x, sphere_y), 50, (50, 200, 100), -1)  # Green sphere

        # Add some background patterns
        for y in range(0, self.height, 40):
            cv2.line(image, (0, y), (self.width, y), (100, 100, 100), 1)

        # Add realistic noise
        noise = np.random.normal(0, 5, image.shape).astype(np.int16)
        image = np.clip(image.astype(np.int16) + noise, 0, 255).astype(np.uint8)

        return image

    def generate_depth_image(self):
        """Generate realistic depth image matching RealSense D435i characteristics"""
        # Create depth image (in millimeters)
        depth_image = np.zeros((self.height, self.width), dtype=np.uint16)

        # Define depth regions based on the color image content
        t = self.time

        for y in range(self.height):
            for x in range(self.width):
                # Calculate base depth based on distance from center
                center_x, center_y = self.width // 2, self.height // 2
                distance_from_center = math.sqrt((x - center_x)**2 + (y - center_y)**2)

                # Base depth (1-3 meters from camera)
                base_depth = 1500 + 500 * math.sin(0.01 * distance_from_center)

                # Add object-specific depth
                # Cube depth
                cube_x, cube_y = 200 + 100 * math.sin(0.5 * t), 150 + 80 * math.cos(0.3 * t)
                if (cube_x <= x <= cube_x + 100) and (cube_y <= y <= cube_y + 100):
                    base_depth = 1200  # Cube is closer

                # Sphere depth
                sphere_x, sphere_y = 400 + 120 * math.cos(0.4 * t), 200 + 100 * math.sin(0.6 * t)
                sphere_dist = math.sqrt((x - sphere_x)**2 + (y - sphere_y)**2)
                if sphere_dist <= 50:  # Inside sphere
                    base_depth = 1300  # Sphere is slightly farther than cube

                # Add realistic depth noise (RealSense has distance-dependent noise)
                distance_m = base_depth / 1000.0  # Convert to meters
                # Noise increases with distance (typical for stereo cameras)
                noise_std = 0.005 + 0.002 * distance_m  # meters
                noise_mm = noise_std * 1000  # Convert to mm
                noise = np.random.normal(0, noise_mm)

                depth = max(200, min(10000, base_depth + noise))  # 20cm to 10m range
                depth_image[y, x] = int(depth)

        # Add some realistic depth artifacts
        self.add_depth_artifacts(depth_image)

        return depth_image.astype(np.uint16)

    def add_depth_artifacts(self, depth_image):
        """Add realistic depth camera artifacts"""
        # Add some missing depth pixels (common in depth cameras)
        h, w = depth_image.shape
        num_holes = 50
        for _ in range(num_holes):
            y = np.random.randint(0, h)
            x = np.random.randint(0, w)
            # Set to 0 (invalid depth) to simulate holes
            depth_image[y, x] = 0

        # Add some banding artifacts (horizontal bands of consistent depth)
        for y in range(0, h, 10):  # Every 10 rows
            if np.random.random() < 0.1:  # 10% chance
                band_depth = depth_image[y, w//2]  # Use center depth as reference
                depth_image[y:y+5, :] = band_depth  # Apply to 5 rows

    def depth_to_pointcloud(self, depth_image, color_image=None):
        """Convert depth image to point cloud"""
        # Get camera parameters
        fx = self.camera_matrix[0, 0]
        fy = self.camera_matrix[1, 1]
        cx = self.camera_matrix[0, 2]
        cy = self.camera_matrix[1, 2]

        # Create point cloud
        points = []

        for v in range(self.height):
            for u in range(self.width):
                depth = depth_image[v, u] / 1000.0  # Convert to meters

                if depth > 0 and depth < 10.0:  # Valid depth range
                    # Convert pixel coordinates to camera coordinates
                    x = (u - cx) * depth / fx
                    y = (v - cy) * depth / fy
                    z = depth

                    # Add color if available
                    if color_image is not None:
                        color = color_image[v, u]
                        r, g, b = color[2], color[1], color[0]  # BGR to RGB
                        points.append([x, y, z, r, g, b])
                    else:
                        points.append([x, y, z])

        # Create PointCloud2 message
        header = Header()

        if len(points[0]) == 6:  # With color
            fields = [
                PointField(name='x', offset=0, datatype=PointField.FLOAT32, count=1),
                PointField(name='y', offset=4, datatype=PointField.FLOAT32, count=1),
                PointField(name='z', offset=8, datatype=PointField.FLOAT32, count=1),
                PointField(name='r', offset=12, datatype=PointField.UINT8, count=1),
                PointField(name='g', offset=13, datatype=PointField.UINT8, count=1),
                PointField(name='b', offset=14, datatype=PointField.UINT8, count=1)
            ]
        else:  # Without color
            fields = [
                PointField(name='x', offset=0, datatype=PointField.FLOAT32, count=1),
                PointField(name='y', offset=4, datatype=PointField.FLOAT32, count=1),
                PointField(name='z', offset=8, datatype=PointField.FLOAT32, count=1)
            ]

        pc_msg = point_cloud2.create_cloud(header, fields, points)
        return pc_msg

    def create_camera_info(self):
        """Create camera info message with RealSense D435i parameters"""
        info_msg = CameraInfo()
        info_msg.width = self.width
        info_msg.height = self.height

        # Camera matrix (intrinsic parameters)
        info_msg.k = [
            float(self.camera_matrix[0, 0]), 0.0, float(self.camera_matrix[0, 2]),  # fx, 0, cx
            0.0, float(self.camera_matrix[1, 1]), float(self.camera_matrix[1, 2]),  # 0, fy, cy
            0.0, 0.0, 1.0  # 0, 0, 1
        ]

        # Distortion coefficients (assuming minimal distortion for simplicity)
        # In reality, RealSense cameras have some distortion that should be modeled
        info_msg.d = [0.0, 0.0, 0.0, 0.0, 0.0]

        # Rectification matrix (identity for a single camera)
        info_msg.r = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]

        # Projection matrix (same as camera matrix for rectified images)
        info_msg.p = [
            float(self.camera_matrix[0, 0]), 0.0, float(self.camera_matrix[0, 2]), 0.0,
            0.0, float(self.camera_matrix[1, 1]), float(self.camera_matrix[1, 2]), 0.0,
            0.0, 0.0, 1.0, 0.0
        ]

        return info_msg

def main(args=None):
    rclpy.init(args=args)
    realsense_simulator = RealSenseD435iSimulator()

    try:
        rclpy.spin(realsense_simulator)
    except KeyboardInterrupt:
        realsense_simulator.get_logger().info('Shutting down RealSense simulator')
    finally:
        realsense_simulator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Advanced 3D Sensing Integration

Create a comprehensive 3D sensing integration framework:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, PointCloud2, Image, CameraInfo
from geometry_msgs.msg import PointStamped
from std_msgs.msg import Header
import numpy as np
import math
from sensor_msgs_py import point_cloud2
from cv_bridge import CvBridge
import cv2

class Multi3DSensorFusion(Node):
    def __init__(self):
        super().__init__('multi_3d_sensor_fusion')

        # Publishers for fused data
        self.fused_pc_pub = self.create_publisher(PointCloud2, '/fused_pointcloud', 10)
        self.obstacle_pub = self.create_publisher(PointStamped, '/obstacle_detected', 10)

        # Subscribers for different sensor types
        self.lidar_sub = self.create_subscription(LaserScan, '/scan', self.lidar_callback, 10)
        self.depth_sub = self.create_subscription(Image, '/camera/depth/image_raw', self.depth_callback, 10)
        self.camera_info_sub = self.create_subscription(CameraInfo, '/camera/color/camera_info', self.camera_info_callback, 10)

        # Timer for fusion processing
        self.fusion_timer = self.create_timer(0.1, self.process_fusion)  # 10 Hz

        # Data buffers
        self.lidar_data = None
        self.depth_image = None
        self.camera_info = None
        self.camera_matrix = None

        # CV Bridge
        self.bridge = CvBridge()

        # Fusion parameters
        self.fusion_radius = 0.1  # 10cm radius for point matching
        self.obstacle_threshold = 0.5  # 50cm threshold for obstacle detection

        self.get_logger().info('Multi 3D Sensor Fusion initialized')

    def lidar_callback(self, msg):
        """Process incoming LiDAR data"""
        self.lidar_data = msg

    def depth_callback(self, msg):
        """Process incoming depth camera data"""
        try:
            # Convert ROS Image to OpenCV image
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='16UC1')
            self.depth_image = cv_image
        except Exception as e:
            self.get_logger().error(f'Error converting depth image: {e}')

    def camera_info_callback(self, msg):
        """Process camera info"""
        self.camera_info = msg
        # Extract camera matrix from camera info
        self.camera_matrix = np.array(msg.k).reshape(3, 3)

    def process_fusion(self):
        """Process sensor fusion when all data is available"""
        if self.lidar_data is None or self.depth_image is None or self.camera_matrix is None:
            return

        # Fuse LiDAR and depth camera data
        fused_points = self.fuse_sensors()

        # Create and publish fused point cloud
        if fused_points:
            header = Header()
            header.stamp = self.get_clock().now().to_msg()
            header.frame_id = 'map'  # Assuming fused in map frame

            fields = [
                PointField(name='x', offset=0, datatype=PointField.FLOAT32, count=1),
                PointField(name='y', offset=4, datatype=PointField.FLOAT32, count=1),
                PointField(name='z', offset=8, datatype=PointField.FLOAT32, count=1)
            ]

            pc_msg = point_cloud2.create_cloud(header, fields, fused_points)
            self.fused_pc_pub.publish(pc_msg)

        # Detect obstacles
        obstacles = self.detect_obstacles(fused_points)
        if obstacles:
            # Publish first detected obstacle
            obstacle_msg = PointStamped()
            obstacle_msg.header.stamp = self.get_clock().now().to_msg()
            obstacle_msg.header.frame_id = 'map'
            obstacle_msg.point.x = obstacles[0][0]
            obstacle_msg.point.y = obstacles[0][1]
            obstacle_msg.point.z = obstacles[0][2]
            self.obstacle_pub.publish(obstacle_msg)

    def fuse_sensors(self):
        """Fuse LiDAR and depth camera data"""
        fused_points = []

        # Add LiDAR points to fused cloud
        if self.lidar_data:
            for i, r in enumerate(self.lidar_data.ranges):
                if self.lidar_data.range_min <= r <= self.lidar_data.range_max:
                    angle = self.lidar_data.angle_min + i * self.lidar_data.angle_increment
                    x = r * math.cos(angle)
                    y = r * math.sin(angle)
                    z = 0.0  # 2D LiDAR is at ground level
                    fused_points.append([x, y, z])

        # Add depth camera points to fused cloud
        if self.depth_image is not None and self.camera_matrix is not None:
            depth_points = self.depth_to_3d_points(self.depth_image, self.camera_matrix)
            fused_points.extend(depth_points)

        return fused_points

    def depth_to_3d_points(self, depth_image, camera_matrix):
        """Convert depth image to 3D points"""
        points = []

        # Get camera parameters
        fx = camera_matrix[0, 0]
        fy = camera_matrix[1, 1]
        cx = camera_matrix[0, 2]
        cy = camera_matrix[1, 2]

        # Sample every N pixels to reduce computational load
        step = 4  # Use every 4th pixel

        for v in range(0, depth_image.shape[0], step):
            for u in range(0, depth_image.shape[1], step):
                depth = depth_image[v, u] / 1000.0  # Convert to meters

                if depth > 0 and depth < 10.0:  # Valid depth
                    # Convert pixel coordinates to 3D camera coordinates
                    x = (u - cx) * depth / fx
                    y = (v - cy) * depth / fy
                    z = depth
                    points.append([x, y, z])

        return points

    def detect_obstacles(self, points):
        """Detect obstacles in point cloud"""
        obstacles = []

        if not points:
            return obstacles

        # Simple obstacle detection: find clusters of points at similar heights
        # This is a basic implementation - real systems would use more sophisticated clustering
        for point in points:
            x, y, z = point
            # Consider obstacles as points that are close to the robot (within threshold)
            distance = math.sqrt(x*x + y*y)
            if distance < self.obstacle_threshold and z < 1.0:  # Ground-level obstacles
                obstacles.append(point)

        return obstacles

def main(args=None):
    rclpy.init(args=args)
    fusion_node = Multi3DSensorFusion()

    try:
        rclpy.spin(fusion_node)
    except KeyboardInterrupt:
        fusion_node.get_logger().info('Shutting down multi 3D sensor fusion')
    finally:
        fusion_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Sensor Validation and Calibration

Create a validation system for 3D sensors:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, Image
from std_msgs.msg import Float64
import numpy as np
import math
from cv_bridge import CvBridge

class SensorValidator(Node):
    def __init__(self):
        super().__init__('sensor_validator')

        # Subscribers for sensor data
        self.lidar_sub = self.create_subscription(LaserScan, '/scan', self.lidar_validation_callback, 10)
        self.depth_sub = self.create_subscription(Image, '/camera/depth/image_raw', self.depth_validation_callback, 10)

        # Publishers for validation scores
        self.lidar_score_pub = self.create_publisher(Float64, '/lidar_validation_score', 10)
        self.depth_score_pub = self.create_publisher(Float64, '/depth_validation_score', 10)

        # Timer for periodic validation
        self.validation_timer = self.create_timer(1.0, self.periodic_validation)

        # Data storage for validation
        self.lidar_buffer = []
        self.depth_buffer = []
        self.max_buffer_size = 50

        # Validation parameters
        self.lidar_range_threshold = 5.0  # Max reasonable range
        self.depth_accuracy_threshold = 0.05  # 5cm accuracy expectation
        self.expected_frame_rate = 30.0  # Expected depth camera frame rate

        # CV Bridge
        self.bridge = CvBridge()

        self.get_logger().info('Sensor Validator initialized')

    def lidar_validation_callback(self, msg):
        """Validate incoming LiDAR data"""
        # Store data for validation
        self.lidar_buffer.append({
            'timestamp': msg.header.stamp,
            'ranges': list(msg.ranges),
            'intensities': list(msg.intensities),
            'angle_min': msg.angle_min,
            'angle_max': msg.angle_max,
            'range_min': msg.range_min,
            'range_max': msg.range_max
        })

        # Limit buffer size
        if len(self.lidar_buffer) > self.max_buffer_size:
            self.lidar_buffer.pop(0)

        # Calculate and publish validation score
        score = self.validate_lidar_data(msg)
        score_msg = Float64()
        score_msg.data = score
        self.lidar_score_pub.publish(score_msg)

    def depth_validation_callback(self, msg):
        """Validate incoming depth data"""
        try:
            # Convert to OpenCV image for processing
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='16UC1')

            # Store data for validation
            self.depth_buffer.append({
                'timestamp': msg.header.stamp,
                'image': cv_image,
                'width': msg.width,
                'height': msg.height
            })

            # Limit buffer size
            if len(self.depth_buffer) > self.max_buffer_size:
                self.depth_buffer.pop(0)

            # Calculate and publish validation score
            score = self.validate_depth_data(cv_image)
            score_msg = Float64()
            score_msg.data = score
            self.depth_score_pub.publish(score_msg)

        except Exception as e:
            self.get_logger().error(f'Depth validation error: {e}')

    def validate_lidar_data(self, scan_msg):
        """Validate LiDAR data quality"""
        if not scan_msg.ranges:
            return 0.0

        # Check for reasonable range values
        valid_ranges = [r for r in scan_msg.ranges if scan_msg.range_min <= r <= scan_msg.range_max]
        valid_ratio = len(valid_ranges) / len(scan_msg.ranges)

        # Check for extreme values
        range_values = [r for r in scan_msg.ranges if r < float('inf')]
        if not range_values:
            return 0.0

        max_range = max(range_values)
        if max_range > self.lidar_range_threshold:
            return 0.5  # Partial score for some issues

        # Calculate continuity (how smooth the scan is)
        continuity_score = self.calculate_scan_continuity(scan_msg.ranges)

        # Combine scores
        overall_score = (valid_ratio * 0.4) + (continuity_score * 0.6)
        return min(1.0, max(0.0, overall_score))

    def calculate_scan_continuity(self, ranges):
        """Calculate how continuous/realistic the scan is"""
        if len(ranges) < 2:
            return 1.0

        # Calculate differences between adjacent ranges
        diffs = []
        for i in range(1, len(ranges)):
            if ranges[i-1] != float('inf') and ranges[i] != float('inf'):
                diff = abs(ranges[i] - ranges[i-1])
                diffs.append(diff)

        if not diffs:
            return 1.0

        # Calculate average difference and standard deviation
        avg_diff = sum(diffs) / len(diffs)

        # A good scan should have relatively small differences between adjacent points
        # unless there are actual sharp edges in the environment
        if avg_diff < 0.5:  # Less than 50cm average difference
            return 0.9
        elif avg_diff < 1.0:  # Less than 1m average difference
            return 0.7
        else:
            return 0.3  # Possibly noisy or unrealistic scan

    def validate_depth_data(self, depth_image):
        """Validate depth image quality"""
        if depth_image is None or depth_image.size == 0:
            return 0.0

        # Convert to float for processing
        depth_float = depth_image.astype(np.float32) / 1000.0  # Convert to meters

        # Check for reasonable depth values
        valid_depths = depth_float[(depth_float > 0.1) & (depth_float < 10.0)]  # 10cm to 10m
        valid_ratio = len(valid_depths) / depth_image.size

        # Check for depth consistency (real depth images have spatial coherence)
        consistency_score = self.calculate_depth_consistency(depth_float)

        # Combine scores
        overall_score = (valid_ratio * 0.5) + (consistency_score * 0.5)
        return min(1.0, max(0.0, overall_score))

    def calculate_depth_consistency(self, depth_image):
        """Calculate spatial consistency of depth image"""
        if depth_image.shape[0] < 2 or depth_image.shape[1] < 2:
            return 1.0

        # Calculate gradients to check for spatial consistency
        grad_x = np.gradient(depth_image, axis=1)
        grad_y = np.gradient(depth_image, axis=0)

        # Calculate average gradient magnitude
        grad_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        avg_gradient = np.nanmean(grad_magnitude[~np.isnan(grad_magnitude)])

        # Lower average gradients indicate more consistent depth (which is expected in real images)
        # but some variation is normal at object boundaries
        if avg_gradient < 0.1:
            return 0.9  # Very consistent (maybe too consistent?)
        elif avg_gradient < 0.5:
            return 0.8  # Good consistency
        elif avg_gradient < 1.0:
            return 0.6  # Acceptable but somewhat noisy
        else:
            return 0.3  # Too inconsistent

    def periodic_validation(self):
        """Perform periodic validation checks"""
        # Check timing consistency for depth camera
        if len(self.depth_buffer) >= 2:
            time_diffs = []
            for i in range(1, len(self.depth_buffer)):
                prev_time = self.depth_buffer[i-1]['timestamp']
                curr_time = self.depth_buffer[i]['timestamp']
                time_diff = (curr_time.nanosec - prev_time.nanosec) / 1e9
                if time_diff > 0:
                    time_diffs.append(time_diff)

            if time_diffs:
                avg_time_diff = sum(time_diffs) / len(time_diffs)
                actual_fps = 1.0 / avg_time_diff if avg_time_diff > 0 else 0

                # Check if frame rate is reasonable
                if abs(actual_fps - self.expected_frame_rate) / self.expected_frame_rate > 0.5:
                    self.get_logger().warn(f'Depth camera FPS is off: expected {self.expected_frame_rate}, got {actual_fps:.2f}')

def main(args=None):
    rclpy.init(args=args)
    validator = SensorValidator()

    try:
        rclpy.spin(validator)
    except KeyboardInterrupt:
        validator.get_logger().info('Shutting down sensor validator')
    finally:
        validator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Physical AI Deployment (Edge)

### Optimized 3D Sensing for NVIDIA Jetson Orin Nano

When deploying 3D sensing simulations to the NVIDIA Jetson Orin Nano, optimization is critical:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, Image
from std_msgs.msg import Header
import numpy as np
import math
from cv_bridge import CvBridge
import time
import psutil

class Edge3DSensorSimulator(Node):
    def __init__(self):
        super().__init__('edge_3d_sensor_simulator')

        # Publishers with reduced queue sizes for edge efficiency
        self.scan_pub = self.create_publisher(LaserScan, '/scan', 3)
        self.depth_pub = self.create_publisher(Image, '/camera/depth/image_raw', 3)

        # Timer with adaptive frequency
        self.timer = self.create_timer(0.05, self.publish_efficient_data)  # Start at 20 Hz

        # CV Bridge
        self.bridge = CvBridge()

        # Edge-optimized parameters
        self.lidar_resolution = 360  # Reduced from 1080 for efficiency
        self.depth_width = 320      # Reduced from 640 for efficiency
        self.depth_height = 240     # Reduced from 480 for efficiency

        # Resource monitoring
        self.cpu_threshold = 70.0
        self.adaptive_frequency = 20.0  # Start at 20 Hz
        self.last_publish_time = time.time()

        # Initialize scene
        self.time = 0.0

        self.get_logger().info('Edge 3D Sensor Simulator initialized')

    def publish_efficient_data(self):
        """Publish 3D sensor data with edge optimizations"""
        current_time = time.time()

        # Simple rate limiting
        if current_time - self.last_publish_time < 0.045:  # At least 22 Hz
            return

        self.last_publish_time = current_time

        # Monitor system resources
        cpu_percent = psutil.cpu_percent()

        # Adapt frequency based on CPU usage
        if cpu_percent > self.cpu_threshold:
            self.adaptive_frequency = max(10.0, self.adaptive_frequency * 0.9)  # Reduce frequency
        elif cpu_percent < 50.0:
            self.adaptive_frequency = min(30.0, self.adaptive_frequency * 1.05)  # Increase frequency

        # Update timer period if needed
        new_period = 1.0 / self.adaptive_frequency
        current_period = self.timer.timer_period_ns / 1e9
        if abs(new_period - current_period) > 0.01:  # 10ms change threshold
            # Note: In ROS2, we typically don't dynamically change timer period
            # In a real implementation, you might need to recreate the timer
            pass

        # Publish efficient LiDAR data
        self.publish_efficient_lidar()

        # Publish efficient depth data
        self.publish_efficient_depth()

        # Update simulation time
        self.time += 0.05

    def publish_efficient_lidar(self):
        """Publish optimized LiDAR data"""
        # Reduced resolution scan
        angle_min = -math.pi
        angle_max = math.pi
        angle_increment = (angle_max - angle_min) / self.lidar_resolution

        # Generate simplified scan
        ranges = []
        for i in range(self.lidar_resolution):
            angle = angle_min + i * angle_increment
            distance = self.calculate_efficient_distance(angle)

            # Add minimal noise
            noise = np.random.normal(0, 0.02)  # Reduced noise for efficiency
            noisy_distance = max(0.06, min(5.6, distance + noise))  # Keep within range
            ranges.append(noisy_distance)

        # Create and publish LaserScan
        scan_msg = LaserScan()
        scan_msg.header = Header()
        scan_msg.header.stamp = self.get_clock().now().to_msg()
        scan_msg.header.frame_id = 'laser_frame'

        scan_msg.angle_min = angle_min
        scan_msg.angle_max = angle_max
        scan_msg.angle_increment = angle_increment
        scan_msg.time_increment = 0.0
        scan_msg.scan_time = 0.05  # Match publishing rate
        scan_msg.range_min = 0.06
        scan_msg.range_max = 5.6
        scan_msg.ranges = ranges
        scan_msg.intensities = [50.0] * len(ranges)  # Constant intensity for efficiency

        self.scan_pub.publish(scan_msg)

    def calculate_efficient_distance(self, angle):
        """Calculate distance with efficient computation"""
        # Simplified environment calculation
        robot_x, robot_y = 0.0, 0.0

        # Quick wall distance calculation
        if abs(math.cos(angle)) > 0.001:
            dist_to_x_wall = (2.5 - abs(robot_x)) / abs(math.cos(angle))
        else:
            dist_to_x_wall = float('inf')

        if abs(math.sin(angle)) > 0.001:
            dist_to_y_wall = (2.5 - abs(robot_y)) / abs(math.sin(angle))
        else:
            dist_to_y_wall = float('inf')

        wall_distance = min(dist_to_x_wall, dist_to_y_wall)

        # Add a simple obstacle
        obstacle_angle = math.atan2(0.5 - robot_y, 1.0 - robot_x)
        obstacle_diff = abs(angle - obstacle_angle)

        if obstacle_diff < 0.3:  # Within obstacle sector
            obstacle_distance = math.sqrt((1.0 - robot_x)**2 + (0.5 - robot_y)**2) - 0.3
            return min(wall_distance, obstacle_distance)

        return wall_distance

    def publish_efficient_depth(self):
        """Publish optimized depth camera data"""
        # Create simplified depth image
        depth_image = np.zeros((self.depth_height, self.depth_width), dtype=np.uint16)

        # Simplified scene generation
        center_x, center_y = self.depth_width // 2, self.depth_height // 2

        for y in range(self.depth_height):
            for x in range(self.depth_width):
                # Calculate distance from center
                dx = x - center_x
                dy = y - center_y
                distance = 1500 + 300 * math.sin(0.02 * math.sqrt(dx*dx + dy*dy))

                # Add minimal noise
                noise = np.random.normal(0, 10)
                depth = max(200, min(5000, distance + noise))
                depth_image[y, x] = int(depth)

        # Convert to ROS message and publish
        depth_msg = self.bridge.cv2_to_imgmsg(depth_image, encoding='16UC1')
        depth_msg.header.stamp = self.get_clock().now().to_msg()
        depth_msg.header.frame_id = 'camera_depth_optical_frame'

        self.depth_pub.publish(depth_msg)

def main(args=None):
    rclpy.init(args=args)
    edge_simulator = Edge3DSensorSimulator()

    try:
        rclpy.spin(edge_simulator)
    except KeyboardInterrupt:
        edge_simulator.get_logger().info('Shutting down edge 3D sensor simulator')
    finally:
        edge_simulator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Hardware-Specific Optimization for Intel RealSense D435i

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, CameraInfo
from std_msgs.msg import Header
from cv_bridge import CvBridge
import numpy as np
import math
import time

class RealSenseD435iEdgeOptimizer(Node):
    def __init__(self):
        super().__init__('realsense_d435i_edge_optimizer')

        # Publishers
        self.color_pub = self.create_publisher(Image, '/camera/color/image_raw', 3)
        self.depth_pub = self.create_publisher(Image, '/camera/depth/image_raw', 3)
        self.info_pub = self.create_publisher(CameraInfo, '/camera/color/camera_info', 3)

        # Timer for publishing
        self.timer = self.create_timer(0.066, self.publish_optimized_data)  # ~15 FPS for efficiency

        # CV Bridge
        self.bridge = CvBridge()

        # RealSense D435i optimized parameters for edge
        self.width = 424  # Reduced from 640
        self.height = 240  # Reduced from 480
        self.fps = 15      # Reduced frame rate for efficiency

        # Optimized camera matrix for reduced resolution
        self.camera_matrix = np.array([
            [410.712, 0.0, 210.557],  # fx, 0, cx (scaled for 424x240)
            [0.0, 410.528, 120.661],  # 0, fy, cy (scaled for 424x240)
            [0.0, 0.0, 1.0]
        ])

        # Simplified scene representation
        self.time = 0.0
        self.scene_objects = [
            {'type': 'cube', 'x': 0.5, 'y': 0.2, 'z': 1.5, 'size': 0.3, 'color': (100, 150, 200)},
            {'type': 'sphere', 'x': -0.5, 'y': -0.3, 'z': 1.8, 'radius': 0.25, 'color': (50, 200, 100)}
        ]

        self.get_logger().info('RealSense D435i Edge Optimizer initialized')

    def publish_optimized_data(self):
        """Publish optimized RealSense data for edge devices"""
        # Update time
        self.time += 0.066

        # Generate optimized color image
        color_image = self.generate_optimized_color_image()
        color_msg = self.bridge.cv2_to_imgmsg(color_image, encoding='bgr8')
        color_msg.header.stamp = self.get_clock().now().to_msg()
        color_msg.header.frame_id = 'camera_color_optical_frame'
        self.color_pub.publish(color_msg)

        # Generate optimized depth image
        depth_image = self.generate_optimized_depth_image()
        depth_msg = self.bridge.cv2_to_imgmsg(depth_image, encoding='16UC1')
        depth_msg.header.stamp = color_msg.header.stamp
        depth_msg.header.frame_id = 'camera_depth_optical_frame'
        self.depth_pub.publish(depth_msg)

        # Publish camera info
        info_msg = self.create_optimized_camera_info()
        info_msg.header.stamp = color_msg.header.stamp
        info_msg.header.frame_id = 'camera_color_optical_frame'
        self.info_pub.publish(info_msg)

    def generate_optimized_color_image(self):
        """Generate optimized color image with reduced complexity"""
        # Create base image
        image = np.zeros((self.height, self.width, 3), dtype=np.uint8)

        # Use simplified rendering for efficiency
        t = self.time

        for obj in self.scene_objects:
            if obj['type'] == 'cube':
                # Project 3D position to 2D
                x_3d = obj['x']
                y_3d = obj['y']
                z_3d = obj['z']

                # Simple perspective projection
                scale = 200 / z_3d  # Simple perspective
                x_2d = int(self.width/2 + x_3d * scale)
                y_2d = int(self.height/2 - y_3d * scale)  # Flip Y axis

                # Adjust size based on distance
                size_2d = int(obj['size'] * scale)

                # Draw rectangle
                if 0 <= x_2d <= self.width and 0 <= y_2d <= self.height:
                    pt1 = (x_2d - size_2d//2, y_2d - size_2d//2)
                    pt2 = (x_2d + size_2d//2, y_2d + size_2d//2)
                    cv2.rectangle(image, pt1, pt2, obj['color'], -1)

            elif obj['type'] == 'sphere':
                # Project sphere to 2D
                x_3d = obj['x'] + 0.2 * math.sin(0.5 * t)  # Add motion
                y_3d = obj['y'] + 0.15 * math.cos(0.3 * t)
                z_3d = obj['z']

                scale = 200 / z_3d
                x_2d = int(self.width/2 + x_3d * scale)
                y_2d = int(self.height/2 - y_3d * scale)

                radius_2d = int(obj['radius'] * scale)

                if 0 <= x_2d <= self.width and 0 <= y_2d <= self.height:
                    cv2.circle(image, (x_2d, y_2d), radius_2d, obj['color'], -1)

        # Add minimal noise for realism
        noise = np.random.randint(0, 10, image.shape, dtype=np.int16)
        image = np.clip(image.astype(np.int16) + noise, 0, 255).astype(np.uint8)

        return image

    def generate_optimized_depth_image(self):
        """Generate optimized depth image"""
        depth_image = np.zeros((self.height, self.width), dtype=np.uint16)

        # Simplified depth calculation
        for y in range(self.height):
            for x in range(self.width):
                # Calculate base depth based on a simple gradient
                x_norm = (x - self.width/2) / (self.width/2)
                y_norm = (y - self.height/2) / (self.height/2)

                # Base depth: center is closer, edges are farther
                base_depth = 1500 + 500 * math.sqrt(x_norm*x_norm + y_norm*y_norm)

                # Add objects
                min_depth = base_depth

                for obj in self.scene_objects:
                    if obj['type'] == 'cube':
                        obj_x = obj['x']
                        obj_y = obj['y']
                        obj_z = obj['z']

                        # Project object to 2D and check proximity
                        scale = 200 / obj_z
                        obj_x_2d = int(self.width/2 + obj_x * scale)
                        obj_y_2d = int(self.height/2 - obj_y * scale)

                        pixel_dist = math.sqrt((x - obj_x_2d)**2 + (y - obj_y_2d)**2)
                        if pixel_dist < int(obj['size'] * scale):
                            min_depth = min(min_depth, obj_z * 1000)  # Convert to mm

                    elif obj['type'] == 'sphere':
                        obj_x = obj['x'] + 0.2 * math.sin(0.5 * self.time)
                        obj_y = obj['y'] + 0.15 * math.cos(0.3 * self.time)
                        obj_z = obj['z']

                        scale = 200 / obj_z
                        obj_x_2d = int(self.width/2 + obj_x * scale)
                        obj_y_2d = int(self.height/2 - obj_y * scale)

                        pixel_dist = math.sqrt((x - obj_x_2d)**2 + (y - obj_y_2d)**2)
                        if pixel_dist < int(obj['radius'] * scale):
                            min_depth = min(min_depth, obj_z * 1000)

                # Add minimal noise
                noise = np.random.normal(0, 5)
                depth = max(200, min(5000, min_depth + noise))
                depth_image[y, x] = int(depth)

        return depth_image.astype(np.uint16)

    def create_optimized_camera_info(self):
        """Create optimized camera info"""
        info_msg = CameraInfo()
        info_msg.width = self.width
        info_msg.height = self.height

        # Optimized camera matrix
        info_msg.k = [
            float(self.camera_matrix[0, 0]), 0.0, float(self.camera_matrix[0, 2]),
            0.0, float(self.camera_matrix[1, 1]), float(self.camera_matrix[1, 2]),
            0.0, 0.0, 1.0
        ]

        # Minimal distortion for efficiency
        info_msg.d = [0.0, 0.0, 0.0, 0.0, 0.0]

        info_msg.r = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]

        info_msg.p = [
            float(self.camera_matrix[0, 0]), 0.0, float(self.camera_matrix[0, 2]), 0.0,
            0.0, float(self.camera_matrix[1, 1]), float(self.camera_matrix[1, 2]), 0.0,
            0.0, 0.0, 1.0, 0.0
        ]

        return info_msg

def main(args=None):
    rclpy.init(args=args)
    optimizer = RealSenseD435iEdgeOptimizer()

    try:
        rclpy.spin(optimizer)
    except KeyboardInterrupt:
        optimizer.get_logger().info('Shutting down RealSense optimizer')
    finally:
        optimizer.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    import cv2
    main()
```

## Summary

LiDAR and depth camera simulation is essential for creating realistic 3D sensing capabilities in digital twin environments. The key aspects of 3D sensing simulation include:

1. **Realistic Physics Modeling**: Simulating the physical principles of LiDAR and depth sensing with appropriate noise and accuracy characteristics
2. **Hardware Specification Matching**: Ensuring simulated sensors match real hardware like the Intel RealSense D435i
3. **Multi-Sensor Fusion**: Combining data from different 3D sensing technologies for comprehensive perception
4. **Edge Optimization**: Adapting simulation complexity for resource-constrained platforms like NVIDIA Jetson Orin Nano
5. **Validation and Calibration**: Ensuring simulated sensor data matches expected real-world behavior

The 3D sensing simulation system provides the spatial awareness capabilities needed for robotics applications, enabling development and testing of perception algorithms before physical deployment.

## Exercises

1. Create a LiDAR simulator that matches the specifications of a specific LiDAR model (e.g., Hokuyo UTM-30LX)
2. Implement a depth camera simulator that accurately models the Intel RealSense D435i's stereo vision characteristics
3. Develop a sensor fusion algorithm that combines LiDAR and depth camera data for improved environment mapping
4. Create an optimization framework that adapts simulation complexity based on available computational resources
5. Design a validation system that compares simulated sensor data with real hardware measurements