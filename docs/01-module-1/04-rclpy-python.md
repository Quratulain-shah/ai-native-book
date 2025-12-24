---
title: "rclpy: Python Programming for ROS 2 Nodes"
slug: "/module-1/rclpy-python"
sidebar_position: 5
---

# rclpy: Python Programming for ROS 2 Nodes

## Introduction to rclpy

rclpy is the Python client library for ROS 2, providing Python bindings for the ROS 2 middleware (rcl). It enables Python developers to create ROS 2 nodes, publish and subscribe to topics, provide and use services, and interact with actions. rclpy provides a Pythonic interface to the ROS 2 ecosystem while maintaining the performance and reliability of the underlying C-based ROS client library.

Python is particularly well-suited for robotics development due to its simplicity, extensive scientific computing libraries, and rapid prototyping capabilities. Combined with rclpy, Python becomes a powerful tool for implementing complex robotic systems.

## Theory: rclpy Architecture and Concepts

### Core Components of rclpy

#### Node Structure
The fundamental building block in rclpy is the Node class, which inherits from `rclpy.node.Node`. A node encapsulates:

- **Communication interfaces**: Publishers, subscribers, services, and actions
- **Timers**: Periodic callbacks for time-based operations
- **Parameters**: Configurable values that can be set at runtime
- **Logging**: Integrated logging system for debugging and monitoring
- **Clock**: Time management and synchronization

#### Client Library Architecture
```
Python Application
    ↓
rclpy (Python bindings)
    ↓
rcl (ROS Client Library - C)
    ↓
rmw (ROS Middleware Interface)
    ↓
DDS Implementation (Fast DDS, Cyclone DDS, etc.)
```

### Key Programming Patterns

#### Object-Oriented Design
rclpy follows object-oriented principles with the Node class as the primary interface:

```python
import rclpy
from rclpy.node import Node

class MyNode(Node):
    def __init__(self):
        super().__init__('node_name')
        # Initialize node components here
```

#### Context Management
rclpy uses a context for managing the ROS client library:

```python
# Initialize the context
rclpy.init(args=args)

# Create nodes and perform operations
node = MyNode()
rclpy.spin(node)

# Cleanup
node.destroy_node()
rclpy.shutdown()
```

#### Asynchronous Operations
rclpy supports both synchronous and asynchronous operations:

- **Synchronous**: `rclpy.spin()` blocks until shutdown
- **Asynchronous**: `rclpy.spin_once()` allows for custom control loops
- **Multi-threading**: Nodes can be spun in separate threads

### Memory Management and Lifecycle

rclpy handles memory management through Python's garbage collection while maintaining ROS 2's resource management patterns. It's important to properly destroy nodes and their components to prevent resource leaks.

## Simulation: Implementing rclpy Nodes

### Basic Node Implementation

Let's start with a basic rclpy node that demonstrates the fundamental components:

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/basic_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Int32
from std_msgs.msg import Header
from geometry_msgs.msg import Twist
import time
import math


class BasicRobotNode(Node):
    """
    A basic robot node demonstrating fundamental rclpy concepts
    """
    def __init__(self):
        # Initialize the node with a name
        super().__init__('basic_robot_node')

        # Create a publisher
        self.publisher_ = self.create_publisher(String, 'chatter', 10)

        # Create a subscriber
        self.subscription = self.create_subscription(
            String,
            'chatter',
            self.listener_callback,
            10)
        self.subscription  # Prevent unused variable warning

        # Create a timer for periodic publishing
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)

        # Counter for messages
        self.i = 0

        # Log node initialization
        self.get_logger().info('Basic Robot Node initialized')

    def timer_callback(self):
        """Callback function for the timer"""
        msg = String()
        msg.data = f'Hello World: {self.i}'

        # Publish the message
        self.publisher_.publish(msg)

        # Log the published message
        self.get_logger().info(f'Publishing: "{msg.data}"')

        # Increment counter
        self.i += 1

    def listener_callback(self, msg):
        """Callback function for the subscriber"""
        self.get_logger().info(f'I heard: "{msg.data}"')


def main(args=None):
    """
    Main function to run the node
    """
    # Initialize rclpy
    rclpy.init(args=args)

    # Create the node
    basic_robot_node = BasicRobotNode()

    try:
        # Spin the node to process callbacks
        rclpy.spin(basic_robot_node)
    except KeyboardInterrupt:
        pass
    finally:
        # Clean up
        basic_robot_node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Advanced Node with Multiple Communication Patterns

Now let's create a more advanced node that demonstrates multiple communication patterns:

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/advanced_robot_node.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from std_msgs.msg import String, Float32
from geometry_msgs.msg import Twist, Vector3
from sensor_msgs.msg import LaserScan
from my_robot_interfaces.srv import RobotCommand  # Custom service
import math
import random
from threading import Lock


