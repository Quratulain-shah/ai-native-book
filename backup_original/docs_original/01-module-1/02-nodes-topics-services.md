---
title: "ROS 2 Communication Patterns: Nodes, Topics, and Services"
slug: "/module-1/nodes-topics-services"
sidebar_position: 3
---

# ROS 2 Communication Patterns: Nodes, Topics, and Services

## Introduction to ROS 2 Communication

ROS 2 communication patterns form the backbone of distributed robotic systems. Understanding how nodes communicate through topics, services, and actions is essential for building robust, scalable robotic applications. This chapter explores the three primary communication patterns in ROS 2, their appropriate use cases, and implementation details using the `rclpy` Python client library.

## Theory: Communication Pattern Fundamentals

### Node Architecture

Nodes are the fundamental building blocks of ROS 2 systems. Each node represents a single process that performs computation and communicates with other nodes. Nodes are designed to be:

- **Modular**: Each node performs a specific function
- **Independent**: Nodes can be developed and tested separately
- **Communicative**: Nodes interact through well-defined interfaces
- **Discoverable**: Nodes automatically discover each other on the network

#### Node Lifecycle

ROS 2 nodes follow a defined lifecycle with four primary states:

1. **Unconfigured**: Node created but not yet configured
2. **Inactive**: Node configured but not actively running
3. **Active**: Node running and performing its function
4. **Finalized**: Node cleaned up and ready for destruction

### Topic-Based Communication (Publisher-Subscriber)

Topics implement an asynchronous, many-to-many communication pattern using the publish-subscribe model:

#### Key Characteristics
- **Asynchronous**: Publishers and subscribers operate independently
- **Many-to-Many**: Multiple publishers can publish to one topic; multiple subscribers can listen to one topic
- **Data-Centric**: Communication is centered around data streams
- **Fire-and-Forget**: Publishers don't know or care if anyone receives their messages

#### Message Types
All messages sent over topics must be of a specific type defined in `.msg` files. Common message types include:
- `std_msgs`: Basic data types (Int32, Float64, String, etc.)
- `sensor_msgs`: Sensor data (LaserScan, Image, Imu, etc.)
- `geometry_msgs`: Geometric data (Point, Pose, Twist, etc.)
- `nav_msgs`: Navigation data (Odometry, Path, etc.)

### Service-Based Communication (Request-Response)

Services implement synchronous, one-to-one communication using a request-response pattern:

#### Key Characteristics
- **Synchronous**: Client waits for response before continuing
- **One-to-One**: One client communicates with one server
- **Stateless**: Each request is independent
- **Blocking**: Client thread is blocked until response is received

#### Use Cases for Services
- Configuration and calibration
- One-time operations
- Querying system state
- Command execution with immediate feedback

### Quality of Service (QoS) in Communication

QoS profiles allow fine-tuning of communication behavior to meet specific application requirements:

#### Reliability Policies
- **Reliable**: All messages are delivered with retries (for critical data)
- **Best Effort**: Messages may be lost (for high-frequency, non-critical data)

#### Durability Policies
- **Transient Local**: Late-joining subscribers receive the last message
- **Volatile**: Only new messages are sent to subscribers

#### History Policies
- **Keep Last**: Maintain a fixed number of recent messages
- **Keep All**: Maintain all messages (use with caution for memory usage)

## Simulation: Implementing Communication Patterns

### Publisher Implementation

Let's create a publisher node that simulates sensor data:

```python
# File: ~/ros2_ws/src/my_robot_bringup/my_robot_bringup/sensor_publisher.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from std_msgs.msg import Header
import math
import random


class SensorPublisher(Node):
    def __init__(self):
        super().__init__('sensor_publisher')

        # Create publisher for laser scan data
        self.scan_publisher = self.create_publisher(LaserScan, 'scan', 10)

        # Timer for publishing sensor data
        timer_period = 0.1  # 10Hz
        self.timer = self.create_timer(timer_period, self.publish_scan)

        # Sensor parameters
        self.angle_min = -math.pi / 2  # -90 degrees
        self.angle_max = math.pi / 2   # 90 degrees
        self.angle_increment = math.pi / 180  # 1 degree
        self.scan_time = 0.1
        self.range_min = 0.1
        self.range_max = 10.0

        self.get_logger().info('Sensor Publisher initialized')

    def publish_scan(self):
        """Publish simulated laser scan data"""
        scan_msg = LaserScan()

        # Set header
        scan_msg.header = Header()
        scan_msg.header.stamp = self.get_clock().now().to_msg()
        scan_msg.header.frame_id = 'laser_frame'

        # Set scan parameters
        scan_msg.angle_min = self.angle_min
        scan_msg.angle_max = self.angle_max
        scan_msg.angle_increment = self.angle_increment
        scan_msg.time_increment = 0.0
        scan_msg.scan_time = self.scan_time
        scan_msg.range_min = self.range_min
        scan_msg.range_max = self.range_max

        # Generate simulated ranges with some obstacles
        num_ranges = int((self.angle_max - self.angle_min) / self.angle_increment) + 1
        ranges = []

        for i in range(num_ranges):
            angle = self.angle_min + i * self.angle_increment

            # Simulate different ranges based on angle
            # Create a "wall" at 2 meters in front
            if -0.2 < angle < 0.2:
                base_range = 2.0
            # Create a "corner" at 3 meters
            elif angle < -0.5 or angle > 0.5:
                base_range = 3.0
            # Clear path in between
            else:
                base_range = 5.0

            # Add some noise to make it more realistic
            noise = random.uniform(-0.1, 0.1)
            final_range = max(self.range_min, min(self.range_max, base_range + noise))
            ranges.append(final_range)

        scan_msg.ranges = ranges
        scan_msg.intensities = [100.0] * len(ranges)  # All intensities the same

        self.scan_publisher.publish(scan_msg)
        self.get_logger().info(f'Published scan with {len(ranges)} ranges')


def main(args=None):
    rclpy.init(args=args)
    sensor_publisher = SensorPublisher()

    try:
        rclpy.spin(sensor_publisher)
    except KeyboardInterrupt:
        pass
    finally:
        sensor_publisher.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Subscriber Implementation

Now let's create a subscriber that processes the sensor data:

```python
# File: ~/ros2_ws/src/my_robot_bringup/my_robot_bringup/obstacle_detector.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist
import math


class ObstacleDetector(Node):
    def __init__(self):
        super().__init__('obstacle_detector')

        # Create subscription to laser scan
        self.scan_subscription = self.create_subscription(
            LaserScan,
            'scan',
            self.scan_callback,
            10
        )

        # Create publisher for velocity commands
        self.cmd_vel_publisher = self.create_publisher(Twist, 'cmd_vel', 10)

        # Parameters for obstacle detection
        self.safe_distance = 1.0  # meters
        self.obstacle_detected = False

        self.get_logger().info('Obstacle Detector initialized')

    def scan_callback(self, msg):
        """Process incoming laser scan data"""
        # Check for obstacles in the forward direction
        # Typically, the middle of the scan is the front
        if len(msg.ranges) == 0:
            return

        # Get the middle range (front direction)
        front_index = len(msg.ranges) // 2
        front_range = msg.ranges[front_index]

        # Check a wider area for obstacles
        safe_ranges = []
        for i in range(max(0, front_index - 10), min(len(msg.ranges), front_index + 10)):
            if not math.isnan(msg.ranges[i]) and not math.isinf(msg.ranges[i]):
                safe_ranges.append(msg.ranges[i])

        if safe_ranges:
            min_range = min(safe_ranges)
            self.obstacle_detected = min_range < self.safe_distance

            if self.obstacle_detected:
                self.get_logger().warn(f'Obstacle detected at {min_range:.2f}m, stopping robot')
                self.stop_robot()
            else:
                self.get_logger().info(f'Path clear, range: {min_range:.2f}m')
                self.move_forward()
        else:
            # No valid ranges, stop the robot
            self.get_logger().warn('No valid laser ranges, stopping robot')
            self.stop_robot()

    def move_forward(self):
        """Send command to move robot forward"""
        twist = Twist()
        twist.linear.x = 0.5  # m/s
        twist.angular.z = 0.0  # rad/s
        self.cmd_vel_publisher.publish(twist)

    def stop_robot(self):
        """Send command to stop robot"""
        twist = Twist()
        twist.linear.x = 0.0
        twist.angular.z = 0.0
        self.cmd_vel_publisher.publish(twist)


