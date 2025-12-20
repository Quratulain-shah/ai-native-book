---
title: "ROS 2 Fundamentals"
slug: "/module-1/ros2-fundamentals"
sidebar_position: 2
---

# ROS 2 Fundamentals

## Understanding ROS 2 Architecture

The Robot Operating System 2 (ROS 2) is a flexible framework for writing robot software. It is a collection of tools, libraries, and conventions that aim to simplify the task of creating complex and robust robot behavior across a wide variety of robot platforms.

### Key Concepts

- **Nodes**: Processes that perform computation
- **Topics**: Named buses over which nodes exchange messages
- **Messages**: ROS data types used when publishing or subscribing to a Topic
- **Services**: Synchronous request/response communication
- **Actions**: Asynchronous communication for long-running tasks

### Middleware Implementation

ROS 2 uses DDS (Data Distribution Service) as its underlying middleware. This provides:

- **Real-time capabilities**
- **Deterministic behavior**
- **Quality of Service (QoS) policies**
- **Distributed system support**

## Creating Your First ROS 2 Node

Let's create a simple ROS 2 node that publishes sensor data and subscribes to actuator commands.

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):

    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Quality of Service (QoS) Settings

QoS settings allow you to specify the behavior of your ROS 2 communication:

```python
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSHistoryPolicy

qos_profile = QoSProfile(
    depth=10,
    reliability=QoSReliabilityPolicy.RELIABLE,
    history=QoSHistoryPolicy.KEEP_LAST
)
```

## Setting Up Your Development Environment

### Installing ROS 2 Humble Hawksbill

```bash
# Add the ROS 2 apt repository
sudo apt update && sudo apt install curl gnupg lsb-release
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(source /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

sudo apt update
sudo apt install ros-humble-desktop
```

### Environment Setup

```bash
source /opt/ros/humble/setup.bash
```

## Practical Exercise: Simple Publisher-Subscriber System

Create a publisher that simulates sensor data and a subscriber that processes it:

**Publisher Code:**
```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
import random

class SensorPublisher(Node):
    def __init__(self):
        super().__init__('sensor_publisher')
        self.publisher_ = self.create_publisher(LaserScan, 'sensor_scan', 10)
        self.timer = self.create_timer(0.1, self.publish_scan)

    def publish_scan(self):
        msg = LaserScan()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.header.frame_id = 'laser_frame'
        msg.angle_min = -1.57
        msg.angle_max = 1.57
        msg.angle_increment = 0.01
        msg.ranges = [random.uniform(0.1, 10.0) for _ in range(314)]

        self.publisher_.publish(msg)

def main():
    rclpy.init()
    node = SensorPublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()
```

## Summary

This section introduced the fundamental concepts of ROS 2, including nodes, topics, services, and actions. You learned how to create basic publisher and subscriber nodes, configure QoS settings, and set up your development environment. These concepts form the foundation for all subsequent modules in the Physical AI curriculum.