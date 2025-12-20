---
title: "Physical Deployment"
slug: "/module-1/physical-deployment"
sidebar_position: 7
---

# Physical Deployment

## Introduction to Physical Robot Deployment

Physical deployment is the process of transferring algorithms and systems developed in simulation to real physical robots. This transition requires careful consideration of real-world constraints, hardware limitations, and safety protocols.

## Hardware Platform Overview

### NVIDIA Jetson Orin Nano

The NVIDIA Jetson Orin Nano is a powerful edge AI computer designed for robotics applications:

**Specifications:**
- **GPU**: 1024-core NVIDIA Ampere architecture GPU
- **CPU**: 6-core ARM Cortex-A78AE v8.2 64-bit CPU
- **Memory**: 4GB or 8GB LPDDR5
- **Power**: 15W to 25W
- **Connectivity**: Gigabit Ethernet, Wi-Fi, Bluetooth

### Robot Platforms

For this curriculum, we'll focus on humanoid and quadruped platforms:

#### Unitree Robots
- **Go2**: Lightweight quadruped robot
- **G1**: Humanoid robot platform
- **Key Features**: Real-time control, multiple sensors, ROS 2 support

#### Custom Platforms
- **Development kits** for rapid prototyping
- **Modular designs** for experimentation
- **Open-source** hardware and software

## Setting Up the Development Environment

### ROS 2 on Jetson Platform

#### Installation on Jetson Orin Nano

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install ROS 2 Humble Hawksbill
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

sudo apt update
sudo apt install ros-humble-ros-base
sudo apt install python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool build-essential

# Install additional dependencies
sudo apt install ros-humble-gazebo-ros-pkgs ros-humble-gazebo-ros2-control ros-humble-ros2-control ros-humble-ros2-controllers
```

#### Environment Setup

```bash
# Add to ~/.bashrc
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
echo "source /usr/share/colcon_cd/function/colcon_cd.sh" >> ~/.bashrc
echo "export COLCON_CD_PATHS_BLACKLIST=/opt/ros" >> ~/.bashrc
source ~/.bashrc
```

## Hardware Integration

### Sensor Integration

#### Intel RealSense D435i Integration

```python
# Install RealSense packages
sudo apt install ros-humble-realsense2-camera ros-humble-realsense2-description

# Launch RealSense camera
# realsense.launch.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='realsense2_camera',
            executable='realsense2_camera_node',
            name='realsense_camera',
            parameters=[{
                'enable_color': True,
                'enable_depth': True,
                'enable_infra1': True,
                'enable_infra2': True,
                'depth_module.profile': '640x480x30',
                'color_module.profile': '640x480x30',
                'publish_tf': True,
            }]
        )
    ])
```

#### IMU Integration

```python
# Example IMU node
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu
import board
import adafruit_bno055

class IMUNode(Node):
    def __init__(self):
        super().__init__('imu_node')
        self.publisher = self.create_publisher(Imu, 'imu/data', 10)
        self.timer = self.create_timer(0.01, self.timer_callback)  # 100 Hz

        # Initialize IMU
        try:
            i2c = board.I2C()
            self.sensor = adafruit_bno055.BNO055_I2C(i2c)
            self.get_logger().info('IMU initialized successfully')
        except Exception as e:
            self.get_logger().error(f'Failed to initialize IMU: {e}')
            self.sensor = None

    def timer_callback(self):
        if self.sensor:
            msg = Imu()
            msg.header.stamp = self.get_clock().now().to_msg()
            msg.header.frame_id = 'imu_link'

            # Get orientation (quaternion)
            quat = self.sensor.quaternion
            if quat:
                msg.orientation.x = quat[0]
                msg.orientation.y = quat[1]
                msg.orientation.z = quat[2]
                msg.orientation.w = quat[3]

            # Get angular velocity
            gyro = self.sensor.gyro
            if gyro:
                msg.angular_velocity.x = gyro[0]
                msg.angular_velocity.y = gyro[1]
                msg.angular_velocity.z = gyro[2]

            # Get linear acceleration
            accel = self.sensor.acceleration
            if accel:
                msg.linear_acceleration.x = accel[0]
                msg.linear_acceleration.y = accel[1]
                msg.linear_acceleration.z = accel[2]

            self.publisher.publish(msg)