class AdvancedRobotNode(Node):
    """
    An advanced robot node demonstrating multiple rclpy features
    """
    def __init__(self):
        super().__init__('advanced_robot_node')

        # Use mutex for thread safety
        self.mutex = Lock()

        # QoS profiles for different types of data
        sensor_qos = QoSProfile(
            depth=10,
            reliability=ReliabilityPolicy.BEST_EFFORT,
            durability=DurabilityPolicy.VOLATILE
        )

        control_qos = QoSProfile(
            depth=10,
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.VOLATILE
        )

        # Publishers
        self.cmd_vel_publisher = self.create_publisher(Twist, 'cmd_vel', control_qos)
        self.status_publisher = self.create_publisher(String, 'robot_status', 10)
        self.battery_publisher = self.create_publisher(Float32, 'battery_level', 10)

        # Subscribers
        self.laser_subscription = self.create_subscription(
            LaserScan,
            'scan',
            self.laser_callback,
            sensor_qos
        )

        self.cmd_subscription = self.create_subscription(
            Twist,
            'cmd_vel_input',
            self.cmd_input_callback,
            control_qos
        )

        # Service server
        self.srv = self.create_service(RobotCommand, 'robot_command', self.command_callback)

        # Timer for periodic tasks
        self.status_timer = self.create_timer(1.0, self.publish_status)
        self.battery_timer = self.create_timer(5.0, self.publish_battery)

        # Robot state
        self.robot_state = {
            'position': Vector3(x=0.0, y=0.0, z=0.0),
            'orientation': 0.0,  # heading in radians
            'velocity': Twist(),
            'battery_level': 100.0,
            'obstacle_detected': False,
            'safe_to_move': True
        }

        # Log initialization
        self.get_logger().info('Advanced Robot Node initialized')

    def laser_callback(self, msg):
        """Process laser scan data"""
        with self.mutex:
            # Process laser scan to detect obstacles
            min_range = float('inf')

            # Find minimum range in the forward direction (front 30 degrees)
            front_ranges = []
            total_beams = len(msg.ranges)
            front_start = total_beams // 2 - total_beams // 12  # -15 degrees
            front_end = total_beams // 2 + total_beams // 12    # +15 degrees

            for i in range(max(0, front_start), min(total_beams, front_end)):
                if not math.isnan(msg.ranges[i]) and not math.isinf(msg.ranges[i]):
                    front_ranges.append(msg.ranges[i])

            if front_ranges:
                min_range = min(front_ranges)

            # Update obstacle detection state
            self.robot_state['obstacle_detected'] = min_range < 1.0  # 1 meter threshold
            self.robot_state['safe_to_move'] = not self.robot_state['obstacle_detected']

            # Log obstacle detection
            if self.robot_state['obstacle_detected']:
                self.get_logger().warn(f'Obstacle detected at {min_range:.2f}m')
            else:
                self.get_logger().info(f'Path clear, nearest obstacle: {min_range:.2f}m')

    def cmd_input_callback(self, msg):
        """Handle velocity commands from external source"""
        with self.mutex:
            # Check if it's safe to move
            if self.robot_state['safe_to_move']:
                # Forward the command to the robot
                self.cmd_vel_publisher.publish(msg)

                # Update internal velocity state
                self.robot_state['velocity'] = msg

                self.get_logger().info(
                    f'Forwarding command: linear.x={msg.linear.x}, angular.z={msg.angular.z}'
                )
            else:
                # Stop the robot if obstacles detected
                stop_cmd = Twist()
                self.cmd_vel_publisher.publish(stop_cmd)
                self.get_logger().warn('Movement blocked due to obstacle')

    def command_callback(self, request, response):
        """Handle service requests"""
        self.get_logger().info(f'Received command: {request.command}')

        with self.mutex:
            if request.command == 'move_forward':
                cmd = Twist()
                cmd.linear.x = 0.5  # m/s
                cmd.angular.z = 0.0
                self.cmd_vel_publisher.publish(cmd)
                response.success = True
                response.message = 'Moving forward'
            elif request.command == 'turn_left':
                cmd = Twist()
                cmd.linear.x = 0.0
                cmd.angular.z = 0.5  # rad/s
                self.cmd_vel_publisher.publish(cmd)
                response.success = True
                response.message = 'Turning left'
            elif request.command == 'stop':
                cmd = Twist()
                cmd.linear.x = 0.0
                cmd.angular.z = 0.0
                self.cmd_vel_publisher.publish(cmd)
                response.success = True
                response.message = 'Stopped'
            elif request.command == 'get_status':
                response.success = True
                response.message = f'Battery: {self.robot_state["battery_level"]:.1f}%, ' \
                                 f'Obstacle: {self.robot_state["obstacle_detected"]}, ' \
                                 f'Safe: {self.robot_state["safe_to_move"]}'
            else:
                response.success = False
                response.message = f'Unknown command: {request.command}'

        self.get_logger().info(f'Service response: {response.message}')
        return response

    def publish_status(self):
        """Publish robot status periodically"""
        with self.mutex:
            status_msg = String()
            status_msg.data = f'Pos:({self.robot_state["position"].x:.2f},{self.robot_state["position"].y:.2f}), ' \
                            f'Batt:{self.robot_state["battery_level"]:.1f}%, ' \
                            f'Obst:{self.robot_state["obstacle_detected"]}'
            self.status_publisher.publish(status_msg)

    def publish_battery(self):
        """Simulate battery level changes"""
        with self.mutex:
            # Simulate battery drain
            self.robot_state['battery_level'] = max(0.0, self.robot_state['battery_level'] - 0.1)

            battery_msg = Float32()
            battery_msg.data = float(self.robot_state['battery_level'])
            self.battery_publisher.publish(battery_msg)

            # Warn if battery is low
            if self.robot_state['battery_level'] < 20.0:
                self.get_logger().warn(f'Low battery: {self.robot_state["battery_level"]:.1f}%')

    def update_position(self):
        """Update robot position based on velocity (simplified)"""
        with self.mutex:
            dt = 0.1  # time step (would come from actual timing)

            # Update position based on velocity
            self.robot_state['position'].x += self.robot_state['velocity'].linear.x * dt
            self.robot_state['position'].y += self.robot_state['velocity'].linear.y * dt

            # Update orientation based on angular velocity
            self.robot_state['orientation'] += self.robot_state['velocity'].angular.z * dt