def main(args=None):
    rclpy.init(args=args)
    obstacle_detector = ObstacleDetector()

    try:
        rclpy.spin(obstacle_detector)
    except KeyboardInterrupt:
        pass
    finally:
        obstacle_detector.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Service Implementation

Now let's create a service for robot configuration:

```python
# File: ~/ros2_ws/src/my_robot_bringup/my_robot_bringup/config_service.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from my_robot_interfaces.srv import RobotConfig  # Custom service type


class ConfigService(Node):
    def __init__(self):
        super().__init__('config_service')

        # Default configuration
        self.safe_distance = 1.0
        self.linear_speed = 0.5
        self.angular_speed = 0.5

        # Create service server
        self.srv = self.create_service(
            RobotConfig,
            'set_robot_config',
            self.config_callback
        )

        self.get_logger().info('Config Service initialized')

    def config_callback(self, request, response):
        """Handle configuration requests"""
        self.get_logger().info(f'Received configuration request')

        # Update configuration based on request
        if request.param_name == 'safe_distance':
            self.safe_distance = request.param_value
            response.success = True
            response.message = f'Safe distance set to {self.safe_distance}m'
        elif request.param_name == 'linear_speed':
            self.linear_speed = request.param_value
            response.success = True
            response.message = f'Linear speed set to {self.linear_speed}m/s'
        elif request.param_name == 'angular_speed':
            self.angular_speed = request.param_value
            response.success = True
            response.message = f'Angular speed set to {self.angular_speed}rad/s'
        else:
            response.success = False
            response.message = f'Unknown parameter: {request.param_name}'

        self.get_logger().info(response.message)
        return response


def main(args=None):
    rclpy.init(args=args)
    config_service = ConfigService()

    try:
        rclpy.spin(config_service)
    except KeyboardInterrupt:
        pass
    finally:
        config_service.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Service Client Implementation

```python
# File: ~/ros2_ws/src/my_robot_bringup/my_robot_bringup/config_client.py
import rclpy
from rclpy.node import Node
from my_robot_interfaces.srv import RobotConfig


class ConfigClient(Node):
    def __init__(self):
        super().__init__('config_client')

        # Create client for the config service
        self.cli = self.create_client(RobotConfig, 'set_robot_config')

        # Wait for service to be available
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Config service not available, waiting...')

        self.get_logger().info('Config client initialized')

    def send_config_request(self, param_name, param_value):
        """Send a configuration request to the service"""
        request = RobotConfig.Request()
        request.param_name = param_name
        request.param_value = param_value

        self.get_logger().info(f'Sending config request: {param_name} = {param_value}')

        future = self.cli.call_async(request)
        rclpy.spin_until_future_complete(self, future)

        if future.result() is not None:
            response = future.result()
            self.get_logger().info(f'Service response: {response.message}')
            return response.success
        else:
            self.get_logger().error('Service call failed')
            return False


def main(args=None):
    rclpy.init(args=args)
    config_client = ConfigClient()

    # Example configuration calls
    config_client.send_config_request('safe_distance', 1.5)
    config_client.send_config_request('linear_speed', 0.8)
    config_client.send_config_request('angular_speed', 0.6)

    config_client.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Advanced Communication: Actions

For goal-oriented tasks, we can implement actions:

```python
# File: ~/ros2_ws/src/my_robot_bringup/my_robot_bringup/navigation_action.py
import rclpy
from rclpy.action import ActionServer, CancelResponse, GoalResponse
from rclpy.node import Node
from my_robot_interfaces.action import NavigateToPose  # Custom action type
from geometry_msgs.msg import Pose
from std_msgs.msg import Header
import time


class NavigationActionServer(Node):
    def __init__(self):
        super().__init__('navigation_action_server')

        # Create action server
        self._action_server = ActionServer(
            self,
            NavigateToPose,
            'navigate_to_pose',
            execute_callback=self.execute_callback,
            goal_callback=self.goal_callback,
            cancel_callback=self.cancel_callback
        )

        # Publisher for feedback
        self.feedback_publisher = self.create_publisher(
            NavigateToPose.Feedback,
            'navigate_to_pose/_action/feedback',
            10
        )

        self.get_logger().info('Navigation Action Server initialized')

    def goal_callback(self, goal_request):
        """Accept or reject goals"""
        self.get_logger().info('Received navigation goal')
        return GoalResponse.ACCEPT

    def cancel_callback(self, goal_handle):
        """Accept or reject cancel requests"""
        self.get_logger().info('Received cancel request')
        return CancelResponse.ACCEPT

    def execute_callback(self, goal_handle):
        """Execute the navigation goal"""
        self.get_logger().info('Executing navigation goal')

        # Get target pose from goal
        target_pose = goal_handle.request.target_pose

        # Simulate navigation progress
        feedback_msg = NavigateToPose.Feedback()
        feedback_msg.current_pose = target_pose  # Simplified

        # Simulate navigation (in a real system, this would involve actual navigation)
        for i in range(0, 101, 10):  # 10 steps to completion
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return NavigateToPose.Result()

            # Update feedback
            feedback_msg.progress = float(i)
            goal_handle.publish_feedback(feedback_msg)

            # Simulate navigation progress
            time.sleep(0.5)

            self.get_logger().info(f'Navigation progress: {i}%')

        # Goal completed
        goal_handle.succeed()
        result = NavigateToPose.Result()
        result.success = True
        result.message = 'Navigation completed successfully'

        self.get_logger().info('Navigation goal completed')
        return result


def main(args=None):
    rclpy.init(args=args)
    action_server = NavigationActionServer()

    try:
        rclpy.spin(action_server)
    except KeyboardInterrupt:
        pass
    finally:
        action_server.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Real: Physical Deployment on Jetson Orin Nano

### Optimized Communication for Edge Computing

When deploying to the Jetson Orin Nano, communication patterns need to be optimized for the platform's constraints and capabilities:

```python
# File: ~/ros2_ws/src/my_robot_bringup/my_robot_bringup/jetson_communication.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, LaserScan
from geometry_msgs.msg import Twist
from std_msgs.msg import Header
from cv_bridge import CvBridge
import numpy as np
import cv2
from threading import Thread
import queue
import psutil