```

### Motor Control Integration

#### PWM Motor Control

```python
# Motor control node
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64MultiArray
import pigpio

class MotorControlNode(Node):
    def __init__(self):
        super().__init__('motor_control')
        self.subscription = self.create_subscription(
            Float64MultiArray,
            'motor_commands',
            self.motor_callback,
            10
        )

        # Initialize GPIO for PWM
        self.pi = pigpio.pi()
        self.motor_pins = [12, 13, 14, 15]  # Example GPIO pins

        # Setup PWM for each motor
        for pin in self.motor_pins:
            self.pi.set_mode(pin, pigpio.OUTPUT)
            self.pi.set_PWM_frequency(pin, 50)  # 50Hz for servos

        self.get_logger().info('Motor control initialized')

    def motor_callback(self, msg):
        commands = msg.data
        for i, cmd in enumerate(commands):
            if i < len(self.motor_pins):
                # Convert command to PWM duty cycle (0-100)
                duty_cycle = max(0, min(100, (cmd + 1.0) * 50))  # Map [-1,1] to [0,100]
                self.pi.set_PWM_dutycycle(self.motor_pins[i], duty_cycle)

    def destroy_node(self):
        # Cleanup PWM
        for pin in self.motor_pins:
            self.pi.set_PWM_dutycycle(pin, 0)
        self.pi.stop()
        super().destroy_node()
```

## Safety and Error Handling

### Emergency Stop System

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool, String
from geometry_msgs.msg import Twist

class SafetySystem(Node):
    def __init__(self):
        super().__init__('safety_system')

        # Subscriptions
        self.cmd_vel_sub = self.create_subscription(
            Twist, 'cmd_vel', self.cmd_vel_callback, 10
        )
        self.emergency_stop_sub = self.create_subscription(
            Bool, 'emergency_stop', self.emergency_stop_callback, 10
        )

        # Publishers
        self.safe_cmd_pub = self.create_publisher(Twist, 'safe_cmd_vel', 10)
        self.status_pub = self.create_publisher(String, 'safety_status', 10)

        # Parameters
        self.declare_parameter('max_linear_velocity', 1.0)
        self.declare_parameter('max_angular_velocity', 1.0)

        # State
        self.emergency_active = False
        self.last_cmd_time = self.get_clock().now()

    def cmd_vel_callback(self, msg):
        current_time = self.get_clock().now()

        # Check for timeout (no commands received)
        if (current_time - self.last_cmd_time).nanoseconds > 1e9:  # 1 second
            self.get_logger().warn('Command timeout - stopping robot')
            self.emergency_active = True

        self.last_cmd_time = current_time

        # Check velocity limits
        max_lin = self.get_parameter('max_linear_velocity').value
        max_ang = self.get_parameter('max_angular_velocity').value

        if (abs(msg.linear.x) > max_lin or
            abs(msg.angular.z) > max_ang):
            self.get_logger().warn('Velocity limits exceeded - activating safety')
            self.emergency_active = True
            return

        # Publish safe command if not in emergency
        if not self.emergency_active:
            self.safe_cmd_pub.publish(msg)

    def emergency_stop_callback(self, msg):
        self.emergency_active = msg.data
        status_msg = String()
        status_msg.data = 'EMERGENCY' if self.emergency_active else 'NORMAL'
        self.status_pub.publish(status_msg)

def main():
    rclpy.init()
    safety_system = SafetySystem()

    try:
        rclpy.spin(safety_system)
    except KeyboardInterrupt:
        pass
    finally:
        safety_system.destroy_node()
        rclpy.shutdown()
```

### Hardware Fault Detection