def main(args=None):
    """Main function to run the advanced robot node"""
    rclpy.init(args=args)
    node = AdvancedRobotNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Parameter Management

rclpy provides a robust parameter system for runtime configuration:

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/parameter_node.py
import rclpy
from rclpy.node import Node
from rclpy.parameter import Parameter
from rclpy.qos import QoSProfile
from std_msgs.msg import Float32
import math


class ParameterNode(Node):
    """
    Node demonstrating parameter management in rclpy
    """
    def __init__(self):
        super().__init__('parameter_node')

        # Declare parameters with default values and descriptions
        self.declare_parameter('linear_speed', 0.5,
                              ParameterDescriptor(description='Linear speed in m/s'))
        self.declare_parameter('angular_speed', 0.5,
                              ParameterDescriptor(description='Angular speed in rad/s'))
        self.declare_parameter('safety_distance', 1.0,
                              ParameterDescriptor(description='Minimum safe distance in meters'))
        self.declare_parameter('battery_threshold', 20.0,
                              ParameterDescriptor(description='Low battery threshold'))

        # Create publisher for speed commands
        self.speed_publisher = self.create_publisher(Float32, 'current_speed', 10)

        # Timer for periodic parameter checking
        self.param_check_timer = self.create_timer(2.0, self.check_parameters)

        # Log initialization
        self.get_logger().info('Parameter Node initialized with parameters')

    def check_parameters(self):
        """Check and use current parameter values"""
        # Get parameter values
        linear_speed = self.get_parameter('linear_speed').value
        angular_speed = self.get_parameter('angular_speed').value
        safety_distance = self.get_parameter('safety_distance').value
        battery_threshold = self.get_parameter('battery_threshold').value

        # Log parameter values
        self.get_logger().info(
            f'Current parameters - Linear: {linear_speed}, Angular: {angular_speed}, '
            f'Safety: {safety_distance}, Battery threshold: {battery_threshold}'
        )

        # Publish current speed for monitoring
        speed_msg = Float32()
        speed_msg.data = float(linear_speed)
        self.speed_publisher.publish(speed_msg)

    def on_parameter_event(self, parameter_list):
        """Handle parameter changes"""
        for param in parameter_list:
            self.get_logger().info(f'Parameter {param.name} changed to {param.value}')


def main(args=None):
    """Main function for parameter node"""
    rclpy.init(args=args)
    node = ParameterNode()

    # Add parameter callback
    node.add_on_set_parameters_callback(node.on_parameter_event)

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Action Server Implementation

For goal-oriented tasks, rclpy provides action support:

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/action_server.py
import rclpy
from rclpy.action import ActionServer, CancelResponse, GoalResponse
from rclpy.node import Node
from my_robot_interfaces.action import NavigateToPose  # Custom action
from geometry_msgs.msg import Pose, Point, Quaternion
from std_msgs.msg import Header
import time
import math
from threading import Lock


