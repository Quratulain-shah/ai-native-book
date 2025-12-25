---
title: "Physical Deployment: ROS 2 Packages on NVIDIA Jetson Orin Nano"
slug: "/module-1/physical-deployment"
sidebar_position: 7
---

# Physical Deployment: ROS 2 Packages on NVIDIA Jetson Orin Nano

## Introduction to Physical Deployment

Physical deployment represents the critical transition from simulation and development to real-world operation on physical hardware. This chapter focuses on deploying ROS 2 packages specifically to the NVIDIA Jetson Orin Nano platform, which is designed for edge AI and robotics applications. The Jetson Orin Nano combines powerful GPU capabilities with ARM processing, making it ideal for running complex robotics applications with AI components.

The deployment process involves several key considerations: hardware-specific optimizations, resource management, safety protocols, and the integration of real sensors and actuators with the ROS 2 framework. This chapter will guide you through the complete process of taking your simulation-tested ROS 2 packages and deploying them safely and effectively to physical hardware.

## Theory: Physical Deployment Architecture

### Hardware-Software Interface Considerations

Physical deployment requires careful consideration of the interface between software and hardware. Unlike simulation environments, real hardware has constraints and characteristics that must be accounted for:

#### Computational Constraints
- **Processing Power**: The Jetson Orin Nano has specific CPU and GPU capabilities that must be respected
- **Memory Limitations**: Limited RAM and storage compared to development workstations
- **Power Consumption**: Power budget considerations for mobile robotics platforms
- **Thermal Management**: Heat dissipation and thermal throttling effects on performance

#### Sensor and Actuator Integration
- **Real-time Requirements**: Hardware interfaces often have strict timing requirements
- **Noise and Uncertainty**: Real sensors have noise, delays, and potential failures
- **Calibration**: Hardware-specific calibration parameters
- **Safety Margins**: Physical safety considerations not present in simulation

### Deployment Architecture

The physical deployment architecture consists of several layers:

#### ROS 2 Framework Layer
- **Node Management**: Lifecycle nodes for robust resource management
- **Communication**: Optimized QoS profiles for hardware constraints
- **Parameter Management**: Runtime configuration for hardware-specific parameters
- **Logging and Diagnostics**: Hardware-aware monitoring and debugging

#### Hardware Interface Layer
- **Device Drivers**: Low-level drivers for sensors and actuators
- **Middleware**: Hardware abstraction layers (HAL)
- **Real-time Considerations**: Timing-critical operations
- **Safety Systems**: Hardware safety interlocks and emergency stops

#### Application Layer
- **Robot Behavior**: High-level autonomy and control
- **Perception Systems**: Real sensor data processing
- **Planning and Control**: Motion planning and execution
- **Human Interface**: User interaction and monitoring

### Safety and Reliability Architecture

Physical deployment must prioritize safety and reliability:

#### Safety Systems
- **Emergency Stops**: Hardware and software emergency stop mechanisms
- **Watchdog Timers**: Automatic safety interventions
- **Collision Avoidance**: Real-time obstacle detection and avoidance
- **Operational Boundaries**: Physical and logical safety limits

#### Reliability Measures
- **Fault Detection**: Hardware and software fault detection
- **Graceful Degradation**: System behavior during partial failures
- **Redundancy**: Critical system redundancy where appropriate
- **Health Monitoring**: Continuous system health assessment

## Simulation: Testing Deployment Procedures

Before physical deployment, it's essential to test deployment procedures in simulation:

### Cross-Compilation Environment Setup

```bash
# File: ~/ros2_ws/setup_cross_compilation.sh
#!/bin/bash

# Setup cross-compilation environment for Jetson Orin Nano
# This script sets up the environment for building ROS 2 packages
# for the ARM64 architecture used by Jetson

echo "Setting up cross-compilation environment for Jetson Orin Nano..."

# Install cross-compilation tools
sudo apt update
sudo apt install -y crossbuild-essential-arm64

# Install ARM64 versions of dependencies
sudo apt install -y libopencv-dev:arm64
sudo apt install -y python3-dev:arm64

# Set environment variables for cross-compilation
export CC=aarch64-linux-gnu-gcc
export CXX=aarch64-linux-gnu-g++
export ARCH=arm64
export CROSS_COMPILE=aarch64-linux-gnu-

echo "Cross-compilation environment ready"
echo "CC: $CC"
echo "CXX: $CXX"
echo "ARCH: $ARCH"
```

### Build Script for Jetson Platform

```bash
# File: ~/ros2_ws/build_jetson_packages.sh
#!/bin/bash

# Build ROS 2 packages for Jetson Orin Nano
# This script cross-compiles ROS 2 packages for the Jetson platform

set -e  # Exit on error

# Check if running on the right architecture
if [[ $(uname -m) != "aarch64" ]]; then
    echo "Warning: Not building on ARM64. Using cross-compilation."
fi

# Source ROS 2 environment
source /opt/ros/humble/setup.bash

# Set up build environment for Jetson
export ROS_DISTRO=humble
export TARGET_ARCH=aarch64
export TOOLCHAIN_FILE=/opt/ros/humble/share/ros_cross_compile/toolchains/aarch64.toolchain

# Navigate to workspace
cd ~/ros2_ws

# Clean previous builds
rm -rf build install log

# Build with specific options for Jetson
colcon build \
    --merge-install \
    --cmake-args \
        -DCMAKE_BUILD_TYPE=Release \
        -DBUILD_TESTING=OFF \
        -DCMAKE_C_FLAGS="-O3 -march=armv8-a+crc+crypto -mtune=cortex-a78" \
        -DCMAKE_CXX_FLAGS="-O3 -march=armv8-a+crc+crypto -mtune=cortex-a78" \
    --packages-select \
        my_robot_nodes \
        my_robot_interfaces \
        my_robot_description \
        my_robot_gazebo

echo "Build completed successfully for Jetson Orin Nano"
```

### Deployment Testing Script

