---
title: "RCLPY Python Client Library"
slug: "/module-1/rclpy-python"
sidebar_position: 5
---

# RCLPY Python Client Library

## Introduction to RCLPY

RCLPY (Robot Client Library for Python) is the Python client library for ROS 2. It provides the interface between Python applications and the ROS 2 middleware, allowing you to create nodes, publish and subscribe to topics, provide and use services, and more.

## Core Concepts

### Node Creation and Management

The fundamental building block in ROS 2 is the Node:

```python
import rclpy
from rclpy.node import Node

class MyNode(Node):
    def __init__(self):
        super().__init__('my_node_name')
        self.get_logger().info('Node initialized')

def main(args=None):
    rclpy.init(args=args)
    node = MyNode()

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

RCLPY provides a robust parameter system:

```python
import rclpy
from rclpy.node import Node

class ParameterNode(Node):
    def __init__(self):
        super().__init__('parameter_node')

        # Declare parameters with default values
        self.declare_parameter('robot_name', 'default_robot')
        self.declare_parameter('max_velocity', 1.0)
        self.declare_parameter('safety_enabled', True)

        # Get parameter values
        self.robot_name = self.get_parameter('robot_name').value
        self.max_velocity = self.get_parameter('max_velocity').value
        self.safety_enabled = self.get_parameter('safety_enabled').value

        self.get_logger().info(f'Robot: {self.robot_name}, Max Velocity: {self.max_velocity}')

    def parameter_callback(self, params):
        for param in params:
            if param.name == 'max_velocity' and param.type_ == param.Type.DOUBLE:
                self.max_velocity = param.value
                self.get_logger().info(f'New max velocity: {self.max_velocity}')
        return SetParametersResult(successful=True)

def main():
    rclpy.init()
    node = ParameterNode()

    # Add parameter callback
    node.add_on_set_parameters_callback(node.parameter_callback)

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

## Advanced Publisher-Subscriber Patterns

### Publisher with QoS Settings

```python
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSHistoryPolicy
from std_msgs.msg import String

class AdvancedPublisher(Node):
    def __init__(self):
        super().__init__('advanced_publisher')

        # Define custom QoS profile
        qos_profile = QoSProfile(
            depth=10,
            reliability=QoSReliabilityPolicy.RELIABLE,
            history=QoSHistoryPolicy.KEEP_LAST
        )

        self.publisher = self.create_publisher(String, 'topic_name', qos_profile)
        self.timer = self.create_timer(1.0, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello from {self.get_name()}'
        self.publisher.publish(msg)
```

### Subscription with Custom Callback Groups

```python
from rclpy.callback_groups import MutuallyExclusiveCallbackGroup, ReentrantCallbackGroup

class AdvancedSubscriber(Node):
    def __init__(self):
        super().__init__('advanced_subscriber')

        # Create callback groups for different processing priorities
        high_priority_cb_group = MutuallyExclusiveCallbackGroup()
        low_priority_cb_group = ReentrantCallbackGroup()

        # High priority subscription (e.g., emergency stop)
        self.emergency_sub = self.create_subscription(
            String,
            'emergency_stop',
            self.emergency_callback,
            10,
            callback_group=high_priority_cb_group
        )

        # Low priority subscription (e.g., status updates)
        self.status_sub = self.create_subscription(
            String,
            'status_updates',
            self.status_callback,
            10,
            callback_group=low_priority_cb_group
        )

    def emergency_callback(self, msg):
        self.get_logger().warn(f'EMERGENCY: {msg.data}')
        # Handle emergency situation immediately

    def status_callback(self, msg):
        self.get_logger().info(f'Status: {msg.data}')
        # Process status in background
```

## Service and Action Implementation

### Service Server with Error Handling

```python
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class MathServiceServer(Node):
    def __init__(self):
        super().__init__('math_service_server')
        self.srv = self.create_service(
            AddTwoInts,
            'add_two_ints',
            self.add_callback
        )

    def add_callback(self, request, response):
        try:
            # Validate inputs
            if request.a < 0 or request.b < 0:
                self.get_logger().error('Negative numbers not allowed')
                response.sum = 0
                return response

            # Perform calculation
            result = request.a + request.b
            response.sum = result

            self.get_logger().info(f'{request.a} + {request.b} = {result}')

        except Exception as e:
            self.get_logger().error(f'Service error: {str(e)}')
            response.sum = 0

        return response
```

### Action Server Implementation

```python
import time
from rclpy.action import ActionServer, CancelResponse, GoalResponse
from rclpy.node import Node
from example_interfaces.action import Fibonacci

class FibonacciActionServer(Node):
    def __init__(self):
        super().__init__('fibonacci_action_server')
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            execute_callback=self.execute_callback,
            callback_group=rclpy.callback_groups.ReentrantCallbackGroup(),
            goal_callback=self.goal_callback,
            cancel_callback=self.cancel_callback
        )

    def goal_callback(self, goal_request):
        self.get_logger().info('Received goal request')
        return GoalResponse.ACCEPT

    def cancel_callback(self, goal_handle):
        self.get_logger().info('Received cancel request')
        return CancelResponse.ACCEPT

    async def execute_callback(self, goal_handle):
        self.get_logger().info('Executing goal...')

        feedback_msg = Fibonacci.Feedback()
        feedback_msg.sequence = [0, 1]

        for i in range(1, goal_handle.request.order):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return Fibonacci.Result()

            feedback_msg.sequence.append(
                feedback_msg.sequence[i] + feedback_msg.sequence[i-1]
            )

            self.get_logger().info(f'Feedback: {feedback_msg.sequence}')
            goal_handle.publish_feedback(feedback_msg)

            time.sleep(1)

        goal_handle.succeed()
        result = Fibonacci.Result()
        result.sequence = feedback_msg.sequence
        self.get_logger().info(f'Result: {result.sequence}')

        return result
```

