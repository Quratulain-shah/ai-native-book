---
title: "Nodes, Topics, and Services"
slug: "/module-1/nodes-topics-services"
sidebar_position: 3
---

# Nodes, Topics, and Services

## Advanced Node Management

In this section, we'll explore advanced node management techniques that are essential for creating robust robotic systems.

### Node Lifecycle Management

ROS 2 provides a lifecycle system for managing complex nodes:

```python
from rclpy.lifecycle import LifecycleNode
from rclpy.lifecycle import TransitionCallbackReturn

class LifecyclePublisher(LifecycleNode):
    def __init__(self):
        super().__init__('lifecycle_publisher')
        self.pub = None

    def on_configure(self, state):
        self.pub = self.create_publisher(String, 'lifecycle_chatter', 10)
        self.get_logger().info('Lifecycle publisher is configured')
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state):
        self.pub.on_activate()
        self.get_logger().info('Lifecycle publisher is activated')
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state):
        self.pub.on_deactivate()
        self.get_logger().info('Lifecycle publisher is deactivated')
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state):
        self.destroy_publisher(self.pub)
        self.get_logger().info('Lifecycle publisher is cleaned up')
        return TransitionCallbackReturn.SUCCESS
```

## Topic Communication Patterns

### Publisher-Subscriber with Custom Message Types

Create a custom message file `RobotCommand.msg`:

```
string command
float64[] parameters
uint8 priority
```

Then use it in your nodes:

```python
from my_robot_msgs.msg import RobotCommand

class CommandPublisher(Node):
    def __init__(self):
        super().__init__('command_publisher')
        self.publisher = self.create_publisher(RobotCommand, 'robot_commands', 10)

    def send_command(self, cmd, params, priority):
        msg = RobotCommand()
        msg.command = cmd
        msg.parameters = params
        msg.priority = priority
        self.publisher.publish(msg)
```

### Advanced Subscription Techniques

```python
class AdvancedSubscriber(Node):
    def __init__(self):
        super().__init__('advanced_subscriber')
        self.subscription = self.create_subscription(
            RobotCommand,
            'robot_commands',
            self.command_callback,
            10
        )
        self.subscription  # prevent unused variable warning

    def command_callback(self, msg):
        self.get_logger().info(f'Received command: {msg.command}')
        # Process the command with parameters
        self.execute_command(msg.command, msg.parameters, msg.priority)

    def execute_command(self, command, params, priority):
        # Implementation of command execution
        pass
```

## Service-Based Communication

Services provide synchronous request-response communication:

```python
from my_robot_msgs.srv import NavigationService

class NavigationServiceServer(Node):
    def __init__(self):
        super().__init__('navigation_service')
        self.srv = self.create_service(
            NavigationService,
            'navigate_to_pose',
            self.navigate_callback
        )

    def navigate_callback(self, request, response):
        self.get_logger().info(f'Navigating to: {request.x}, {request.y}')

        # Perform navigation logic
        success = self.perform_navigation(request.x, request.y, request.theta)

        response.success = success
        if success:
            response.message = "Navigation completed successfully"
        else:
            response.message = "Navigation failed"

        return response

    def perform_navigation(self, x, y, theta):
        # Implementation of navigation algorithm
        return True  # Simplified for example
```

### Service Client Implementation

```python
class NavigationServiceClient(Node):
    def __init__(self):
        super().__init__('navigation_client')
        self.cli = self.create_client(NavigationService, 'navigate_to_pose')
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting again...')

    def send_request(self, x, y, theta):
        request = NavigationService.Request()
        request.x = x
        request.y = y
        request.theta = theta

        self.future = self.cli.call_async(request)
        return self.future
```

## Quality of Service (QoS) Patterns

Different QoS settings for different use cases:

```python
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSHistoryPolicy, QoSDurabilityPolicy

# For sensor data (real-time, no old data needed)
sensor_qos = QoSProfile(
    depth=5,
    reliability=QoSReliabilityPolicy.RELIABLE,
    history=QoSHistoryPolicy.KEEP_LAST,
    durability=QoSDurabilityPolicy.VOLATILE
)

# For configuration parameters (must be delivered)
config_qos = QoSProfile(
    depth=1,
    reliability=QoSReliabilityPolicy.RELIABLE,
    history=QoSHistoryPolicy.KEEP_LAST,
    durability=QoSDurabilityPolicy.TRANSIENT_LOCAL
)

# For logging (best effort, keep many messages)
log_qos = QoSProfile(
    depth=100,
    reliability=QoSReliabilityPolicy.BEST_EFFORT,
    history=QoSHistoryPolicy.KEEP_ALL,
    durability=QoSDurabilityPolicy.VOLATILE
)
```

## Practical Exercise: Implement a Sensor Fusion Node

Create a node that subscribes to multiple sensor topics and publishes fused data:

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, Imu
from geometry_msgs.msg import PoseWithCovarianceStamped
import numpy as np

class SensorFusionNode(Node):
    def __init__(self):
        super().__init__('sensor_fusion')

        # Subscribers for different sensors
        self.laser_sub = self.create_subscription(
            LaserScan, 'scan', self.laser_callback, 10
        )
        self.imu_sub = self.create_subscription(
            Imu, 'imu/data', self.imu_callback, 10
        )

        # Publisher for fused data
        self.pose_pub = self.create_publisher(
            PoseWithCovarianceStamped, 'fused_pose', 10
        )

        # Store sensor data
        self.laser_data = None
        self.imu_data = None

    def laser_callback(self, msg):
        self.laser_data = msg
        self.fuse_sensors()

    def imu_callback(self, msg):
        self.imu_data = msg
        self.fuse_sensors()

    def fuse_sensors(self):
        if self.laser_data and self.imu_data:
            # Perform sensor fusion algorithm
            fused_pose = self.perform_fusion()
            self.pose_pub.publish(fused_pose)

    def perform_fusion(self):
        # Simplified fusion algorithm
        pose_msg = PoseWithCovarianceStamped()
        pose_msg.header.stamp = self.get_clock().now().to_msg()
        pose_msg.header.frame_id = 'map'
        # Fusion implementation here
        return pose_msg
```

## Summary

This section covered advanced topics in ROS 2 communication, including lifecycle nodes, custom message types, services, and QoS patterns. You learned how to implement complex communication architectures that are essential for building robust robotic systems. These concepts will be applied throughout the curriculum as we build more sophisticated robotic applications.