```python
import rclpy
from rclpy.node import Node
from diagnostic_msgs.msg import DiagnosticArray, DiagnosticStatus
from sensor_msgs.msg import BatteryState
import psutil

class HardwareMonitor(Node):
    def __init__(self):
        super().__init__('hardware_monitor')

        self.diag_pub = self.create_publisher(DiagnosticArray, '/diagnostics', 10)
        self.battery_pub = self.create_publisher(BatteryState, 'battery_status', 10)

        self.timer = self.create_timer(1.0, self.monitor_callback)

    def monitor_callback(self):
        # Create diagnostic message
        diag_array = DiagnosticArray()
        diag_array.header.stamp = self.get_clock().now().to_msg()

        # CPU diagnostic
        cpu_status = DiagnosticStatus()
        cpu_status.name = 'CPU Monitor'
        cpu_percent = psutil.cpu_percent()
        cpu_status.level = DiagnosticStatus.OK if cpu_percent < 80 else DiagnosticStatus.WARN
        cpu_status.message = f'CPU usage: {cpu_percent}%'
        cpu_status.hardware_id = 'cpu'
        diag_array.status.append(cpu_status)

        # Memory diagnostic
        mem_status = DiagnosticStatus()
        mem_status.name = 'Memory Monitor'
        memory = psutil.virtual_memory()
        mem_status.level = DiagnosticStatus.OK if memory.percent < 85 else DiagnosticStatus.WARN
        mem_status.message = f'Memory usage: {memory.percent}%'
        mem_status.hardware_id = 'memory'
        diag_array.status.append(mem_status)

        # Battery diagnostic
        battery = psutil.sensors_battery()
        if battery:
            battery_msg = BatteryState()
            battery_msg.header.stamp = self.get_clock().now().to_msg()
            battery_msg.header.frame_id = 'battery'
            battery_msg.percentage = battery.percent / 100.0
            battery_msg.voltage = 12.6  # Example voltage
            battery_msg.current = -1.0  # Discharging
            battery_msg.charge = battery.percent
            battery_msg.capacity = 100.0
            battery_msg.design_capacity = 100.0
            battery_msg.power_supply_status = BatteryState.POWER_SUPPLY_STATUS_DISCHARGING
            battery_msg.power_supply_health = BatteryState.POWER_SUPPLY_HEALTH_GOOD
            battery_msg.power_supply_technology = BatteryState.POWER_SUPPLY_TECHNOLOGY_LION
            self.battery_pub.publish(battery_msg)

        self.diag_pub.publish(diag_array)
```

## Deployment Procedures

### Pre-deployment Checklist

Before deploying to physical hardware:

1. **Simulation Validation**: All algorithms tested in simulation
2. **Safety Protocols**: Emergency stop systems verified
3. **Hardware Tests**: All sensors and actuators functional
4. **Communication**: ROS 2 network configured properly
5. **Power Management**: Battery levels and power consumption verified

### Deployment Script