class NavigateActionServer(Node):
    """
    Action server for navigation tasks
    """
    def __init__(self):
        super().__init__('navigate_action_server')

        # Create action server
        self._action_server = ActionServer(
            self,
            NavigateToPose,
            'navigate_to_pose',
            execute_callback=self.execute_callback,
            goal_callback=self.goal_callback,
            cancel_callback=self.cancel_callback
        )

        # Robot state
        self.current_pose = Pose()
        self.current_pose.position.x = 0.0
        self.current_pose.position.y = 0.0
        self.current_pose.position.z = 0.0
        self.current_pose.orientation.x = 0.0
        self.current_pose.orientation.y = 0.0
        self.current_pose.orientation.z = 0.0
        self.current_pose.orientation.w = 1.0

        # Feedback publisher
        self.feedback_publisher = self.create_publisher(
            NavigateToPose.Feedback,
            'navigate_to_pose/_action/feedback',
            10
        )

        # Mutex for thread safety
        self.mutex = Lock()

        self.get_logger().info('Navigation Action Server initialized')

    def goal_callback(self, goal_request):
        """Accept or reject goals"""
        self.get_logger().info('Received navigation goal')

        # Accept all goals for this example
        # In a real system, you might reject goals that are unreachable
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

        # Calculate distance to target
        dx = target_pose.position.x - self.current_pose.position.x
        dy = target_pose.position.y - self.current_pose.position.y
        distance = math.sqrt(dx*dx + dy*dy)

        # Calculate steps for simulation
        steps = max(10, int(distance / 0.1))  # 10 steps per meter, minimum 10 steps

        # Simulate navigation progress
        feedback_msg = NavigateToPose.Feedback()

        for i in range(steps + 1):
            # Check if goal was canceled
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                result = NavigateToPose.Result()
                result.success = False
                result.message = 'Navigation canceled'
                return result

            # Calculate progress
            progress = float(i) / float(steps) if steps > 0 else 1.0

            # Update current pose based on progress
            with self.mutex:
                self.current_pose.position.x = self.current_pose.position.x + dx * (progress if i > 0 else 0)
                self.current_pose.position.y = self.current_pose.position.y + dy * (progress if i > 0 else 0)

            # Update feedback
            feedback_msg.current_pose = self.current_pose
            feedback_msg.distance_remaining = distance * (1.0 - progress)
            feedback_msg.progress = progress * 100.0

            # Publish feedback
            goal_handle.publish_feedback(feedback_msg)

            # Log progress
            self.get_logger().info(f'Navigation progress: {feedback_msg.progress:.1f}%')

            # Simulate movement time
            time.sleep(0.1)

        # Check if goal was canceled after completion
        if goal_handle.is_cancel_requested:
            goal_handle.canceled()
            result = NavigateToPose.Result()
            result.success = False
            result.message = 'Navigation canceled'
        else:
            # Complete the goal
            goal_handle.succeed()
            result = NavigateToPose.Result()
            result.success = True
            result.message = 'Navigation completed successfully'

        self.get_logger().info(f'Navigation result: {result.message}')
        return result


def main(args=None):
    """Main function for action server"""
    rclpy.init(args=args)
    action_server = NavigateActionServer()

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

## Real: Optimized rclpy for Jetson Orin Nano

### Performance Optimization Strategies

When running rclpy nodes on the Jetson Orin Nano, several optimization strategies are essential:

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/optimized_node.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from rclpy.executors import SingleThreadedExecutor, MultiThreadedExecutor
from sensor_msgs.msg import Image, LaserScan
from geometry_msgs.msg import Twist
from std_msgs.msg import Header
from cv_bridge import CvBridge
import numpy as np
import cv2
import time
import threading
from collections import deque
import psutil
import queue
from typing import Optional, Dict, Any
import gc