```python
# File: ~/ros2_ws/test_deployment.py
#!/usr/bin/env python3

"""
Test script for deployment procedures
This script simulates the deployment process and tests key components
before actual physical deployment
"""

import subprocess
import sys
import os
import time
import json
from pathlib import Path


class DeploymentTester:
    def __init__(self):
        self.workspace_dir = Path.home() / "ros2_ws"
        self.install_dir = self.workspace_dir / "install"
        self.test_results = {}

    def test_build_process(self):
        """Test the build process for Jetson compatibility"""
        print("Testing build process...")

        try:
            # Check if workspace exists
            if not self.workspace_dir.exists():
                raise FileNotFoundError(f"Workspace does not exist: {self.workspace_dir}")

            # Check for required files
            required_files = [
                self.workspace_dir / "src",
                self.workspace_dir / "CMakeLists.txt"
            ]

            for file in required_files:
                if not file.exists():
                    raise FileNotFoundError(f"Required file missing: {file}")

            # Test if build tools are available
            result = subprocess.run(["which", "colcon"], capture_output=True, text=True)
            if result.returncode != 0:
                raise RuntimeError("colcon build tool not found")

            print("✓ Build process test passed")
            return True

        except Exception as e:
            print(f"✗ Build process test failed: {str(e)}")
            return False

    def test_dependencies(self):
        """Test that all dependencies are available"""
        print("Testing dependencies...")

        try:
            # Test ROS 2 installation
            result = subprocess.run(["ros2", "--version"], capture_output=True, text=True)
            if result.returncode != 0:
                raise RuntimeError("ROS 2 not properly installed")

            # Test Python packages
            import rclpy
            import cv2
            import numpy as np

            print("✓ Dependencies test passed")
            return True

        except ImportError as e:
            print(f"✗ Dependency test failed: {str(e)}")
            return False
        except Exception as e:
            print(f"✗ Dependency test failed: {str(e)}")
            return False

    def test_network_configuration(self):
        """Test network configuration for device communication"""
        print("Testing network configuration...")

        try:
            # Test basic network connectivity
            import socket
            hostname = socket.gethostname()
            ip_address = socket.gethostbyname(hostname)

            print(f"✓ Network configuration test passed: {hostname} ({ip_address})")
            return True

        except Exception as e:
            print(f"✗ Network configuration test failed: {str(e)}")
            return False

    def test_hardware_interface_simulation(self):
        """Test hardware interface (simulation)"""
        print("Testing hardware interface simulation...")

        try:
            # Simulate hardware interface checks
            # This would normally interface with actual hardware
            hardware_components = {
                'motors': True,
                'sensors': True,
                'communication': True,
                'power_management': True
            }

            all_present = all(hardware_components.values())

            if all_present:
                print("✓ Hardware interface simulation test passed")
                return True
            else:
                print(f"✗ Hardware interface simulation test failed: {hardware_components}")
                return False

        except Exception as e:
            print(f"✗ Hardware interface simulation test failed: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all deployment tests"""
        print("Starting deployment tests...\n")

        tests = [
            ("Build Process", self.test_build_process),
            ("Dependencies", self.test_dependencies),
            ("Network Configuration", self.test_network_configuration),
            ("Hardware Interface", self.test_hardware_interface_simulation)
        ]

        results = {}
        for test_name, test_func in tests:
            print(f"\n--- Running {test_name} Test ---")
            result = test_func()
            results[test_name] = result

        # Summary
        print(f"\n--- Test Summary ---")
        passed = sum(1 for result in results.values() if result)
        total = len(results)

        print(f"Tests passed: {passed}/{total}")

        if passed == total:
            print("🎉 All tests passed! Ready for physical deployment.")
            return True
        else:
            print("❌ Some tests failed. Please address issues before deployment.")
            return False


def main():
    """Main function for deployment testing"""
    tester = DeploymentTester()

    success = tester.run_all_tests()

    if success:
        print("\n✅ Deployment preparation complete!")
        print("You can now proceed with physical deployment.")
    else:
        print("\n❌ Deployment preparation incomplete!")
        print("Please address the failed tests before proceeding.")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

### Configuration Validation Script

```python
# File: ~/ros2_ws/validate_configuration.py
#!/usr/bin/env python3

"""
Configuration validation script
Validates that the ROS 2 configuration is appropriate for physical deployment
"""

import yaml
import json
import sys
from pathlib import Path
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy


class ConfigurationValidator(Node):
    def __init__(self):
        super().__init__('configuration_validator')

        self.validation_results = {
            'qos_settings': [],
            'resource_limits': [],
            'safety_checks': [],
            'performance_indicators': []
        }

    def validate_qos_profiles(self, package_path):
        """Validate QoS profiles for hardware deployment"""
        print("Validating QoS profiles...")

        # Look for launch files and configuration files
        launch_dir = package_path / "launch"
        config_dir = package_path / "config"

        qos_issues = []

        # Check launch files for appropriate QoS settings
        if launch_dir.exists():
            for launch_file in launch_dir.glob("*.py"):
                content = launch_file.read_text()

                # Check for inappropriate QoS settings for hardware
                if "RELIABLE" in content and "sensor" in str(launch_file).lower():
                    qos_issues.append(f"Sensor topic in {launch_file} uses RELIABLE QoS (should be BEST_EFFORT)")

                if "KEEP_ALL" in content:
                    qos_issues.append(f"Potential memory issue in {launch_file}: KEEP_ALL policy detected")

        self.validation_results['qos_settings'] = qos_issues
        return len(qos_issues) == 0

    def validate_resource_limits(self, package_path):
        """Validate resource usage limits"""
        print("Validating resource limits...")

        resource_issues = []

        # Check for potential memory issues
        for py_file in package_path.rglob("*.py"):
            content = py_file.read_text()

            # Check for potential memory leaks
            if "while True:" in content and "time.sleep" not in content:
                resource_issues.append(f"Potential infinite loop without sleep in {py_file}")

            # Check for large constant allocations
            if "np.zeros(" in content and "1000000" in content:
                resource_issues.append(f"Large array allocation in {py_file}")

        self.validation_results['resource_limits'] = resource_issues
        return len(resource_issues) == 0

    def validate_safety_checks(self, package_path):
        """Validate safety mechanisms"""
        print("Validating safety checks...")

        safety_issues = []

        # Check for emergency stop implementations
        emergency_found = False
        for py_file in package_path.rglob("*.py"):
            content = py_file.read_text()

            if "emergency" in content.lower() or "stop" in content.lower():
                emergency_found = True
                break

        if not emergency_found:
            safety_issues.append("No emergency stop mechanism detected in code")

        # Check for safety timers
        safety_timer_found = False
        for py_file in package_path.rglob("*.py"):
            content = py_file.read_text()

            if "timer" in content.lower() and "safety" in content.lower():
                safety_timer_found = True
                break

        if not safety_timer_found:
            safety_issues.append("No safety timer mechanism detected in code")

        self.validation_results['safety_checks'] = safety_issues
        return len(safety_issues) == 0

    def validate_performance_indicators(self, package_path):
        """Validate performance considerations"""
        print("Validating performance indicators...")

        perf_issues = []

        # Check for blocking operations
        for py_file in package_path.rglob("*.py"):
            content = py_file.read_text()

            # Check for synchronous service calls in main loop
            if "call_async" not in content and "client.call" in content:
                perf_issues.append(f"Synchronous service call in {py_file} may block main thread")

        self.validation_results['performance_indicators'] = perf_issues
        return len(perf_issues) == 0

    def run_validation(self, package_path_str):
        """Run complete configuration validation"""
        package_path = Path(package_path_str)

        print(f"Validating configuration for: {package_path}")

        results = {
            'qos_valid': self.validate_qos_profiles(package_path),
            'resources_valid': self.validate_resource_limits(package_path),
            'safety_valid': self.validate_safety_checks(package_path),
            'performance_valid': self.validate_performance_indicators(package_path)
        }

        # Summary
        all_valid = all(results.values())

        print(f"\n--- Validation Results ---")
        for check, is_valid in results.items():
            status = "✓ PASS" if is_valid else "✗ FAIL"
            print(f"{check.replace('_', ' ').title()}: {status}")

        # Print detailed issues if any
        for category, issues in self.validation_results.items():
            if issues:
                print(f"\n{category.upper()} ISSUES:")
                for issue in issues:
                    print(f"  - {issue}")

        return all_valid


def main(args=None):
    """Main function for configuration validation"""
    if len(sys.argv) < 2:
        print("Usage: python3 validate_configuration.py <package_path>")
        sys.exit(1)

    package_path = sys.argv[1]

    rclpy.init(args=args)
    validator = ConfigurationValidator()

    success = validator.run_validation(package_path)

    validator.destroy_node()
    rclpy.shutdown()

    if success:
        print("\n✅ Configuration validation passed!")
        print("Configuration is appropriate for physical deployment.")
        sys.exit(0)
    else:
        print("\n❌ Configuration validation failed!")
        print("Please address the issues before physical deployment.")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