```python
#!/usr/bin/env python3

import subprocess
import sys
import time
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class DeploymentManager(Node):
    def __init__(self):
        super().__init__('deployment_manager')

        self.status_pub = self.create_publisher(String, 'deployment_status', 10)
        self.deployment_steps = [
            self.check_hardware,
            self.start_safety_system,
            self.launch_robot_nodes,
            self.verify_communication,
            self.activate_robot
        ]

    def deploy(self):
        self.get_logger().info('Starting deployment sequence...')

        for i, step in enumerate(self.deployment_steps):
            status_msg = String()
            self.get_logger().info(f'Executing step {i+1}/{len(self.deployment_steps)}')

            try:
                success = step()
                if success:
                    status_msg.data = f'Step {i+1} completed successfully'
                    self.get_logger().info(status_msg.data)
                else:
                    status_msg.data = f'Step {i+1} failed'
                    self.get_logger().error(status_msg.data)
                    self.status_pub.publish(status_msg)
                    return False
            except Exception as e:
                status_msg.data = f'Step {i+1} error: {str(e)}'
                self.get_logger().error(status_msg.data)
                self.status_pub.publish(status_msg)
                return False

            self.status_pub.publish(status_msg)
            time.sleep(1)  # Brief pause between steps

        self.get_logger().info('Deployment completed successfully!')
        final_status = String()
        final_status.data = 'DEPLOYMENT_SUCCESS'
        self.status_pub.publish(final_status)
        return True

    def check_hardware(self):
        """Check if hardware is ready"""
        self.get_logger().info('Checking hardware status...')
        # Add hardware-specific checks here
        return True  # Simplified for example

    def start_safety_system(self):
        """Start safety monitoring"""
        self.get_logger().info('Starting safety systems...')
        # Launch safety nodes
        return True

    def launch_robot_nodes(self):
        """Launch main robot nodes"""
        self.get_logger().info('Launching robot nodes...')
        # Launch robot control nodes
        return True

    def verify_communication(self):
        """Verify ROS 2 communication"""
        self.get_logger().info('Verifying communication...')
        # Check ROS 2 network
        return True

    def activate_robot(self):
        """Activate robot for operation"""
        self.get_logger().info('Activating robot...')
        # Enable motors, start control loops
        return True

def main():
    rclpy.init()
    deployer = DeploymentManager()

    success = deployer.deploy()

    if success:
        rclpy.spin(deployer)
    else:
        deployer.get_logger().error('Deployment failed!')

    deployer.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Performance Monitoring

### Real-time Performance Tracking

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import time

class PerformanceMonitor(Node):
    def __init__(self):
        super().__init__('performance_monitor')

        self.loop_time_pub = self.create_publisher(Float32, 'control_loop_time', 10)
        self.cpu_usage_pub = self.create_publisher(Float32, 'cpu_usage', 10)
        self.memory_usage_pub = self.create_publisher(Float32, 'memory_usage', 10)

        self.timer = self.create_timer(0.1, self.monitor_callback)
        self.last_time = time.time()

    def monitor_callback(self):
        current_time = time.time()
        loop_time = current_time - self.last_time
        self.last_time = current_time

        # Publish loop time
        loop_time_msg = Float32()
        loop_time_msg.data = loop_time
        self.loop_time_pub.publish(loop_time_msg)

        # Publish CPU and memory usage
        import psutil
        cpu_msg = Float32()
        cpu_msg.data = psutil.cpu_percent()
        self.cpu_usage_pub.publish(cpu_msg)

        memory_msg = Float32()
        memory_msg.data = psutil.virtual_memory().percent
        self.memory_usage_pub.publish(memory_msg)
```

## Troubleshooting and Debugging

### Common Deployment Issues

1. **Permission Issues**: Ensure proper GPIO and device permissions
2. **Network Configuration**: Verify ROS 2 domain and network settings
3. **Power Management**: Monitor power consumption and battery levels
4. **Real-time Performance**: Optimize code for real-time constraints
5. **Hardware Compatibility**: Verify sensor and actuator compatibility

### Debugging Tools

```python
# Debugging node with comprehensive logging
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, QoSDurabilityPolicy

class DebugNode(Node):
    def __init__(self):
        super().__init__('debug_node')

        # High reliability QoS for debugging
        qos = QoSProfile(
            depth=1,
            durability=QoSDurabilityPolicy.TRANSIENT_LOCAL
        )

        self.debug_pub = self.create_publisher(String, 'debug_info', qos)

        # Enable detailed logging
        self.get_logger().set_level(rclpy.logging.LoggingSeverity.DEBUG)

    def log_detailed_info(self, component, status, details=None):
        debug_msg = String()
        debug_msg.data = f"[{component}] {status}"
        if details:
            debug_msg.data += f" - Details: {details}"

        self.debug_pub.publish(debug_msg)
        self.get_logger().debug(debug_msg.data)
```

## Summary

This section covered the critical aspects of physical robot deployment, including hardware platform setup, sensor integration, safety systems, deployment procedures, and performance monitoring. You learned how to transition from simulation to physical deployment while maintaining safety and reliability. The skills developed in this section are essential for the final stages of the Physical AI curriculum, where you'll deploy complete robotic systems on real hardware. Proper deployment practices ensure that your algorithms perform reliably in the real world while maintaining safety for both the robot and its environment.