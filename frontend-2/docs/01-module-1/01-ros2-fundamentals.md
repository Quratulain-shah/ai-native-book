---
title: "ROS 2 Fundamentals: Architecture and Core Concepts"
slug: "/module-1/ros2-fundamentals"
sidebar_position: 2
---

# ROS 2 Fundamentals: Architecture and Core Concepts

## Introduction to ROS 2

The Robot Operating System 2 (ROS 2) is a flexible framework for writing robot software. It is a collection of tools, libraries, and conventions that aim to simplify the task of creating complex and robust robot behavior across a wide variety of robot platforms. Unlike traditional operating systems, ROS 2 is middleware that provides services designed for a heterogeneous computer cluster, including hardware abstraction, device drivers, libraries, visualizers, message-passing, package management, and more.

ROS 2 represents a significant evolution from ROS 1, addressing critical requirements for production robotics including real-time performance, security, and multi-robot systems.

## Theory: Core Architecture

### Middleware Implementation

ROS 2 uses a middleware approach based on the Data Distribution Service (DDS) standard. DDS provides a publisher-subscriber communication model that enables loose coupling between components. The middleware layer handles:

- **Discovery**: Automatic discovery of nodes and topics on the network
- **Transport**: Reliable message delivery between nodes
- **Quality of Service (QoS)**: Configurable policies for message delivery
- **Security**: Authentication, encryption, and access control

### Key Architecture Components

#### Nodes
Nodes are the fundamental execution units in ROS 2. Each node is a process that performs computation and communicates with other nodes. Key characteristics:

- **Isolation**: Nodes run independently and can be developed separately
- **Communication**: Nodes communicate through topics, services, and actions
- **Lifecycle**: Nodes can have defined lifecycle states (unconfigured, inactive, active, finalized)
- **Namespacing**: Nodes can be organized using namespaces for better organization

#### Topics and Messages
Topics provide asynchronous, many-to-many communication using a publish-subscribe pattern:

- **Messages**: Structured data packets with defined schemas (`.msg` files)
- **Publishers**: Send messages to topics
- **Subscribers**: Receive messages from topics
- **Types**: Strongly typed communication with automatic serialization

#### Services
Services provide synchronous, request-response communication:

- **Requests**: Client sends a request message
- **Responses**: Server sends a response message
- **Blocking**: Client waits for response before continuing
- **Use Cases**: Configuration, calibration, one-time operations

#### Actions
Actions provide goal-oriented communication with feedback:

- **Goals**: Clients send goals to servers
- **Feedback**: Servers send ongoing feedback during goal execution
- **Results**: Servers send final results when goals complete
- **Cancelation**: Goals can be canceled during execution

### Quality of Service (QoS) Profiles

QoS profiles allow fine-tuning of communication behavior:

#### Reliability Policy
- **Reliable**: All messages are delivered (with retries)
- **Best Effort**: Messages may be lost (faster, less overhead)

#### Durability Policy
- **Transient Local**: Late-joining subscribers receive last message
- **Volatile**: Only new messages are sent to subscribers

#### Deadline and Lifespan
- **Deadline**: Maximum time between consecutive messages
- **Lifespan**: Maximum time messages are kept in system

## Simulation: Implementing ROS 2 Architecture

### Setting Up the Development Environment

First, let's create a basic ROS 2 package structure for our simulation:

```bash
# Create a new workspace
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# Create a package for our simulation
colcon build --packages-select
source install/setup.bash
```

### Creating a Simple Publisher Node

Let's implement a basic publisher node in Python:

```python
# File: ~/ros2_ws/src/my_robot_simulation/my_robot_simulation/simple_publisher.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class SimplePublisher(Node):
    def __init__(self):
        super().__init__('simple_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello World: {self.i}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1


def main(args=None):
    rclpy.init(args=args)
    simple_publisher = SimplePublisher()
    rclpy.spin(simple_publisher)
    simple_publisher.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Creating a Simple Subscriber Node

```python
# File: ~/ros2_ws/src/my_robot_simulation/my_robot_simulation/simple_subscriber.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class SimpleSubscriber(Node):
    def __init__(self):
        super().__init__('simple_subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info(f'I heard: "{msg.data}"')


def main(args=None):
    rclpy.init(args=args)
    simple_subscriber = SimpleSubscriber()
    rclpy.spin(simple_subscriber)
    simple_subscriber.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Running the Simulation

```bash
# Terminal 1: Run the publisher
source ~/ros2_ws/install/setup.bash
python3 ~/ros2_ws/src/my_robot_simulation/my_robot_simulation/simple_publisher.py

# Terminal 2: Run the subscriber
source ~/ros2_ws/install/setup.bash
python3 ~/ros2_ws/src/my_robot_simulation/my_robot_simulation/simple_subscriber.py
```

### Advanced Architecture: Lifecycle Nodes

For more robust systems, we can implement lifecycle nodes:

```python
# File: ~/ros2_ws/src/my_robot_simulation/my_robot_simulation/lifecycle_node.py
import rclpy
from rclpy.lifecycle import LifecycleNode, LifecycleState, TransitionCallbackReturn
from rclpy.executors import SingleThreadedExecutor
from rclpy.qos import qos_profile_sensor_data
from sensor_msgs.msg import LaserScan


class LifecycleSensorNode(LifecycleNode):
    def __init__(self):
        super().__init__('lifecycle_sensor_node')
        self.subscription = None

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info(f'Configuring {self.get_name()}')
        self.subscription = self.create_subscription(
            LaserScan,
            'scan',
            self.scan_callback,
            qos_profile=qos_profile_sensor_data
        )
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info(f'Activating {self.get_name()}')
        return super().on_activate(state)

    def on_deactivate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info(f'Deactivating {self.get_name()}')
        return super().on_deactivate(state)

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info(f'Cleaning up {self.get_name()}')
        self.subscription = None
        return TransitionCallbackReturn.SUCCESS

    def scan_callback(self, msg: LaserScan):
        self.get_logger().info(f'Received scan with {len(msg.ranges)} ranges')


def main(args=None):
    rclpy.init(args=args)

    node = LifecycleSensorNode()

    # Transition through states
    node.trigger_configure()
    node.trigger_activate()

    executor = SingleThreadedExecutor()
    executor.add_node(node)

    try:
        executor.spin()
    except KeyboardInterrupt:
        pass
    finally:
        node.trigger_deactivate()
        node.trigger_cleanup()
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Real: Physical Deployment on Jetson Orin Nano

### Cross-Platform Considerations

When deploying ROS 2 packages on the NVIDIA Jetson Orin Nano, several considerations must be addressed:

#### Performance Optimization
- **Threading**: Utilize multi-threading for concurrent operations
- **Memory Management**: Optimize for the Jetson's memory constraints
- **GPU Acceleration**: Leverage Jetson's GPU for AI workloads
- **Power Management**: Configure for optimal power efficiency

#### Hardware Integration
- **Sensor Drivers**: Implement drivers for connected sensors
- **Actuator Control**: Interface with motor controllers and actuators
- **Communication**: Configure network interfaces and communication protocols

### Deploying to Jetson Orin Nano

#### Setting Up the Jetson Environment

```bash
# On the Jetson Orin Nano, install ROS 2 Humble
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt upgrade -y

# Install ROS 2 Humble
sudo apt install ros-humble-ros-base
sudo apt install python3-rosdep python3-rosinstall python3-vcstool

# Initialize rosdep
sudo rosdep init
rosdep update

# Source ROS 2
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

#### Building for ARM Architecture

```bash
# Create workspace on Jetson
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src

# Copy your packages to the Jetson
# This can be done via scp, git, or other methods

# Build the packages
cd ~/ros2_ws
colcon build --packages-select my_robot_simulation
source install/setup.bash
```

### Optimized Publisher for Jetson

```python
# File: ~/ros2_ws/src/my_robot_simulation/my_robot_simulation/jetson_publisher.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import Header
import numpy as np
import cv2
from cv_bridge import CvBridge


class JetsonPublisher(Node):
    def __init__(self):
        super().__init__('jetson_publisher')

        # Initialize OpenCV bridge
        self.bridge = CvBridge()

        # Create publisher for image data
        self.image_publisher = self.create_publisher(
            Image,
            'camera/image_raw',
            10
        )

        # Timer for image capture
        timer_period = 0.1  # 10Hz
        self.timer = self.create_timer(timer_period, self.timer_callback)

        # Initialize camera (example with dummy data)
        self.camera = self.initialize_camera()

        # Performance monitoring
        self.frame_count = 0
        self.get_logger().info('Jetson Publisher initialized')

    def initialize_camera(self):
        """Initialize camera - this would be platform-specific"""
        # In a real implementation, this would initialize the actual camera
        # For simulation, we'll create dummy frames
        return None

    def timer_callback(self):
        """Capture and publish image data"""
        try:
            # In a real implementation, capture from actual camera
            # For this example, we'll create a dummy image
            dummy_image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)

            # Convert to ROS Image message
            ros_image = self.bridge.cv2_to_imgmsg(dummy_image, encoding="bgr8")
            ros_image.header = Header()
            ros_image.header.stamp = self.get_clock().now().to_msg()
            ros_image.header.frame_id = "camera_frame"

            # Publish the image
            self.image_publisher.publish(ros_image)

            # Performance logging
            self.frame_count += 1
            if self.frame_count % 100 == 0:
                self.get_logger().info(f'Published {self.frame_count} frames')

        except Exception as e:
            self.get_logger().error(f'Error in timer_callback: {str(e)}')

    def destroy_node(self):
        """Clean up resources"""
        if self.camera is not None:
            # Release camera resources
            pass
        super().destroy_node()


def main(args=None):
    rclpy.init(args=args)

    # Optimize for Jetson's multi-core architecture
    jetson_publisher = JetsonPublisher()

    try:
        rclpy.spin(jetson_publisher)
    except KeyboardInterrupt:
        pass
    finally:
        jetson_publisher.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Performance Monitoring and Optimization

```python
# File: ~/ros2_ws/src/my_robot_simulation/my_robot_simulation/performance_monitor.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import psutil
import GPUtil
import time


class PerformanceMonitor(Node):
    def __init__(self):
        super().__init__('performance_monitor')

        # Publishers for system metrics
        self.cpu_publisher = self.create_publisher(Float32, 'system/cpu_usage', 10)
        self.memory_publisher = self.create_publisher(Float32, 'system/memory_usage', 10)
        self.gpu_publisher = self.create_publisher(Float32, 'system/gpu_usage', 10)

        # Timer for monitoring
        self.timer = self.create_timer(1.0, self.monitor_callback)  # 1Hz monitoring

        self.get_logger().info('Performance Monitor initialized')

    def monitor_callback(self):
        """Monitor system resources"""
        try:
            # CPU usage
            cpu_percent = psutil.cpu_percent()
            cpu_msg = Float32()
            cpu_msg.data = float(cpu_percent)
            self.cpu_publisher.publish(cpu_msg)

            # Memory usage
            memory_percent = psutil.virtual_memory().percent
            memory_msg = Float32()
            memory_msg.data = float(memory_percent)
            self.memory_publisher.publish(memory_msg)

            # GPU usage (for Jetson)
            gpus = GPUtil.getGPUs()
            if gpus:
                gpu_load = gpus[0].load * 100  # Convert to percentage
                gpu_msg = Float32()
                gpu_msg.data = float(gpu_load)
                self.gpu_publisher.publish(gpu_msg)
            else:
                # If no GPU detected, publish -1
                gpu_msg = Float32()
                gpu_msg.data = -1.0
                self.gpu_publisher.publish(gpu_msg)

            # Log warnings if thresholds are exceeded
            if cpu_percent > 80 or memory_percent > 80:
                self.get_logger().warning(
                    f'High resource usage - CPU: {cpu_percent}%, Memory: {memory_percent}%'
                )

        except Exception as e:
            self.get_logger().error(f'Error in monitor_callback: {str(e)}')


def main(args=None):
    rclpy.init(args=args)
    monitor = PerformanceMonitor()

    try:
        rclpy.spin(monitor)
    except KeyboardInterrupt:
        pass
    finally:
        monitor.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Exercises and Practical Applications

### Exercise 1: Basic Node Communication
Create two nodes that communicate using a custom message type to control a simulated robot's movement.

### Exercise 2: QoS Configuration
Experiment with different QoS profiles to understand their impact on communication reliability and performance.

### Exercise 3: Lifecycle Management
Implement a lifecycle node that properly manages resources and handles state transitions.

### Exercise 4: Performance Optimization
Profile your nodes on the Jetson platform and optimize for real-time performance.

## Troubleshooting Common Issues

### Communication Issues
- **Node Discovery**: Check ROS_DOMAIN_ID consistency across devices
- **Network Configuration**: Ensure proper network setup for multi-device communication
- **Firewall Settings**: Open necessary ports for ROS 2 communication

### Performance Issues
- **Memory Leaks**: Implement proper cleanup in node destruction
- **CPU Usage**: Optimize algorithms and consider multi-threading
- **Real-time Performance**: Use appropriate scheduling policies

### Hardware Integration Issues
- **Driver Compatibility**: Ensure drivers are compatible with ROS 2
- **Resource Conflicts**: Check for resource conflicts between processes
- **Power Management**: Configure for optimal power/performance balance

## Summary

This chapter has introduced the fundamental concepts of ROS 2 architecture, from basic node communication to advanced lifecycle management and deployment on edge computing platforms like the NVIDIA Jetson Orin Nano. The Theory → Simulation → Real approach allows for safe development and testing before physical deployment, ensuring robust and reliable robotic systems.

Understanding these foundational concepts is crucial for success in subsequent modules, where these communication patterns will be extended to support complex perception, navigation, and AI systems.

:::tip
Always test your ROS 2 nodes thoroughly in simulation before deploying to physical hardware. The modular architecture of ROS 2 allows for easy testing and debugging of individual components.
:::

:::caution
When deploying to physical hardware, ensure all safety protocols are implemented and tested. ROS 2 provides the framework for safe operation, but proper safety mechanisms must be designed and implemented in your specific application.
:::