## Real: Physical Deployment Procedures

### Hardware Setup and Configuration

#### Jetson Orin Nano Initial Setup

```bash
# File: ~/deployment_scripts/jetson_setup.sh
#!/bin/bash

# Complete setup script for NVIDIA Jetson Orin Nano
# This script prepares the Jetson for ROS 2 deployment

set -e  # Exit on error

echo "=== Starting Jetson Orin Nano Setup ==="

# Update system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install ROS 2 Humble Hawksbill
echo "Installing ROS 2 Humble..."
sudo apt install -y software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt upgrade -y

# Install ROS 2 base packages
sudo apt install -y ros-humble-ros-base
sudo apt install -y python3-rosdep python3-rosinstall python3-vcstool

# Initialize rosdep
sudo rosdep init || echo "rosdep already initialized"
rosdep update

# Install additional dependencies for robotics
sudo apt install -y \
    python3-colcon-common-extensions \
    python3-argcomplete \
    python3-pip \
    build-essential \
    cmake \
    git \
    libbullet-dev \
    libc++-dev \
    libconsole-bridge-dev \
    libeigen3-dev \
    python3-dev \
    python3-numpy \
    libtinyxml2-dev \
    libpoco-dev \
    libcurl4-openssl-dev \
    libopencv-dev \
    python3-opencv

# Install Python packages
pip3 install -U \
    argcomplete \
    cv-bridge \
    imutils \
    numpy \
    opencv-python \
    transforms3d \
    psutil \
    GPUtil

# Configure environment
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
echo "export ROS_DOMAIN_ID=0" >> ~/.bashrc  # Default domain
echo "export RMW_IMPLEMENTATION=rmw_cyclonedx_cpp" >> ~/.bashrc  # Lightweight middleware

# Performance optimization for Jetson
echo "Configuring performance settings..."
sudo nvpmodel -m 0  # Set to MAX performance mode
sudo jetson_clocks  # Lock clocks to maximum frequency

# Enable swap for memory management
echo "Configuring swap space..."
sudo fallocate -l 8G /var/swap
sudo chmod 600 /var/swap
sudo mkswap /var/swap
sudo swapon /var/swap

# Add swap to fstab
echo "/var/swap swap swap defaults 0 0" | sudo tee -a /etc/fstab

echo "=== Jetson Orin Nano Setup Complete ==="
echo "Please reboot the system for all changes to take effect:"
echo "sudo reboot"
```

#### Workspace Setup on Jetson

```bash
# File: ~/deployment_scripts/setup_workspace.sh
#!/bin/bash

# Setup ROS 2 workspace on Jetson Orin Nano

set -e

echo "Setting up ROS 2 workspace on Jetson..."

# Create workspace
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws

# Source ROS 2
source /opt/ros/humble/setup.bash

# Create directory structure
mkdir -p ~/ros2_ws/src/my_robot_project

# Copy packages from development environment (this would be done via scp or git)
# For demonstration, we'll create a basic structure
cat > ~/ros2_ws/src/CMakeLists.txt << EOF
cmake_minimum_required(VERSION 3.8)
project(my_robot_project NONE)
find_package(ament_cmake REQUIRED)
ament_package()
EOF

echo "Workspace structure created."

# Build the workspace
echo "Building workspace..."
colcon build --merge-install

# Source the workspace
echo "source ~/ros2_ws/install/setup.bash" >> ~/.bashrc

echo "Workspace setup complete."
```

### Optimized Node Implementation for Jetson

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/jetson_optimized_node.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from sensor_msgs.msg import Image, LaserScan, Imu, BatteryState
from geometry_msgs.msg import Twist
from std_msgs.msg import String, Float32
from cv_bridge import CvBridge
import numpy as np
import cv2
import time
import threading
from collections import deque
import psutil
import GPUtil
import queue
from typing import Optional, Dict, Any
import gc
import subprocess