class OptimizedRobotNode(Node):
    """
    Optimized robot node for Jetson Orin Nano with performance considerations
    """
    def __init__(self):
        super().__init__('optimized_robot_node')

        # Initialize CV bridge for image processing
        self.bridge = CvBridge()

        # Performance monitoring
        self.message_counts = {'image': 0, 'scan': 0, 'cmd': 0}
        self.start_time = time.time()

        # Use optimized QoS profiles for different data types
        high_freq_qos = QoSProfile(
            depth=1,  # Keep only the latest message to save memory
            reliability=ReliabilityPolicy.BEST_EFFORT,
            durability=DurabilityPolicy.VOLATILE
        )

        critical_qos = QoSProfile(
            depth=5,  # Keep a few messages for critical data
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.VOLATILE
        )

        # Publishers
        self.image_pub = self.create_publisher(Image, 'processed_image', high_freq_qos)
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', critical_qos)

        # Subscriptions with optimized queue sizes
        self.image_sub = self.create_subscription(
            Image,
            'camera/image_raw',
            self.image_callback,
            high_freq_qos
        )

        self.scan_sub = self.create_subscription(
            LaserScan,
            'scan',
            self.scan_callback,
            high_freq_qos
        )

        # Use queues to manage data processing without blocking
        self.image_queue = queue.Queue(maxsize=2)  # Limit to prevent memory buildup
        self.scan_queue = queue.Queue(maxsize=5)

        # Processing threads
        self.image_thread = threading.Thread(target=self.process_images, daemon=True)
        self.scan_thread = threading.Thread(target=self.process_scans, daemon=True)
        self.image_thread.start()
        self.scan_thread.start()

        # Performance monitoring timer
        self.monitor_timer = self.create_timer(2.0, self.performance_monitor)

        # Resource limits
        self.max_cpu_percent = 80.0
        self.max_memory_percent = 80.0

        # Processing throttling
        self.processing_enabled = True
        self.processing_throttle = 1.0  # Process every frame
        self.last_process_time = time.time()

        self.get_logger().info('Optimized Robot Node initialized for Jetson Orin Nano')

    def image_callback(self, msg):
        """Non-blocking image callback that adds to queue"""
        try:
            # Add to queue without blocking
            if not self.image_queue.full():
                self.image_queue.put_nowait(msg)
                self.message_counts['image'] += 1
            else:
                # Queue is full, drop the message to prevent blocking
                self.get_logger().debug('Image queue full, dropping message')
        except queue.Full:
            pass  # Queue is full, message dropped

    def scan_callback(self, msg):
        """Non-blocking scan callback that adds to queue"""
        try:
            if not self.scan_queue.full():
                self.scan_queue.put_nowait(msg)
                self.message_counts['scan'] += 1
            else:
                self.get_logger().debug('Scan queue full, dropping message')
        except queue.Full:
            pass

    def process_images(self):
        """Process images in separate thread"""
        while rclpy.ok():
            try:
                # Get image from queue (non-blocking)
                if not self.image_queue.empty():
                    msg = self.image_queue.get_nowait()

                    # Check processing throttle
                    current_time = time.time()
                    if (current_time - self.last_process_time) >= (1.0 / self.processing_throttle):
                        # Convert ROS image to OpenCV
                        cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

                        # Perform optimized image processing
                        processed_image = self.optimize_image_processing(cv_image)

                        # Publish processed image
                        result_msg = self.bridge.cv2_to_imgmsg(processed_image, encoding='bgr8')
                        result_msg.header = Header()
                        result_msg.header.stamp = self.get_clock().now().to_msg()
                        result_msg.header.frame_id = 'camera_optical_frame'

                        self.image_pub.publish(result_msg)

                        # Update processing time
                        self.last_process_time = current_time
                    else:
                        # Throttle processing, just consume the message
                        pass

            except queue.Empty:
                # No image to process, sleep briefly to avoid busy waiting
                time.sleep(0.001)
            except Exception as e:
                self.get_logger().error(f'Error processing image: {str(e)}')
                # Brief sleep to avoid rapid error loops
                time.sleep(0.01)

    def process_scans(self):
        """Process laser scans in separate thread"""
        while rclpy.ok():
            try:
                if not self.scan_queue.empty():
                    msg = self.scan_queue.get_nowait()

                    # Process scan data
                    self.process_scan_data(msg)
                    self.message_counts['scan'] += 1

            except queue.Empty:
                time.sleep(0.001)
            except Exception as e:
                self.get_logger().error(f'Error processing scan: {str(e)}')
                time.sleep(0.01)

    def optimize_image_processing(self, image):
        """Optimized image processing function"""
        # Convert to grayscale (reduces data size)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Perform edge detection
        edges = cv2.Canny(blurred, 50, 150)

        # Convert back to 3-channel for publishing
        result = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

        return result

    def process_scan_data(self, scan_msg):
        """Process laser scan data efficiently"""
        # Find minimum range in front of robot
        ranges = np.array(scan_msg.ranges)

        # Filter out invalid ranges
        valid_ranges = ranges[np.isfinite(ranges)]

        if len(valid_ranges) > 0:
            min_range = np.min(valid_ranges)

            # Simple obstacle avoidance
            if min_range < 1.0:  # 1 meter threshold
                # Stop robot
                cmd = Twist()
                cmd.linear.x = 0.0
                cmd.angular.z = 0.0
                self.cmd_vel_pub.publish(cmd)
            else:
                # Move forward
                cmd = Twist()
                cmd.linear.x = 0.5
                cmd.angular.z = 0.0
                self.cmd_vel_pub.publish(cmd)

    def performance_monitor(self):
        """Monitor system performance and adjust processing"""
        # Get system metrics
        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent

        # Calculate message rates
        elapsed_time = time.time() - self.start_time
        if elapsed_time > 0:
            image_rate = self.message_counts['image'] / elapsed_time
            scan_rate = self.message_counts['scan'] / elapsed_time
        else:
            image_rate = 0
            scan_rate = 0

        # Log performance
        self.get_logger().info(
            f'Performance: CPU={cpu_percent:.1f}%, Mem={memory_percent:.1f}%, '
            f'Image rate={image_rate:.1f}Hz, Scan rate={scan_rate:.1f}Hz'
        )

        # Adjust processing based on resource usage
        if cpu_percent > self.max_cpu_percent or memory_percent > self.max_memory_percent:
            # Reduce processing load
            if self.processing_throttle > 0.1:  # Don't go below 0.1 Hz
                self.processing_throttle *= 0.9  # Reduce by 10%
                self.get_logger().warn(f'Reducing processing throttle to {self.processing_throttle:.2f}Hz')
        else:
            # Gradually increase processing if resources allow
            if self.processing_throttle < 10.0:  # Don't exceed 10 Hz
                self.processing_throttle = min(10.0, self.processing_throttle * 1.01)  # Increase by 1%

        # Force garbage collection periodically
        if int(elapsed_time) % 30 == 0:  # Every 30 seconds
            collected = gc.collect()
            self.get_logger().debug(f'Garbage collected: {collected} objects')

    def destroy_node(self):
        """Clean up resources"""
        # Stop threads gracefully
        # In a real implementation, you would have flags to stop the threads

        # Clear queues
        while not self.image_queue.empty():
            try:
                self.image_queue.get_nowait()
            except queue.Empty:
                break

        while not self.scan_queue.empty():
            try:
                self.scan_queue.get_nowait()
            except queue.Empty:
                break

        super().destroy_node()