## Timer and Rate Control

### Multiple Timers with Different Rates

```python
import rclpy
from rclpy.node import Node

class TimedNode(Node):
    def __init__(self):
        super().__init__('timed_node')

        # High frequency timer (100 Hz)
        self.high_freq_timer = self.create_timer(
            0.01,  # 10ms = 100Hz
            self.high_freq_callback
        )

        # Medium frequency timer (10 Hz)
        self.med_freq_timer = self.create_timer(
            0.1,   # 100ms = 10Hz
            self.med_freq_callback
        )

        # Low frequency timer (1 Hz)
        self.low_freq_timer = self.create_timer(
            1.0,   # 1000ms = 1Hz
            self.low_freq_callback
        )

    def high_freq_callback(self):
        # Process high-frequency data (e.g., sensor readings)
        self.get_logger().debug('High frequency callback')

    def med_freq_callback(self):
        # Process medium-frequency data (e.g., control updates)
        self.get_logger().info('Medium frequency callback')

    def low_freq_callback(self):
        # Process low-frequency data (e.g., status updates)
        self.get_logger().info('Low frequency callback')
```

## Client Implementation

### Service Client

```python
import rclpy
from rclpy.action import ActionClient
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class MathClientAsync(Node):
    def __init__(self):
        super().__init__('math_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting again...')

    def send_request(self, a, b):
        request = AddTwoInts.Request()
        request.a = a
        request.b = b
        self.future = self.cli.call_async(request)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()
```

### Action Client

```python
import time
from rclpy.action import ActionClient
from rclpy.node import Node
from example_interfaces.action import Fibonacci

class FibonacciActionClient(Node):
    def __init__(self):
        super().__init__('fibonacci_action_client')
        self._action_client = ActionClient(
            self,
            Fibonacci,
            'fibonacci'
        )

    def send_goal(self, order):
        goal_msg = Fibonacci.Goal()
        goal_msg.order = order

        self._action_client.wait_for_server()

        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )

        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected')
            return

        self.get_logger().info('Goal accepted')

        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)

    def feedback_callback(self, feedback_msg):
        self.get_logger().info(f'Received feedback: {feedback_msg.feedback.sequence}')

    def get_result_callback(self, future):
        result = future.result().result
        self.get_logger().info(f'Result: {result.sequence}')
```

## Practical Exercise: Robot Control Node

Create a comprehensive robot control node that demonstrates all concepts:

```python
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan
from std_msgs.msg import String
from rclpy.action import ActionClient
from example_interfaces.action import Fibonacci

class RobotController(Node):
    def __init__(self):
        super().__init__('robot_controller')

        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.status_pub = self.create_publisher(String, 'robot_status', 10)

        # Subscribers
        self.scan_sub = self.create_subscription(
            LaserScan, 'scan', self.scan_callback, 10
        )

        # Timers
        self.control_timer = self.create_timer(0.1, self.control_loop)

        # Parameters
        self.declare_parameter('max_linear_velocity', 1.0)
        self.declare_parameter('max_angular_velocity', 1.0)
        self.declare_parameter('safety_distance', 0.5)

        # State variables
        self.scan_data = None
        self.safety_mode = False

        self.get_logger().info('Robot Controller initialized')

    def scan_callback(self, msg):
        self.scan_data = msg
        # Check for obstacles
        if self.scan_data:
            min_distance = min(self.scan_data.ranges)
            if min_distance < self.get_parameter('safety_distance').value:
                self.safety_mode = True
                self.get_logger().warn('Obstacle detected! Entering safety mode.')
            else:
                self.safety_mode = False

    def control_loop(self):
        if self.safety_mode:
            # Stop the robot in safety mode
            cmd = Twist()
            cmd.linear.x = 0.0
            cmd.angular.z = 0.0
        else:
            # Normal control logic (simple example)
            cmd = Twist()
            cmd.linear.x = self.get_parameter('max_linear_velocity').value * 0.5
            cmd.angular.z = 0.0  # Go straight

        self.cmd_vel_pub.publish(cmd)

def main():
    rclpy.init()
    controller = RobotController()

    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        pass
    finally:
        controller.destroy_node()
        rclpy.shutdown()
```

## Best Practices

### Error Handling and Logging

```python
import traceback

def robust_callback(self, msg):
    try:
        # Process message
        result = self.process_data(msg)
        self.publish_result(result)
    except ValueError as e:
        self.get_logger().error(f'Value error in callback: {e}')
    except Exception as e:
        self.get_logger().error(f'Unexpected error: {e}')
        self.get_logger().error(traceback.format_exc())
```

### Memory Management

```python
def cleanup_resources(self):
    # Properly destroy publishers, subscribers, timers
    if self.publisher:
        self.destroy_publisher(self.publisher)
    if self.subscriber:
        self.destroy_subscription(self.subscriber)
    if self.timer:
        self.destroy_timer(self.timer)
```

## Summary

This section covered the RCLPY Python client library in depth, including node creation, parameter management, advanced publisher-subscriber patterns, services, actions, timers, and clients. You learned how to create robust, well-structured ROS 2 nodes using Python. These skills are fundamental for all subsequent modules in the Physical AI curriculum, as you'll be using RCLPY extensively to implement robotic systems.