class JetsonOptimizedNode(Node):
    """
    Optimized ROS 2 node specifically for Jetson Orin Nano deployment
    """
    def __init__(self):
        super().__init__('jetson_optimized_node')

        # Initialize CV bridge
        self.bridge = CvBridge()

        # Performance optimization parameters
        self.max_cpu_percent = 80.0
        self.max_memory_percent = 80.0
        self.max_gpu_percent = 85.0

        # Use optimized QoS profiles
        sensor_qos = QoSProfile(
            depth=1,  # Minimal buffering to save memory
            reliability=ReliabilityPolicy.BEST_EFFORT,
            durability=DurabilityPolicy.VOLATILE
        )

        control_qos = QoSProfile(
            depth=5,  # Slightly more buffering for control commands
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.VOLATILE
        )

        # Publishers
        self.status_pub = self.create_publisher(String, 'jetson/status', 10)
        self.health_pub = self.create_publisher(String, 'system_health', 10)
        self.optimized_image_pub = self.create_publisher(Image, 'optimized_image', sensor_qos)

        # Image processing queue with size limit
        self.image_queue = queue.Queue(maxsize=3)  # Very small queue for memory efficiency
        self.processing_thread = threading.Thread(target=self.process_images, daemon=True)
        self.processing_thread.start()

        # System monitoring
        self.monitor_timer = self.create_timer(2.0, self.system_monitor)
        self.last_monitor_time = time.time()

        # Performance metrics
        self.metrics_history = deque(maxlen=50)
        self.frame_count = 0
        self.last_fps_time = time.time()

        # Resource thresholds
        self.cpu_threshold = 85.0
        self.memory_threshold = 85.0
        self.temperature_threshold = 80.0  # Celsius

        # Throttling mechanisms
        self.processing_enabled = True
        self.processing_throttle = 1.0  # Full speed initially
        self.throttle_adjustment_interval = 1.0  # Adjust every second

        # Safety mechanisms
        self.emergency_stop_active = False
        self.overheat_protection = True

        # Initialize system
        self.initialize_jetson_system()

        self.get_logger().info('Jetson Optimized Node initialized')

    def initialize_jetson_system(self):
        """Initialize Jetson-specific system configurations"""
        try:
            # Set Jetson to performance mode
            subprocess.run(['sudo', 'nvpmodel', '-m', '0'], check=True)
            self.get_logger().info('Jetson set to MAX performance mode')

            # Get initial system stats
            self.get_initial_system_stats()

        except subprocess.CalledProcessError as e:
            self.get_logger().warn(f'Could not set Jetson performance mode: {e}')
        except Exception as e:
            self.get_logger().warn(f'Error initializing Jetson system: {e}')

    def get_initial_system_stats(self):
        """Get initial system statistics"""
        try:
            # CPU info
            cpu_count = psutil.cpu_count()
            cpu_freq = psutil.cpu_freq()

            # Memory info
            memory = psutil.virtual_memory()

            # GPU info (if available)
            gpus = GPUtil.getGPUs()
            gpu_info = [(gpu.id, gpu.name, gpu.memoryTotal) for gpu in gpus] if gpus else []

            self.get_logger().info(
                f'System Info - CPUs: {cpu_count}, '
                f'Memory: {memory.total / (1024**3):.1f} GB, '
                f'GPUs: {len(gpu_info)}'
            )

        except Exception as e:
            self.get_logger().warn(f'Could not get system stats: {e}')

    def process_images(self):
        """Process images in separate thread to optimize CPU usage"""
        while rclpy.ok() and not self.emergency_stop_active:
            try:
                # Get image from queue with timeout to avoid blocking
                try:
                    msg = self.image_queue.get(timeout=0.01)  # 10ms timeout

                    # Check if processing should be throttled
                    current_time = time.time()
                    if (current_time - self.last_processing_time) >= (1.0 / self.processing_throttle):

                        # Process the image efficiently
                        processed_image = self.optimize_image_processing(msg)

                        # Publish result
                        if processed_image is not None:
                            result_msg = self.bridge.cv2_to_imgmsg(processed_image, encoding='bgr8')
                            result_msg.header = msg.header  # Preserve header info
                            self.optimized_image_pub.publish(result_msg)

                            self.frame_count += 1

                        self.last_processing_time = current_time

                except queue.Empty:
                    # No image to process, briefly sleep to avoid busy waiting
                    time.sleep(0.005)  # 5ms
                    continue

            except Exception as e:
                self.get_logger().error(f'Error in image processing thread: {e}')
                time.sleep(0.01)  # Brief sleep to avoid rapid error loops

    def optimize_image_processing(self, img_msg):
        """Optimized image processing function for Jetson"""
        try:
            # Convert ROS image to OpenCV with error handling
            cv_image = self.bridge.imgmsg_to_cv2(img_msg, desired_encoding='bgr8')

            # Resize image to reduce processing load (if needed)
            height, width = cv_image.shape[:2]
            if height > 480 or width > 640:  # Reduce resolution for performance
                scale_factor = min(480/height, 640/width)
                new_width = int(width * scale_factor)
                new_height = int(height * scale_factor)
                cv_image = cv2.resize(cv_image, (new_width, new_height))

            # Convert to grayscale to reduce computation
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

            # Apply Gaussian blur to reduce noise efficiently
            blurred = cv2.GaussianBlur(gray, (3, 3), 0)

            # Edge detection (if needed for your application)
            edges = cv2.Canny(blurred, 50, 150)

            # Convert back to 3-channel for publishing
            result = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

            return result

        except Exception as e:
            self.get_logger().error(f'Error in optimized image processing: {e}')
            return None

    def system_monitor(self):
        """Monitor system resources and adjust performance"""
        current_time = time.time()
        time_diff = current_time - self.last_monitor_time

        if time_diff <= 0:
            return

        # Get system metrics
        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent
        disk_usage = psutil.disk_usage('/').percent

        # Get GPU usage if available
        gpus = GPUtil.getGPUs()
        gpu_percent = gpus[0].load * 100 if gpus else 0
        gpu_temp = gpus[0].temperature if gpus else 0

        # Calculate FPS
        fps = self.frame_count / time_diff if time_diff > 0 else 0
        self.frame_count = 0
        self.last_fps_time = current_time

        # Log metrics
        metrics_str = (
            f'CPU: {cpu_percent:.1f}%, MEM: {memory_percent:.1f}%, '
            f'GPU: {gpu_percent:.1f}%, DISK: {disk_usage:.1f}%, '
            f'FPS: {fps:.1f}'
        )
        self.get_logger().info(metrics_str)

        # Publish health status
        health_msg = String()
        health_msg.data = f"CPU:{cpu_percent:.1f},MEM:{memory_percent:.1f},GPU:{gpu_percent:.1f},FPS:{fps:.1f}"
        self.health_pub.publish(health_msg)

        # Store metrics for history
        self.metrics_history.append({
            'timestamp': current_time,
            'cpu': cpu_percent,
            'memory': memory_percent,
            'gpu': gpu_percent,
            'disk': disk_usage,
            'fps': fps
        })

        # Adjust processing based on resource usage
        self.adjust_processing_based_on_resources(cpu_percent, memory_percent, gpu_percent)

        # Check for safety conditions
        self.check_safety_conditions(cpu_percent, memory_percent, gpu_temp)

        self.last_monitor_time = current_time

    def adjust_processing_based_on_resources(self, cpu_percent, memory_percent, gpu_percent):
        """Adjust processing based on resource usage"""
        # Adjust processing throttle based on resource usage
        if cpu_percent > self.cpu_threshold or memory_percent > self.memory_threshold or gpu_percent > self.max_gpu_percent:
            # Reduce processing load
            if self.processing_throttle > 0.1:  # Don't go below 10% of normal
                old_throttle = self.processing_throttle
                self.processing_throttle = max(0.1, self.processing_throttle * 0.9)  # Reduce by 10%
                self.get_logger().warn(
                    f'High resource usage detected. Throttling from {old_throttle:.2f} to {self.processing_throttle:.2f}'
                )
        else:
            # Gradually increase processing if resources allow (but conservatively)
            if self.processing_throttle < 1.0:  # Don't exceed 100%
                old_throttle = self.processing_throttle
                self.processing_throttle = min(1.0, self.processing_throttle * 1.02)  # Increase by 2%
                if abs(self.processing_throttle - 1.0) < 0.01:  # Close to 1.0
                    self.processing_throttle = 1.0
                if self.processing_throttle != old_throttle:
                    self.get_logger().info(
                        f'Resources available. Increasing throttle from {old_throttle:.2f} to {self.processing_throttle:.2f}'
                    )

    def check_safety_conditions(self, cpu_percent, memory_percent, gpu_temp):
        """Check safety conditions and take appropriate action"""
        safety_violations = []

        if cpu_percent > 95.0:
            safety_violations.append(f'Critical CPU usage: {cpu_percent:.1f}%')

        if memory_percent > 95.0:
            safety_violations.append(f'Critical memory usage: {memory_percent:.1f}%')

        if gpu_temp > self.temperature_threshold and self.overheat_protection:
            safety_violations.append(f'GPU temperature critical: {gpu_temp}°C')

        if safety_violations:
            # Log safety violations
            for violation in safety_violations:
                self.get_logger().fatal(f'SAFETY VIOLATION: {violation}')

            # Trigger safety response
            self.trigger_safety_response(safety_violations)

    def trigger_safety_response(self, violations):
        """Trigger safety response based on violations"""
        self.get_logger().warn('Initiating safety response...')

        # Set emergency stop flag
        self.emergency_stop_active = True

        # Reduce processing immediately
        self.processing_throttle = 0.1  # Minimal processing

        # Send stop command if we have mobility
        try:
            stop_cmd = Twist()
            # This would publish to cmd_vel to stop the robot
            # self.cmd_vel_pub.publish(stop_cmd)
            self.get_logger().warn('Stop command issued')
        except Exception as e:
            self.get_logger().error(f'Could not issue stop command: {e}')

        # Log the incident
        incident_report = {
            'timestamp': time.time(),
            'violations': violations,
            'cpu': psutil.cpu_percent(),
            'memory': psutil.virtual_memory().percent,
            'action_taken': 'EMERGENCY_STOP'
        }

        self.get_logger().info(f'Safety incident logged: {incident_report}')

        # After a delay, if conditions improve, resume normal operation
        # This would be handled by a separate monitoring process

    def image_callback(self, msg):
        """Optimized image callback that adds to queue"""
        try:
            # Add to queue without blocking
            if not self.image_queue.full():
                self.image_queue.put_nowait(msg)
            else:
                # Queue is full, drop the message to prevent blocking
                # self.get_logger().debug('Image queue full, dropping message')
                pass
        except queue.Full:
            # Queue is full, message dropped
            pass

    def destroy_node(self):
        """Clean up resources before destroying node"""
        self.get_logger().info('Shutting down Jetson Optimized Node...')

        # Stop processing thread
        self.emergency_stop_active = True

        # Clear queues
        while not self.image_queue.empty():
            try:
                self.image_queue.get_nowait()
            except queue.Empty:
                break

        # Force garbage collection
        collected = gc.collect()
        self.get_logger().debug(f'Collected {collected} objects during shutdown')

        super().destroy_node()