def main(args=None):
    """Main function for optimized node"""
    rclpy.init(args=args)

    # Use single-threaded executor for better performance on embedded systems
    executor = SingleThreadedExecutor()

    node = OptimizedRobotNode()
    executor.add_node(node)

    try:
        executor.spin()
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()
        executor.shutdown()


if __name__ == '__main__':
    main()
```

### Memory Management and Resource Optimization

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/memory_optimized_node.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, PointCloud2
from std_msgs.msg import Header
from cv_bridge import CvBridge
import numpy as np
import cv2
from collections import deque
import weakref
import gc
from typing import Optional, Deque
import time


class MemoryOptimizedNode(Node):
    """
    Node optimized for memory usage on Jetson Orin Nano
    """
    def __init__(self):
        super().__init__('memory_optimized_node')

        # Initialize CV bridge
        self.bridge = CvBridge()

        # Use deques with maximum length to limit memory usage
        self.image_buffer: Deque = deque(maxlen=5)  # Keep only last 5 images
        self.processed_buffer: Deque = deque(maxlen=3)  # Keep only last 3 processed

        # Reuse message objects to reduce allocation
        self.reusable_image_msg = Image()
        self.reusable_header = Header()

        # Publishers and subscribers
        self.image_pub = self.create_publisher(Image, 'processed_images', 1)
        self.image_sub = self.create_subscription(
            Image,
            'input_image',
            self.optimized_image_callback,
            1  # Minimal queue to save memory
        )

        # Processing timer
        self.process_timer = self.create_timer(0.1, self.process_buffer)  # 10 Hz

        # Memory monitoring
        self.memory_check_timer = self.create_timer(5.0, self.memory_monitor)

        # Frame counter for performance tracking
        self.frame_count = 0
        self.last_memory_check = time.time()

        self.get_logger().info('Memory Optimized Node initialized')

    def optimized_image_callback(self, msg: Image):
        """Memory-optimized image callback"""
        # Add to buffer (automatically manages size)
        self.image_buffer.append(msg)

        # Increment frame counter
        self.frame_count += 1

    def process_buffer(self):
        """Process images from buffer with memory optimization"""
        if not self.image_buffer:
            return

        try:
            # Get the newest image
            msg = self.image_buffer[-1]  # Get last item

            # Convert image efficiently
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Process image in-place where possible to save memory
            processed = self.inplace_image_processing(cv_image)

            # Publish result
            result_msg = self.bridge.cv2_to_imgmsg(processed, encoding='bgr8')
            result_msg.header = self.reusable_header
            result_msg.header.stamp = self.get_clock().now().to_msg()
            result_msg.header.frame_id = 'camera_frame'

            self.image_pub.publish(result_msg)

            # Add to processed buffer
            self.processed_buffer.append(result_msg)

        except Exception as e:
            self.get_logger().error(f'Error in process_buffer: {str(e)}')

    def inplace_image_processing(self, image):
        """Perform image processing in-place to minimize memory allocation"""
        # Apply processing that modifies the image in-place
        # Gaussian blur (creates new array, but we'll work with it)
        blurred = cv2.GaussianBlur(image, (3, 3), 0)

        # Convert to grayscale
        gray = cv2.cvtColor(blurred, cv2.COLOR_BGR2GRAY)

        # Apply threshold in-place on grayscale
        _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

        # Convert back to color format for output
        result = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)

        return result

    def memory_monitor(self):
        """Monitor and report memory usage"""
        import psutil
        import os

        # Get memory usage
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()
        memory_percent = process.memory_percent()

        self.get_logger().info(
            f'Memory usage: RSS={memory_info.rss / 1024 / 1024:.1f}MB, '
            f'Percent={memory_percent:.1f}%, Frame rate={self.frame_count / 5.0:.1f}Hz'
        )

        # Reset frame counter
        self.frame_count = 0

        # Perform garbage collection
        collected = gc.collect()
        if collected > 0:
            self.get_logger().debug(f'Garbage collected {collected} objects')

    def cleanup_resources(self):
        """Explicitly clean up resources"""
        # Clear buffers
        self.image_buffer.clear()
        self.processed_buffer.clear()

        # Force garbage collection
        gc.collect()


def main(args=None):
    """Main function for memory optimized node"""
    rclpy.init(args=args)
    node = MemoryOptimizedNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.cleanup_resources()
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Safety and Error Handling

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/safety_node.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan, Imu
from std_msgs.msg import Bool, Float32
from enum import Enum
import time
import math
from typing import Optional


class SafetyState(Enum):
    SAFE = 1
    WARNING = 2
    EMERGENCY = 3


class SafetyNode(Node):
    """
    Safety-focused node with comprehensive error handling
    """
    def __init__(self):
        super().__init__('safety_node')

        # Safety parameters
        self.safety_distance = 0.5  # meters
        self.max_linear_vel = 1.0   # m/s
        self.max_angular_vel = 1.0  # rad/s
        self.emergency_timeout = 1.0  # seconds without commands

        # Safety state
        self.safety_state = SafetyState.SAFE
        self.last_cmd_time = self.get_clock().now()
        self.emergency_stop_active = False

        # Publishers and subscribers
        self.cmd_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.safety_pub = self.create_publisher(Bool, 'safety_status', 10)

        self.cmd_sub = self.create_subscription(
            Twist, 'cmd_vel_input', self.safety_cmd_callback, 10)
        self.scan_sub = self.create_subscription(
            LaserScan, 'scan', self.scan_callback, 10)
        self.imu_sub = self.create_subscription(
            Imu, 'imu/data', self.imu_callback, 10)

        # Timers
        self.safety_timer = self.create_timer(0.1, self.safety_check)
        self.status_timer = self.create_timer(1.0, self.publish_safety_status)

        # Robot state
        self.current_velocity = Twist()
        self.imu_data = None
        self.last_scan_ranges = []

        self.get_logger().info('Safety Node initialized')

    def safety_cmd_callback(self, msg: Twist):
        """Safety-filtered command callback"""
        try:
            # Update last command time
            self.last_cmd_time = self.get_clock().now()

            # Validate and limit command
            safe_cmd = self.validate_command(msg)

            # Check if we're in emergency state
            if self.emergency_stop_active:
                # Only allow zero commands during emergency
                if self.is_zero_command(safe_cmd):
                    self.emergency_stop_active = False
                    self.get_logger().info('Emergency reset - zero command received')
                else:
                    self.get_logger().warn('Command rejected during emergency state')
                    return

            # Publish the validated command
            self.cmd_pub.publish(safe_cmd)
            self.current_velocity = safe_cmd

        except Exception as e:
            self.get_logger().error(f'Safety command error: {str(e)}')
            self.emergency_stop()

    def validate_command(self, cmd: Twist) -> Twist:
        """Validate and limit velocity commands"""
        validated = Twist()

        # Limit linear velocity
        validated.linear.x = max(-self.max_linear_vel,
                                min(self.max_linear_vel, cmd.linear.x))
        validated.linear.y = max(-self.max_linear_vel,
                                min(self.max_linear_vel, cmd.linear.y))
        validated.linear.z = max(-self.max_linear_vel,
                                min(self.max_linear_vel, cmd.linear.z))

        # Limit angular velocity
        validated.angular.x = max(-self.max_angular_vel,
                                 min(self.max_angular_vel, cmd.angular.x))
        validated.angular.y = max(-self.max_angular_vel,
                                 min(self.max_angular_vel, cmd.angular.y))
        validated.angular.z = max(-self.max_angular_vel,
                                 min(self.max_angular_vel, cmd.angular.z))

        return validated

    def scan_callback(self, msg: LaserScan):
        """Process laser scan for obstacle detection"""
        try:
            self.last_scan_ranges = msg.ranges

            # Check for obstacles in critical zones
            if self.has_critical_obstacle(msg):
                self.safety_state = SafetyState.EMERGENCY
                self.emergency_stop()
                self.get_logger().error('CRITICAL OBSTACLE DETECTED - EMERGENCY STOP')
            elif self.has_warning_obstacle(msg):
                self.safety_state = SafetyState.WARNING
                self.get_logger().warn('Warning: Obstacle detected')
            else:
                self.safety_state = SafetyState.SAFE

        except Exception as e:
            self.get_logger().error(f'Scan processing error: {str(e)}')

    def has_critical_obstacle(self, scan: LaserScan) -> bool:
        """Check for obstacles in critical safety zones"""
        if not scan.ranges:
            return False

        # Check front center (narrow beam)
        center_idx = len(scan.ranges) // 2
        front_range = scan.ranges[center_idx]

        if not math.isinf(front_range) and not math.isnan(front_range):
            if front_range < self.safety_distance * 0.5:  # Half safety distance
                return True

        # Check wider front area
        start_idx = len(scan.ranges) // 2 - len(scan.ranges) // 10  # 10% of total
        end_idx = len(scan.ranges) // 2 + len(scan.ranges) // 10

        for i in range(max(0, start_idx), min(len(scan.ranges), end_idx)):
            r = scan.ranges[i]
            if not math.isinf(r) and not math.isnan(r) and r < self.safety_distance * 0.5:
                return True

        return False

    def has_warning_obstacle(self, scan: LaserScan) -> bool:
        """Check for obstacles in warning zones"""
        if not scan.ranges:
            return False

        # Check front area for warning obstacles
        for r in scan.ranges:
            if not math.isinf(r) and not math.isnan(r) and r < self.safety_distance:
                return True

        return False

    def imu_callback(self, msg: Imu):
        """Process IMU data for safety checks"""
        try:
            self.imu_data = msg

            # Check for dangerous accelerations
            linear_accel = math.sqrt(
                msg.linear_acceleration.x**2 +
                msg.linear_acceleration.y**2 +
                msg.linear_acceleration.z**2
            )

            if linear_accel > 20.0:  # Excessive acceleration
                self.get_logger().warn(f'Dangerous acceleration detected: {linear_accel:.2f} m/s²')
                self.safety_state = SafetyState.WARNING

        except Exception as e:
            self.get_logger().error(f'IMU processing error: {str(e)}')

    def safety_check(self):
        """Periodic safety checks"""
        try:
            # Check command timeout
            current_time = self.get_clock().now()
            time_since_last_cmd = (current_time - self.last_cmd_time).nanoseconds / 1e9

            if time_since_last_cmd > self.emergency_timeout:
                self.get_logger().warn('Emergency: No commands received, stopping robot')
                self.emergency_stop()
                return

            # Check if we should resume from emergency
            if (self.safety_state == SafetyState.EMERGENCY and
                not self.has_critical_obstacle_for_emergency()):
                self.safety_state = SafetyState.SAFE
                self.emergency_stop_active = False
                self.get_logger().info('Safety state restored to SAFE')

        except Exception as e:
            self.get_logger().error(f'Safety check error: {str(e)}')

    def has_critical_obstacle_for_emergency(self) -> bool:
        """Check if critical obstacles still exist"""
        # This would check if obstacles are still present
        # For simulation, we'll just return False to allow recovery
        return False

    def emergency_stop(self):
        """Execute emergency stop"""
        if not self.emergency_stop_active:
            self.emergency_stop_active = True

            # Send stop command
            stop_cmd = Twist()
            self.cmd_pub.publish(stop_cmd)
            self.current_velocity = stop_cmd

            self.get_logger().error('EMERGENCY STOP ACTIVATED')

    def is_zero_command(self, cmd: Twist) -> bool:
        """Check if command is effectively zero"""
        return (abs(cmd.linear.x) < 0.01 and
                abs(cmd.linear.y) < 0.01 and
                abs(cmd.linear.z) < 0.01 and
                abs(cmd.angular.x) < 0.01 and
                abs(cmd.angular.y) < 0.01 and
                abs(cmd.angular.z) < 0.01)

    def publish_safety_status(self):
        """Publish safety status"""
        status_msg = Bool()
        status_msg.data = (self.safety_state == SafetyState.SAFE and
                          not self.emergency_stop_active)
        self.safety_pub.publish(status_msg)

    def destroy_node(self):
        """Ensure safe shutdown"""
        # Send stop command before shutdown
        stop_cmd = Twist()
        self.cmd_pub.publish(stop_cmd)
        self.get_logger().info('Safety node shutdown - robot stopped')
        super().destroy_node()


def main(args=None):
    """Main function for safety node"""
    rclpy.init(args=args)
    node = SafetyNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Exercises and Practical Applications

### Exercise 1: Basic Node Creation
Create a simple rclpy node that publishes sensor data and subscribes to control commands, implementing proper error handling and logging.

### Exercise 2: Parameter Management
Develop a node that uses parameters for runtime configuration, including parameter validation and callbacks for parameter changes.

### Exercise 3: Performance Optimization
Optimize a node for the Jetson Orin Nano platform, implementing memory management, threading, and resource monitoring.

### Exercise 4: Safety Implementation
Create a safety node that monitors robot state and implements emergency stop functionality based on sensor data.

## Troubleshooting Common Issues

### Memory Issues
- **Use object reuse**: Reuse message objects instead of creating new ones
- **Limit buffer sizes**: Use deques with maximum lengths
- **Monitor memory**: Implement memory monitoring and garbage collection

### Performance Issues
- **Threading**: Use separate threads for heavy processing
- **QoS optimization**: Use appropriate QoS profiles for different data types
- **Throttling**: Implement processing throttles based on system load

### Communication Issues
- **Initialization order**: Ensure nodes are properly initialized before use
- **Topic names**: Verify topic names match between publishers and subscribers
- **QoS compatibility**: Ensure QoS profiles are compatible between nodes

## Summary

This chapter has covered the essential aspects of rclpy programming for ROS 2 nodes, from basic node structure to advanced optimization techniques for edge computing platforms like the Jetson Orin Nano. The Theory → Simulation → Real approach ensures that concepts are first understood theoretically, then implemented and tested in simulation, and finally optimized for physical deployment.

Key concepts covered include:
- Node architecture and lifecycle management
- Multiple communication patterns (topics, services, actions)
- Parameter management and configuration
- Performance optimization for embedded systems
- Safety and error handling

Proper rclpy programming is fundamental to creating robust, efficient, and safe robotic systems that can operate effectively in real-world environments.

:::tip
Always profile your rclpy nodes on the target hardware to ensure they meet performance requirements. Use tools like `ros2 topic hz` to monitor message rates and `htop` to monitor resource usage.
:::

:::caution
When programming for physical robots, always implement comprehensive safety checks and emergency stop functionality. Test all safety systems thoroughly in simulation before deploying to physical hardware.
:::