class JetsonCommunicationNode(Node):
    def __init__(self):
        super().__init__('jetson_communication_node')

        # Initialize CV bridge for image processing
        self.bridge = CvBridge()

        # Create publishers with optimized QoS for Jetson
        from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy

        # High-frequency sensor data (camera)
        sensor_qos = QoSProfile(
            depth=1,
            reliability=ReliabilityPolicy.BEST_EFFORT,
            durability=DurabilityPolicy.VOLATILE
        )

        # Critical control data (cmd_vel)
        control_qos = QoSProfile(
            depth=10,
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.VOLATILE
        )

        # Publishers
        self.image_publisher = self.create_publisher(Image, 'camera/image_raw', sensor_qos)
        self.scan_publisher = self.create_publisher(LaserScan, 'scan', sensor_qos)
        self.cmd_vel_publisher = self.create_publisher(Twist, 'cmd_vel', control_qos)

        # Subscriptions
        self.cmd_vel_subscription = self.create_subscription(
            Twist,
            'cmd_vel',
            self.cmd_vel_callback,
            control_qos
        )

        # Threading for performance
        self.image_queue = queue.Queue(maxsize=2)  # Limit queue size to prevent memory issues
        self.processing_thread = Thread(target=self.process_images, daemon=True)
        self.processing_thread.start()

        # Timer for system monitoring
        self.monitor_timer = self.create_timer(5.0, self.system_monitor)

        # Performance tracking
        self.message_count = 0

        self.get_logger().info('Jetson Communication Node initialized')

    def cmd_vel_callback(self, msg):
        """Handle incoming velocity commands"""
        # Process velocity command (in a real system, this would interface with hardware)
        self.get_logger().debug(f'Received cmd_vel: linear.x={msg.linear.x}, angular.z={msg.angular.z}')

        # Echo the command to demonstrate communication
        self.cmd_vel_publisher.publish(msg)
        self.message_count += 1

    def process_images(self):
        """Process images in a separate thread"""
        while rclpy.ok():
            try:
                # Get image from queue (non-blocking)
                if not self.image_queue.empty():
                    image_data = self.image_queue.get_nowait()

                    # Process image (example: convert to grayscale)
                    gray_image = cv2.cvtColor(image_data, cv2.COLOR_BGR2GRAY)

                    # Convert back to ROS Image and publish
                    ros_image = self.bridge.cv2_to_imgmsg(gray_image, encoding="mono8")
                    ros_image.header = Header()
                    ros_image.header.stamp = self.get_clock().now().to_msg()
                    ros_image.header.frame_id = "camera_optical_frame"

                    self.image_publisher.publish(ros_image)

            except queue.Empty:
                # No image to process, continue
                pass
            except Exception as e:
                self.get_logger().error(f'Error processing image: {str(e)}')

    def system_monitor(self):
        """Monitor system resources"""
        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent

        self.get_logger().info(
            f'System Monitor - CPU: {cpu_percent}%, Memory: {memory_percent}%, '
            f'Messages processed: {self.message_count}'
        )

        # Log warnings if resource usage is high
        if cpu_percent > 80:
            self.get_logger().warn(f'High CPU usage: {cpu_percent}%')
        if memory_percent > 80:
            self.get_logger().warn(f'High memory usage: {memory_percent}%')

    def publish_sensor_data(self, image_data=None, laser_ranges=None):
        """Publish sensor data with proper error handling"""
        try:
            # Publish image if provided
            if image_data is not None:
                try:
                    ros_image = self.bridge.cv2_to_imgmsg(image_data, encoding="bgr8")
                    ros_image.header = Header()
                    ros_image.header.stamp = self.get_clock().now().to_msg()
                    ros_image.header.frame_id = "camera_optical_frame"
                    self.image_publisher.publish(ros_image)
                except Exception as e:
                    self.get_logger().error(f'Error publishing image: {str(e)}')

            # Publish laser scan if provided
            if laser_ranges is not None:
                scan_msg = LaserScan()
                scan_msg.header = Header()
                scan_msg.header.stamp = self.get_clock().now().to_msg()
                scan_msg.header.frame_id = "laser_frame"

                # Set scan parameters
                scan_msg.angle_min = -np.pi/2
                scan_msg.angle_max = np.pi/2
                scan_msg.angle_increment = np.pi/180  # 1 degree
                scan_msg.time_increment = 0.0
                scan_msg.scan_time = 0.1
                scan_msg.range_min = 0.1
                scan_msg.range_max = 10.0
                scan_msg.ranges = laser_ranges
                scan_msg.intensities = [100.0] * len(laser_ranges)

                self.scan_publisher.publish(scan_msg)

        except Exception as e:
            self.get_logger().error(f'Error publishing sensor data: {str(e)}')

    def destroy_node(self):
        """Clean up resources"""
        if hasattr(self, 'processing_thread'):
            # Stop processing thread gracefully
            pass
        super().destroy_node()


def main(args=None):
    rclpy.init(args=args)

    # Optimize for Jetson's multi-core architecture
    jetson_comm = JetsonCommunicationNode()

    try:
        rclpy.spin(jetson_comm)
    except KeyboardInterrupt:
        pass
    finally:
        jetson_comm.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Hardware Integration Considerations

When integrating with real hardware on the Jetson Orin Nano:

```python
# File: ~/ros2_ws/src/my_robot_bringup/my_robot_bringup/hardware_interface.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, LaserScan, Imu, BatteryState
from geometry_msgs.msg import Twist
from std_msgs.msg import Float32, Bool
import time
import threading
from collections import deque


class HardwareInterface(Node):
    def __init__(self):
        super().__init__('hardware_interface')

        # Publishers for hardware data
        self.imu_publisher = self.create_publisher(Imu, 'imu/data', 10)
        self.battery_publisher = self.create_publisher(BatteryState, 'battery/state', 10)
        self.system_status_publisher = self.create_publisher(Bool, 'system/ready', 10)

        # Subscribers for commands
        self.cmd_vel_subscription = self.create_subscription(
            Twist, 'cmd_vel', self.cmd_vel_callback, 10)

        # Hardware interface components
        self.motors_connected = False
        self.sensors_connected = False
        self.battery_level = 100.0  # percentage

        # Threading for hardware polling
        self.hardware_thread = threading.Thread(target=self.poll_hardware, daemon=True)
        self.hardware_thread.start()

        # Safety monitoring
        self.last_cmd_time = self.get_clock().now()
        self.safety_timeout = 1.0  # seconds
        self.safety_timer = self.create_timer(0.1, self.safety_check)

        self.get_logger().info('Hardware Interface initialized')

    def cmd_vel_callback(self, msg):
        """Handle velocity commands and send to hardware"""
        # Update last command time for safety
        self.last_cmd_time = self.get_clock().now()

        # In a real implementation, this would send commands to motors
        # For simulation, we'll just log the command
        self.get_logger().info(f'Command received: linear.x={msg.linear.x}, angular.z={msg.angular.z}')

        # Safety: check if command is reasonable
        if abs(msg.linear.x) > 2.0 or abs(msg.angular.z) > 2.0:
            self.get_logger().warn('Unsafe velocity command received')
            return

        # Send to hardware (placeholder)
        self.send_to_motors(msg)

    def send_to_motors(self, cmd_vel):
        """Send velocity command to physical motors"""
        # This would interface with actual motor controllers
        # For now, we'll simulate the hardware response
        pass

    def poll_hardware(self):
        """Poll hardware sensors in a separate thread"""
        while rclpy.ok():
            try:
                # Simulate reading from hardware
                self.read_imu()
                self.read_battery()
                self.check_system_status()

                # Sleep to avoid overwhelming the system
                time.sleep(0.05)  # 20Hz polling

            except Exception as e:
                self.get_logger().error(f'Error polling hardware: {str(e)}')

    def read_imu(self):
        """Read IMU data from hardware"""
        # In a real system, this would read from actual IMU
        # For simulation, we'll create dummy data
        imu_msg = Imu()
        imu_msg.header = self.create_header()

        # Simulate some movement
        import random
        imu_msg.linear_acceleration.x = random.uniform(-0.1, 0.1)
        imu_msg.linear_acceleration.y = random.uniform(-0.1, 0.1)
        imu_msg.linear_acceleration.z = 9.8 + random.uniform(-0.1, 0.1)

        self.imu_publisher.publish(imu_msg)

    def read_battery(self):
        """Read battery status from hardware"""
        battery_msg = BatteryState()
        battery_msg.header = self.create_header()
        battery_msg.percentage = max(0.0, min(100.0, self.battery_level))
        battery_msg.voltage = 12.6  # Simulated voltage
        battery_msg.current = -1.5  # Discharging
        battery_msg.charge = -1.0  # Unknown
        battery_msg.capacity = -1.0  # Unknown
        battery_msg.design_capacity = -1.0  # Unknown
        battery_msg.power_supply_status = BatteryState.POWER_SUPPLY_STATUS_DISCHARGING
        battery_msg.power_supply_health = BatteryState.POWER_SUPPLY_HEALTH_GOOD
        battery_msg.power_supply_technology = BatteryState.POWER_SUPPLY_TECHNOLOGY_LION

        self.battery_publisher.publish(battery_msg)

        # Simulate battery drain
        self.battery_level -= 0.01  # Very slow drain for simulation

    def check_system_status(self):
        """Check overall system status"""
        status_msg = Bool()
        status_msg.data = self.motors_connected and self.sensors_connected
        self.system_status_publisher.publish(status_msg)

    def create_header(self):
        """Create standard header for messages"""
        from std_msgs.msg import Header
        header = Header()
        header.stamp = self.get_clock().now().to_msg()
        header.frame_id = "base_link"
        return header

    def safety_check(self):
        """Check safety conditions"""
        current_time = self.get_clock().now()
        time_since_last_cmd = (current_time - self.last_cmd_time).nanoseconds / 1e9

        if time_since_last_cmd > self.safety_timeout:
            # Emergency stop if no commands received recently
            self.emergency_stop()
            self.get_logger().warn('Emergency stop: No commands received recently')

    def emergency_stop(self):
        """Send emergency stop to all motors"""
        stop_cmd = Twist()
        stop_cmd.linear.x = 0.0
        stop_cmd.angular.z = 0.0

        # This would send to actual hardware
        self.send_to_motors(stop_cmd)
        self.get_logger().warn('Emergency stop executed')

    def destroy_node(self):
        """Clean up hardware connections"""
        self.emergency_stop()
        super().destroy_node()


def main(args=None):
    rclpy.init(args=args)
    hardware_interface = HardwareInterface()

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

## Exercises and Practical Applications

### Exercise 1: Topic Communication
Create a publisher-subscriber pair that communicates sensor data between nodes. Implement proper QoS settings for your specific use case.

### Exercise 2: Service Implementation
Develop a service that allows remote configuration of a robot's parameters, including validation and error handling.

### Exercise 3: Performance Optimization
Profile your communication patterns and optimize for the Jetson Orin Nano's specific constraints.

### Exercise 4: Safety Integration
Implement safety protocols in your communication patterns, including timeout handling and emergency stop functionality.

## Troubleshooting Common Issues

### Topic Communication Issues
- **No Messages Received**: Check topic names and namespaces
- **High Latency**: Adjust QoS profiles for your use case
- **Memory Issues**: Implement proper queue sizing and cleanup

### Service Communication Issues
- **Service Not Available**: Verify service name and node lifecycle
- **Timeout Errors**: Check network configuration and service availability
- **Blocking Issues**: Consider using async service calls

### Performance Issues
- **High CPU Usage**: Optimize message processing and use appropriate threading
- **Memory Leaks**: Implement proper cleanup in node destruction
- **Communication Bottlenecks**: Profile and optimize communication patterns

## Summary

اس باب میں ROS 2 مواصلات کے لازمی نمونوں کا احاطہ کیا گیا ہے: غیر متزلزل ڈیٹا اسٹریمنگ کے عنوانات ، ہم وقت ساز درخواست-ردعمل کی بات چیت کے لئے خدمات ، اور مقصد پر مبنی کاموں کے لئے اقدامات۔ اس پر عمل درآمد بنیادی تصورات سے شروع ہونے ، مصنوعی عمل درآمد کی طرف بڑھتے ہوئے ، اور جیٹسن اورین نینو پلیٹ فارم پر بہتر تعیناتی کے ساتھ اختتام پذیر ہونے کے بعد نظریہ → تخروپن → حقیقی ترقی کی پیروی کرتا ہے۔

مضبوط ، توسیع پذیر روبوٹک سسٹم کی تعمیر کے لئے مواصلات کے ان نمونوں کو سمجھنا بہت ضروری ہے۔ ہر نمونہ میں استعمال کے مخصوص معاملات اور کارکردگی کی خصوصیات ہوتی ہیں جن پر روبوٹک ایپلی کیشنز کو ڈیزائن کرتے وقت غور کیا جانا چاہئے۔

::: ٹپ
موضوعات ، خدمات اور اعمال کے مابین انتخاب کرتے وقت اپنے مخصوص اطلاق کے وقت اور قابل اعتماد کی ضروریات پر ہمیشہ غور کریں۔ اپنے استعمال کے معاملے میں کارکردگی کو بہتر بنانے کے لئے مناسب QoS ترتیبات کا استعمال کریں۔
:::

::: احتیاط
جسمانی ہارڈ ویئر میں تعینات کرتے وقت ، اس بات کو یقینی بنائیں کہ مواصلات کے تمام نمونوں میں غیر محفوظ روبوٹ سلوک کو روکنے کے لئے مناسب حفاظتی اقدامات ، غلطی سے نمٹنے اور ٹائم آؤٹ میکانزم شامل ہیں۔
:::