def main(args=None):
    """Main function for Jetson optimized node"""
    rclpy.init(args=args)

    # Use multi-threaded executor to handle the image processing thread better
    executor = rclpy.executors.MultiThreadedExecutor(num_threads=2)

    node = JetsonOptimizedNode()
    executor.add_node(node)

    try:
        executor.spin()
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        executor.shutdown()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Hardware Interface Node

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/hardware_interface_node.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from sensor_msgs.msg import JointState, Imu, BatteryState
from geometry_msgs.msg import Twist
from std_msgs.msg import Bool, Float32
from my_robot_interfaces.msg import HardwareStatus  # Custom message
import time
import threading
from collections import deque
import board
import busio
import adafruit_gpio
from enum import Enum


class HardwareState(Enum):
    INITIALIZING = 1
    CONNECTED = 2
    ERROR = 3
    SAFETY_LOCKOUT = 4


class HardwareInterfaceNode(Node):
    """
    Node for interfacing with real hardware on Jetson Orin Nano
    """
    def __init__(self):
        super().__init__('hardware_interface_node')

        # Initialize hardware state
        self.hardware_state = HardwareState.INITIALIZING
        self.hardware_connected = False
        self.safety_lockout = False

        # Publishers
        self.joint_state_pub = self.create_publisher(JointState, 'joint_states', 10)
        self.imu_pub = self.create_publisher(Imu, 'imu/data', 10)
        self.battery_pub = self.create_publisher(BatteryState, 'battery_state', 10)
        self.hardware_status_pub = self.create_publisher(HardwareStatus, 'hardware_status', 10)

        # Subscribers
        self.cmd_vel_sub = self.create_subscription(
            Twist, 'cmd_vel', self.cmd_vel_callback, 10)

        # Timers
        self.hardware_poll_timer = self.create_timer(0.05, self.poll_hardware)  # 20Hz
        self.status_publish_timer = self.create_timer(1.0, self.publish_hardware_status)

        # Hardware interface components
        self.motor_controllers = {}
        self.sensor_readers = {}
        self.communication_interfaces = {}

        # Threading for hardware operations
        self.hardware_thread = threading.Thread(target=self.hardware_io_loop, daemon=True)
        self.hardware_thread.start()

        # Safety parameters
        self.emergency_stop_pin = None  # GPIO pin for emergency stop
        self.safety_timeout = 1.0  # seconds without commands
        self.last_cmd_time = time.time()

        # Initialize hardware
        self.initialize_hardware()

        self.get_logger().info('Hardware Interface Node initialized')

    def initialize_hardware(self):
        """Initialize hardware interfaces"""
        try:
            # Initialize I2C bus for sensors
            i2c = busio.I2C(board.SCL, board.SDA)

            # Initialize SPI bus for motor controllers
            # spi = busio.SPI(board.SCLK, MOSI=board.MOSI, MISO=board.MISO)

            # Initialize GPIO for safety systems
            # self.emergency_stop_pin = digitalio.DigitalInOut(board.D4)
            # self.emergency_stop_pin.direction = digitalio.Direction.INPUT

            # Initialize motor controllers
            self.initialize_motor_controllers()

            # Initialize sensors
            self.initialize_sensors()

            # Initialize communication interfaces
            self.initialize_communication_interfaces()

            self.hardware_state = HardwareState.CONNECTED
            self.hardware_connected = True

            self.get_logger().info('Hardware initialization completed successfully')

        except Exception as e:
            self.get_logger().error(f'Hardware initialization failed: {str(e)}')
            self.hardware_state = HardwareState.ERROR
            self.hardware_connected = False

    def initialize_motor_controllers(self):
        """Initialize motor controller interfaces"""
        # This is a placeholder - real implementation would interface with actual motor controllers
        # For example, using I2C, SPI, or serial communication
        try:
            # Example: Initialize motor controller at I2C address
            # self.motor_controllers['left_wheel'] = MotorControllerI2C(address=0x60)
            # self.motor_controllers['right_wheel'] = MotorControllerI2C(address=0x61)

            # For simulation, we'll just log the initialization
            self.get_logger().info('Motor controllers initialized')

        except Exception as e:
            self.get_logger().error(f'Motor controller initialization failed: {str(e)}')

    def initialize_sensors(self):
        """Initialize sensor interfaces"""
        try:
            # Example: Initialize IMU sensor
            # self.sensor_readers['imu'] = IMUSensor(i2c_bus=i2c)

            # Example: Initialize battery monitor
            # self.sensor_readers['battery'] = BatteryMonitor(i2c_bus=i2c)

            # For simulation, we'll just log the initialization
            self.get_logger().info('Sensors initialized')

        except Exception as e:
            self.get_logger().error(f'Sensor initialization failed: {str(e)}')

    def initialize_communication_interfaces(self):
        """Initialize communication interfaces"""
        try:
            # Example: Initialize CAN bus interface
            # self.communication_interfaces['can'] = CANInterface(channel='can0')

            # Example: Initialize serial communication for motor controllers
            # self.communication_interfaces['serial'] = SerialInterface(port='/dev/ttyUSB0')

            self.get_logger().info('Communication interfaces initialized')

        except Exception as e:
            self.get_logger().error(f'Communication interface initialization failed: {str(e)}')

    def cmd_vel_callback(self, msg):
        """Handle velocity commands and send to hardware"""
        if not self.hardware_connected:
            self.get_logger().warn('Hardware not connected, ignoring command')
            return

        if self.safety_lockout:
            self.get_logger().warn('Safety lockout active, ignoring command')
            return

        # Update last command time for safety monitoring
        self.last_cmd_time = time.time()

        try:
            # Convert Twist message to hardware commands
            linear_vel = msg.linear.x
            angular_vel = msg.angular.z

            # Apply safety limits
            linear_vel = max(-1.0, min(1.0, linear_vel))  # Limit to ±1 m/s
            angular_vel = max(-1.0, min(1.0, angular_vel))  # Limit to ±1 rad/s

            # Send commands to motor controllers
            self.send_velocity_commands(linear_vel, angular_vel)

            self.get_logger().info(f'Command sent: linear={linear_vel:.2f}, angular={angular_vel:.2f}')

        except Exception as e:
            self.get_logger().error(f'Error sending velocity command: {str(e)}')
            self.trigger_safety_lockout()

    def send_velocity_commands(self, linear_vel, angular_vel):
        """Send velocity commands to hardware"""
        try:
            # This is where you would interface with actual motor controllers
            # Example implementation for differential drive:
            # wheel_separation = 0.5  # meters
            # left_vel = linear_vel - angular_vel * wheel_separation / 2.0
            # right_vel = linear_vel + angular_vel * wheel_separation / 2.0

            # Send to motor controllers
            # self.motor_controllers['left_wheel'].set_velocity(left_vel)
            # self.motor_controllers['right_wheel'].set_velocity(right_vel)

            # For simulation, just log the commands
            self.get_logger().debug(f'Simulated command: left={linear_vel-angular_vel*0.25}, right={linear_vel+angular_vel*0.25}')

        except Exception as e:
            self.get_logger().error(f'Error sending velocity commands: {str(e)}')
            raise

    def poll_hardware(self):
        """Poll hardware for current state"""
        if not self.hardware_connected:
            return

        try:
            # Read joint states from encoders
            joint_state = self.read_joint_states()
            if joint_state:
                self.joint_state_pub.publish(joint_state)

            # Read IMU data
            imu_data = self.read_imu_data()
            if imu_data:
                self.imu_pub.publish(imu_data)

            # Read battery status
            battery_status = self.read_battery_status()
            if battery_status:
                self.battery_pub.publish(battery_status)

            # Check safety systems
            self.check_safety_systems()

        except Exception as e:
            self.get_logger().error(f'Error polling hardware: {str(e)}')
            self.trigger_safety_lockout()

    def read_joint_states(self):
        """Read joint state from hardware encoders"""
        try:
            # This is where you would read from actual encoders
            # For simulation, we'll create dummy data
            joint_state = JointState()
            joint_state.header.stamp = self.get_clock().now().to_msg()
            joint_state.name = ['left_wheel_joint', 'right_wheel_joint']
            joint_state.position = [0.0, 0.0]  # Actual encoder positions
            joint_state.velocity = [0.0, 0.0]  # Actual encoder velocities
            joint_state.effort = [0.0, 0.0]   # Actual motor efforts

            return joint_state

        except Exception as e:
            self.get_logger().error(f'Error reading joint states: {str(e)}')
            return None

    def read_imu_data(self):
        """Read IMU data from hardware"""
        try:
            # This is where you would read from actual IMU
            # For simulation, we'll create dummy data
            imu_msg = Imu()
            imu_msg.header.stamp = self.get_clock().now().to_msg()
            imu_msg.header.frame_id = 'imu_link'

            # Dummy orientation (no rotation)
            imu_msg.orientation.x = 0.0
            imu_msg.orientation.y = 0.0
            imu_msg.orientation.z = 0.0
            imu_msg.orientation.w = 1.0

            # Dummy angular velocity
            imu_msg.angular_velocity.x = 0.0
            imu_msg.angular_velocity.y = 0.0
            imu_msg.angular_velocity.z = 0.0

            # Dummy linear acceleration (gravity in Z direction)
            imu_msg.linear_acceleration.x = 0.0
            imu_msg.linear_acceleration.y = 0.0
            imu_msg.linear_acceleration.z = 9.81

            return imu_msg

        except Exception as e:
            self.get_logger().error(f'Error reading IMU data: {str(e)}')
            return None

    def read_battery_status(self):
        """Read battery status from hardware"""
        try:
            # This is where you would read from actual battery monitor
            # For simulation, we'll create dummy data
            battery_msg = BatteryState()
            battery_msg.header.stamp = self.get_clock().now().to_msg()
            battery_msg.header.frame_id = 'battery_link'

            battery_msg.voltage = 12.6  # Volts
            battery_msg.current = -1.5  # Amperes (negative = discharging)
            battery_msg.charge = 5.0    # Amp-hours
            battery_msg.capacity = 5.0  # Amp-hours
            battery_msg.design_capacity = 5.0  # Amp-hours
            battery_msg.percentage = 0.8  # 80% charge
            battery_msg.power_supply_status = BatteryState.POWER_SUPPLY_STATUS_DISCHARGING
            battery_msg.power_supply_health = BatteryState.POWER_SUPPLY_HEALTH_GOOD
            battery_msg.power_supply_technology = BatteryState.POWER_SUPPLY_TECHNOLOGY_LION

            return battery_msg

        except Exception as e:
            self.get_logger().error(f'Error reading battery status: {str(e)}')
            return None

    def check_safety_systems(self):
        """Check safety systems"""
        try:
            # Check for emergency stop
            # if self.emergency_stop_pin and not self.emergency_stop_pin.value:
            #     self.get_logger().error('EMERGENCY STOP PRESSED - SHUTTING DOWN')
            #     self.trigger_emergency_stop()
            #     return

            # Check for command timeout
            time_since_last_cmd = time.time() - self.last_cmd_time
            if time_since_last_cmd > self.safety_timeout:
                self.get_logger().warn('No commands received, triggering safety stop')
                self.trigger_safety_lockout()

        except Exception as e:
            self.get_logger().error(f'Error checking safety systems: {str(e)}')

    def trigger_safety_lockout(self):
        """Trigger safety lockout - stop all motion"""
        if not self.safety_lockout:
            self.safety_lockout = True
            self.get_logger().error('SAFETY LOCKOUT TRIGGERED - ALL MOTION STOPPED')

            # Send stop command
            stop_cmd = Twist()
            # self.cmd_vel_pub.publish(stop_cmd)  # Publish to our own system
            # Actually send to hardware
            try:
                self.send_velocity_commands(0.0, 0.0)
            except Exception as e:
                self.get_logger().error(f'Could not send stop command: {str(e)}')

    def trigger_emergency_stop(self):
        """Trigger emergency stop - cut power to motors"""
        self.trigger_safety_lockout()
        # In a real system, this would cut power to motors via hardware
        # For example, engage a safety relay or disable motor controller power

    def publish_hardware_status(self):
        """Publish hardware status information"""
        status_msg = HardwareStatus()
        status_msg.header.stamp = self.get_clock().now().to_msg()

        status_msg.connected = self.hardware_connected
        status_msg.safety_lockout = self.safety_lockout
        status_msg.state = self.hardware_state.name

        # Add any error messages
        # status_msg.error_messages = self.get_recent_errors()

        self.hardware_status_pub.publish(status_msg)

    def hardware_io_loop(self):
        """Background thread for hardware I/O operations"""
        while rclpy.ok():
            try:
                # Perform any background hardware operations
                # This could include:
                # - Continuous sensor reading
                # - Motor controller heartbeat
                # - Communication monitoring
                # - Calibration updates

                time.sleep(0.01)  # 10ms interval

            except Exception as e:
                self.get_logger().error(f'Error in hardware I/O loop: {str(e)}')
                time.sleep(0.1)  # Longer sleep on error

    def destroy_node(self):
        """Clean up hardware connections"""
        self.get_logger().info('Shutting down hardware interface...')

        # Stop all motors
        try:
            self.send_velocity_commands(0.0, 0.0)
        except:
            pass

        # Close hardware interfaces
        # for controller in self.motor_controllers.values():
        #     controller.close()
        #
        # for sensor in self.sensor_readers.values():
        #     sensor.close()

        super().destroy_node()


def main(args=None):
    """Main function for hardware interface node"""
    rclpy.init(args=args)
    node = HardwareInterfaceNode()

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

### Deployment Scripts

```bash
# File: ~/deployment_scripts/deploy_to_jetson.sh
#!/bin/bash

# Deployment script for transferring ROS 2 packages to Jetson Orin Nano

set -e  # Exit on error

JETSON_HOST=${1:-"jetson@192.168.1.100"}  # Default Jetson IP
WORKSPACE_SRC=${2:-"~/ros2_ws"}  # Source workspace
WORKSPACE_DST=${3:-"~/ros2_ws"}  # Destination workspace on Jetson

echo "=== Starting ROS 2 Package Deployment ==="
echo "Source: $WORKSPACE_SRC"
echo "Destination: $JETSON_HOST:$WORKSPACE_DST"

# Check if source workspace exists
if [ ! -d "$WORKSPACE_SRC" ]; then
    echo "Error: Source workspace does not exist: $WORKSPACE_SRC"
    exit 1
fi

# Create archive of source code (excluding build and install directories)
echo "Creating archive of source code..."
cd $WORKSPACE_SRC
tar --exclude='build' --exclude='install' --exclude='log' -czf /tmp/ros2_ws_src.tar.gz src/

# Transfer to Jetson
echo "Transferring to Jetson..."
scp /tmp/ros2_ws_src.tar.gz $JETSON_HOST:/tmp/

# Clean up temp file
rm /tmp/ros2_ws_src.tar.gz

# SSH to Jetson and deploy
ssh $JETSON_HOST << EOF
set -e

echo "Setting up workspace on Jetson..."

# Create workspace directory if it doesn't exist
mkdir -p $WORKSPACE_DST/src

# Navigate to workspace
cd $WORKSPACE_DST

# Extract source code
tar -xzf /tmp/ros2_ws_src.tar.gz -C . --strip-components=1

# Source ROS 2
source /opt/ros/humble/setup.bash

# Build the workspace
echo "Building workspace..."
colcon build --merge-install --packages-select \$(find src -maxdepth 1 -mindepth 1 -type d -exec basename {} \; | tr '\n' ' ')

# Source the workspace
source install/setup.bash

echo "Deployment completed successfully!"
EOF

echo "=== Deployment Complete ==="
echo "Remember to source the workspace on Jetson:"
echo "source $WORKSPACE_DST/install/setup.bash"
```

```bash
# File: ~/deployment_scripts/run_robot.sh
#!/bin/bash

# Script to run the robot system on Jetson Orin Nano

set -e

# Source ROS 2 and workspace
source /opt/ros/humble/setup.bash
source ~/ros2_ws/install/setup.bash

# Set ROS domain ID (adjust as needed for your network)
export ROS_DOMAIN_ID=0

# Create log directory
LOG_DIR=~/robot_logs/\$(date +%Y%m%d_%H%M%S)
mkdir -p \$LOG_DIR

echo "Starting robot system..."
echo "Log directory: \$LOG_DIR"

# Launch the robot system
# This would typically launch your main robot bringup launch file
ros2 launch my_robot_bringup robot.launch.py \
    --log-level info \
    2>&1 | tee \$LOG_DIR/robot_system.log &

# Save the process ID
echo \$! > \$LOG_DIR/robot_pid.txt

echo "Robot system started with PID saved to: \$LOG_DIR/robot_pid.txt"

# Optional: Start system monitoring
ros2 run my_robot_nodes system_monitor.py \
    --log-level info \
    2>&1 | tee \$LOG_DIR/system_monitor.log &

echo "System monitoring started"
echo "To stop the robot system: kill \$(cat \$LOG_DIR/robot_pid.txt)"
```

### Safety and Monitoring

```python
# File: ~/ros2_ws/src/my_robot_nodes/my_robot_nodes/safety_monitor.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from std_msgs.msg import Bool, String, Float32
from geometry_msgs.msg import Twist
from sensor_msgs.msg import JointState, Imu, BatteryState
from my_robot_interfaces.msg import HardwareStatus
import time
from enum import Enum


class SafetyLevel(Enum):
    SAFE = 1
    WARNING = 2
    DANGER = 3
    EMERGENCY = 4


class SafetyMonitor(Node):
    """
    Monitors robot safety parameters and triggers appropriate responses
    """
    def __init__(self):
        super().__init__('safety_monitor')

        # Safety parameters
        self.safety_thresholds = {
            'battery_low': 0.2,  # 20% battery
            'temperature_high': 80.0,  # Celsius
            'current_high': 10.0,  # Amperes
            'velocity_limit': 1.0,  # m/s
            'angular_velocity_limit': 1.0,  # rad/s
            'collision_distance': 0.5,  # meters
            'command_timeout': 1.0,  # seconds
        }

        # Current safety state
        self.safety_level = SafetyLevel.SAFE
        self.emergency_active = False
        self.safety_engaged = False

        # Publishers
        self.emergency_stop_pub = self.create_publisher(Bool, 'emergency_stop', 10)
        self.safety_status_pub = self.create_publisher(String, 'safety_status', 10)
        self.cmd_vel_filtered_pub = self.create_publisher(Twist, 'cmd_vel_filtered', 10)

        # Subscribers
        self.battery_sub = self.create_subscription(
            BatteryState, 'battery_state', self.battery_callback, 10)
        self.joint_state_sub = self.create_subscription(
            JointState, 'joint_states', self.joint_state_callback, 10)
        self.imu_sub = self.create_subscription(
            Imu, 'imu/data', self.imu_callback, 10)
        self.hardware_status_sub = self.create_subscription(
            HardwareStatus, 'hardware_status', self.hardware_status_callback, 10)
        self.cmd_vel_sub = self.create_subscription(
            Twist, 'cmd_vel_unfiltered', self.cmd_vel_callback, 10)

        # Timers
        self.safety_check_timer = self.create_timer(0.1, self.safety_check)
        self.status_publish_timer = self.create_timer(1.0, self.publish_safety_status)

        # Robot state tracking
        self.battery_level = 1.0
        self.motor_currents = {}
        self.motor_temperatures = {}
        self.joint_states = {}
        self.imu_data = None
        self.hardware_status = None
        self.last_cmd_time = time.time()
        self.current_cmd = Twist()

        # Emergency stop history
        self.emergency_history = []

        self.get_logger().info('Safety Monitor initialized')

    def battery_callback(self, msg):
        """Process battery status"""
        self.battery_level = msg.percentage

        # Check for low battery
        if self.battery_level < self.safety_thresholds['battery_low']:
            if self.safety_level.value < SafetyLevel.WARNING.value:
                self.safety_level = SafetyLevel.WARNING
            self.get_logger().warn(f'LOW BATTERY: {self.battery_level:.1f}%')

    def joint_state_callback(self, msg):
        """Process joint states for current and temperature monitoring"""
        for i, name in enumerate(msg.name):
            if i < len(msg.effort):  # Effort often represents current
                self.motor_currents[name] = abs(msg.effort[i])

            # In a real system, temperatures would come from separate sensors
            # For simulation, we'll estimate based on current
            estimated_temp = 25 + (self.motor_currents[name] * 2) if name in self.motor_currents else 25
            self.motor_temperatures[name] = estimated_temp

    def imu_callback(self, msg):
        """Process IMU data for safety checks"""
        self.imu_data = msg

        # Check for dangerous accelerations
        linear_accel = (msg.linear_acceleration.x**2 +
                       msg.linear_acceleration.y**2 +
                       msg.linear_acceleration.z**2)**0.5

        if linear_accel > 20.0:  # Dangerous acceleration threshold
            if self.safety_level.value < SafetyLevel.WARNING.value:
                self.safety_level = SafetyLevel.WARNING
            self.get_logger().warn(f'DANGEROUS ACCELERATION: {linear_accel:.2f} m/s²')

    def hardware_status_callback(self, msg):
        """Process hardware status"""
        self.hardware_status = msg

        if not msg.connected:
            if self.safety_level.value < SafetyLevel.EMERGENCY.value:
                self.safety_level = SafetyLevel.EMERGENCY
            self.get_logger().error('HARDWARE DISCONNECTED')

        if msg.safety_lockout:
            if self.safety_level.value < SafetyLevel.EMERGENCY.value:
                self.safety_level = SafetyLevel.EMERGENCY
            self.get_logger().error('HARDWARE SAFETY LOCKOUT ACTIVE')

    def cmd_vel_callback(self, msg):
        """Process velocity commands and apply safety filtering"""
        self.last_cmd_time = time.time()
        self.current_cmd = msg

        # Apply safety filtering to commands
        filtered_cmd = self.filter_command(msg)

        # Publish filtered command
        self.cmd_vel_filtered_pub.publish(filtered_cmd)

    def filter_command(self, cmd):
        """Apply safety limits to velocity commands"""
        filtered = Twist()

        # Limit linear velocity
        filtered.linear.x = max(-self.safety_thresholds['velocity_limit'],
                               min(self.safety_thresholds['velocity_limit'], cmd.linear.x))
        filtered.linear.y = max(-self.safety_thresholds['velocity_limit'],
                               min(self.safety_thresholds['velocity_limit'], cmd.linear.y))
        filtered.linear.z = max(-self.safety_thresholds['velocity_limit'],
                               min(self.safety_thresholds['velocity_limit'], cmd.linear.z))

        # Limit angular velocity
        filtered.angular.x = max(-self.safety_thresholds['angular_velocity_limit'],
                                min(self.safety_thresholds['angular_velocity_limit'], cmd.angular.x))
        filtered.angular.y = max(-self.safety_thresholds['angular_velocity_limit'],
                                min(self.safety_thresholds['angular_velocity_limit'], cmd.angular.y))
        filtered.angular.z = max(-self.safety_thresholds['angular_velocity_limit'],
                                min(self.safety_thresholds['angular_velocity_limit'], cmd.angular.z))

        return filtered

    def safety_check(self):
        """Perform periodic safety checks"""
        current_time = time.time()

        # Check for command timeout
        time_since_cmd = current_time - self.last_cmd_time
        if time_since_cmd > self.safety_thresholds['command_timeout']:
            if self.safety_level.value < SafetyLevel.WARNING.value:
                self.safety_level = SafetyLevel.WARNING
            self.get_logger().warn(f'COMMAND TIMEOUT: {time_since_cmd:.1f}s since last command')
            # Auto-stop if timeout exceeded
            if time_since_cmd > self.safety_thresholds['command_timeout'] * 2:
                self.trigger_emergency_stop('Command timeout exceeded')

        # Check motor currents
        high_current_motors = [name for name, current in self.motor_currents.items()
                              if current > self.safety_thresholds['current_high']]
        if high_current_motors:
            if self.safety_level.value < SafetyLevel.WARNING.value:
                self.safety_level = SafetyLevel.WARNING
            self.get_logger().warn(f'HIGH MOTOR CURRENT: {high_current_motors}')

        # Check motor temperatures
        high_temp_motors = [name for name, temp in self.motor_temperatures.items()
                           if temp > self.safety_thresholds['temperature_high']]
        if high_temp_motors:
            if self.safety_level.value < SafetyLevel.WARNING.value:
                self.safety_level = SafetyLevel.WARNING
            self.get_logger().warn(f'HIGH MOTOR TEMPERATURE: {high_temp_motors}')

        # Check safety level escalation
        if self.battery_level < 0.1:  # Critical battery
            if self.safety_level.value < SafetyLevel.EMERGENCY.value:
                self.safety_level = SafetyLevel.EMERGENCY
            self.trigger_emergency_stop('Critical battery level')

    def trigger_emergency_stop(self, reason="Safety violation"):
        """Trigger emergency stop"""
        if not self.emergency_active:
            self.emergency_active = True
            self.safety_engaged = True

            # Publish emergency stop
            emergency_msg = Bool()
            emergency_msg.data = True
            self.emergency_stop_pub.publish(emergency_msg)

            # Stop all motion
            stop_cmd = Twist()
            self.cmd_vel_filtered_pub.publish(stop_cmd)

            # Log the incident
            incident = {
                'timestamp': time.time(),
                'reason': reason,
                'safety_level': self.safety_level.name,
                'battery_level': self.battery_level,
                'current_time': time.time() - self.last_cmd_time
            }
            self.emergency_history.append(incident)

            self.get_logger().fatal(f'EMERGENCY STOP TRIGGERED: {reason}')
            self.get_logger().info(f'Incident recorded: {incident}')

    def publish_safety_status(self):
        """Publish current safety status"""
        status_msg = String()
        status_msg.data = (
            f"Level: {self.safety_level.name}, "
            f"Battery: {self.battery_level:.2f}, "
            f"Emergency: {self.emergency_active}, "
            f"Engaged: {self.safety_engaged}"
        )
        self.safety_status_pub.publish(status_msg)

        # Log safety status periodically
        self.get_logger().info(f'Safety Status - {status_msg.data}')


def main(args=None):
    """Main function for safety monitor"""
    rclpy.init(args=args)
    monitor = SafetyMonitor()

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

### Exercise 1: Basic Deployment
Deploy a simple ROS 2 package to your Jetson Orin Nano and verify basic functionality.

### Exercise 2: Performance Optimization
Optimize a node for the Jetson platform, implementing resource monitoring and throttling.

### Exercise 3: Hardware Integration
Connect real sensors and actuators to your Jetson and interface with ROS 2.

### Exercise 4: Safety Implementation
Implement comprehensive safety systems including emergency stops and monitoring.

## Troubleshooting Common Issues

### Hardware Communication Issues
- **Permission Errors**: Add user to dialout group (`sudo usermod -a -G dialout $USER`)
- **Device Not Found**: Check device paths (`ls /dev/tty*`, `lsusb`)
- **Protocol Errors**: Verify baud rates and communication protocols

### Performance Issues
- **High CPU Usage**: Implement processing throttling and optimization
- **Memory Leaks**: Use memory profiling tools and proper cleanup
- **Thermal Throttling**: Improve cooling and optimize algorithms

### Deployment Issues
- **Build Failures**: Verify cross-compilation setup and dependencies
- **Runtime Errors**: Check library compatibility and file permissions
- **Network Issues**: Verify ROS domain settings and network configuration

## Summary

This chapter has covered the complete process of deploying ROS 2 packages to the NVIDIA Jetson Orin Nano platform, from initial setup and optimization to hardware integration and safety implementation. The Theory → Simulation → Real approach ensures that deployment procedures are first understood conceptually, tested in simulation, and then validated on physical hardware.

Key topics covered include:
- Hardware-software interface considerations
- Performance optimization for embedded platforms
- Safety and reliability implementation
- Hardware integration procedures
- Monitoring and diagnostic systems

Physical deployment requires careful attention to safety, resource constraints, and hardware-specific considerations that are not present in simulation environments. Success in physical deployment depends on thorough testing, proper safety systems, and robust error handling.

:::tip
Always test your deployment procedures in simulation first, and implement comprehensive monitoring and safety systems before operating near people or property.
:::

:::caution
Physical robots can cause injury or damage if safety systems fail. Always implement multiple layers of safety protection and test thoroughly before deployment in operational environments.
:::