---
title: "Sim-to-Real Transfer Techniques"
slug: "/module-2/sim-to-real-transfer"
sidebar_position: 7
---

# Sim-to-Real Transfer Techniques

## Learning Objectives

By the end of this chapter, students will be able to:
- Understand the fundamental challenges in transferring algorithms from simulation to real hardware
- Apply domain randomization techniques to improve sim-to-real transfer success
- Implement system identification methods to bridge the sim-to-real gap
- Design robust control systems that perform well in both simulation and reality
- Validate and calibrate simulation parameters to match real-world behavior

## Theory Section

### The Reality Gap Problem

The sim-to-real transfer problem, often called the "reality gap," refers to the performance degradation that occurs when algorithms developed and tested in simulation are deployed on real hardware. This gap arises from numerous discrepancies between simulated and real environments:

**Modeling Inaccuracies**: Simulation models are necessarily simplified representations of reality. Real systems have complex dynamics, nonlinearities, and behaviors that are difficult to capture in simulation.

**Sensor Imperfections**: Real sensors have noise, bias, drift, and other imperfections not fully captured in simulation.

**Actuator Limitations**: Real actuators have delays, friction, saturation limits, and other non-ideal characteristics.

**Environmental Factors**: Real environments have lighting changes, temperature variations, vibrations, and other factors not present in simulation.

**Hardware Variations**: Individual hardware units have manufacturing variations, wear, and calibration differences.

### Domain Randomization Theory

ڈومین رینڈمائزیشن ایک ایسی تکنیک ہے جس میں حقیقت میں منتقل ہونے پر مضبوطی کو بہتر بنانے کے لئے بے ترتیب تخروپن کے حالات کی ایک وسیع رینج میں الگورتھم کی تربیت شامل ہوتی ہے۔ بنیادی اصول یہ ہے کہ اگر کوئی الگورتھم مصنوعی حالات کی وسیع تقسیم پر کام کرسکتا ہے تو ، اس کا حقیقی دنیا میں کام کرنے کا زیادہ امکان ہے۔

** پیرامیٹر بے ترتیب **: جسمانی پیرامیٹرز کو بے ترتیب بنانا جیسے رگڑ کے گتانک ، ماس ، ڈیمپنگ ، اور دیگر متحرک خصوصیات۔

** بصری بے ترتیب **: تصادفی بصری خصوصیات جیسے بناوٹ ، روشنی کے حالات ، رنگ ، اور رینڈرنگ پیرامیٹرز۔

** حرکیات بے ترتیب **: بے ترتیب نظام کی حرکیات بشمول ایکچوایٹر کے ردعمل ، سینسر میں تاخیر ، اور کنٹرول لوپ ٹائمنگ۔

** ماحولیاتی بے ترتیب ہونا **: ماحولیاتی حالات جیسے کشش ثقل ، ہوا کے اثرات ، اور سطح کی خصوصیات کو بے ترتیب بنانا۔

### نظام کی شناخت کے نقطہ نظر

سسٹم کی شناخت ماپنے ان پٹ آؤٹ پٹ ڈیٹا سے متحرک نظاموں کے ریاضی کے ماڈلز کا تعین کرنے کا عمل ہے۔ سم سے حقیقی منتقلی میں ، اس میں شامل ہیں:

** پیرامیٹر کا تخمینہ **: اصلی دنیا کی پیمائش کے ساتھ نقلی پیداوار کا موازنہ کرکے نقلی ماڈل میں نامعلوم پیرامیٹرز کا تعین کرنا۔

** ماڈل ڈھانچے کا انتخاب **: مشاہدہ شدہ طرز عمل پر مبنی سسٹم ماڈل کے لئے مناسب ریاضی کے ڈھانچے کا انتخاب۔

** توثیق کی تکنیک **: آزاد ڈیٹا سیٹوں کے خلاف شناخت شدہ ماڈلز کی جانچ کو یقینی بنانے کے لئے کہ وہ اچھی طرح سے عام ہوجائیں۔

### مضبوط کنٹرول تھیوری

مضبوط کنٹرول تکنیک ماڈل کی غیر یقینی صورتحال اور رکاوٹوں کی موجودگی میں کارکردگی کو برقرار رکھنے کے لئے ڈیزائن کی گئی ہیں۔

** H- انفینیٹی کنٹرول **: ممکنہ نظام کے ماڈلز کے ایک سیٹ پر بدترین صورتحال کی کارکردگی کو بہتر بناتا ہے۔

** سلائیڈنگ موڈ کنٹرول **: نظام کو غیر یقینی صورتحال کے باوجود مطلوبہ رفتار کی پیروی کرنے پر مجبور کرتا ہے۔

** انکولی کنٹرول **: مشاہدہ شدہ نظام کے طرز عمل کی بنیاد پر آن لائن کنٹرول پیرامیٹرز کو ایڈجسٹ کرتا ہے۔

## ڈیجیٹل جڑواں لیب (نقالی)

### ورزش 1: ڈومین بے ترتیب کاری کا نفاذCreate a domain randomization framework that trains a controller across multiple randomized simulation conditions:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, Vector3
from sensor_msgs.msg import LaserScan, Imu
from nav_msgs.msg import Odometry
from std_msgs.msg import Float64, Bool
import numpy as np
import math
import random
from collections import deque

class DomainRandomizationTrainer(Node):
    def __init__(self):
        super().__init__('domain_randomization_trainer')

        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.param_status_pub = self.create_publisher(Float64, '/domain_randomization/param_status', 10)
        self.randomization_trigger_pub = self.create_publisher(Bool, '/domain_randomization/trigger', 10)

        # Subscribers
        self.scan_sub = self.create_subscription(LaserScan, '/scan', self.scan_callback, 10)
        self.odom_sub = self.create_subscription(Odometry, '/odom', self.odom_callback, 10)

        # Timer for randomization
        self.randomization_timer = self.create_timer(5.0, self.randomize_domain_parameters)

        # Timer for control loop
        self.control_timer = self.create_timer(0.1, self.control_loop)

        # Domain randomization parameters
        self.current_params = {
            'robot_mass': 10.0,
            'wheel_radius': 0.05,
            'wheel_base': 0.3,
            'friction_coeff': 0.8,
            'sensor_noise_std': 0.02,
            'actuator_delay': 0.02,
            'control_frequency': 10.0
        }

        # Randomization ranges
        self.randomization_ranges = {
            'robot_mass': (5.0, 15.0),  # kg
            'wheel_radius': (0.04, 0.06),  # m
            'wheel_base': (0.25, 0.35),  # m
            'friction_coeff': (0.5, 1.0),
            'sensor_noise_std': (0.01, 0.05),
            'actuator_delay': (0.01, 0.05)  # s
        }

        # Robot state
        self.robot_pose = np.array([0.0, 0.0, 0.0])  # x, y, theta
        self.robot_velocity = np.array([0.0, 0.0, 0.0])  # vx, vy, omega

        # Data buffers for validation
        self.pose_buffer = deque(maxlen=100)
        self.cmd_buffer = deque(maxlen=100)

        self.get_logger().info('Domain Randomization Trainer initialized')

    def randomize_domain_parameters(self):
        """Randomize domain parameters to improve sim-to-real transfer"""
        for param_name, (min_val, max_val) in self.randomization_ranges.items():
            # Randomize parameter within range
            new_value = random.uniform(min_val, max_val)
            self.current_params[param_name] = new_value

            self.get_logger().info(f'Randomized {param_name}: {new_value:.3f}')

        # Publish randomization status
        status_msg = Float64()
        status_msg.data = 1.0  # Indicates parameters were randomized
        self.param_status_pub.publish(status_msg)

        # Trigger any dependent systems
        trigger_msg = Bool()
        trigger_msg.data = True
        self.randomization_trigger_pub.publish(trigger_msg)

    def scan_callback(self, msg):
        """Process laser scan data"""
        # Store scan information for validation
        valid_ranges = [r for r in msg.ranges if msg.range_min <= r <= msg.range_max]
        if valid_ranges:
            avg_range = sum(valid_ranges) / len(valid_ranges)
            self.get_logger().debug(f'Average scan range: {avg_range:.2f}m')

    def odom_callback(self, msg):
        """Process odometry data"""
        # Update robot pose
        self.robot_pose[0] = msg.pose.pose.position.x
        self.robot_pose[1] = msg.pose.pose.position.y

        # Convert quaternion to euler for theta
        quat = msg.pose.pose.orientation
        siny_cosp = 2 * (quat.w * quat.z + quat.x * quat.y)
        cosy_cosp = 1 - 2 * (quat.y * quat.y + quat.z * quat.z)
        self.robot_pose[2] = math.atan2(siny_cosp, cosy_cosp)

        # Store pose for validation
        self.pose_buffer.append({
            'timestamp': self.get_clock().now().nanoseconds,
            'pose': self.robot_pose.copy()
        })

    def control_loop(self):
        """Main control loop with domain randomization"""
        # Simple obstacle avoidance behavior
        cmd_vel = Twist()

        # Example: Simple wall following behavior
        target_distance = 1.0  # meters from wall
        safety_distance = 0.5  # minimum safe distance

        # In a real implementation, this would use actual sensor data
        # For simulation, we'll use a simplified approach
        cmd_vel.linear.x = 0.3  # Forward velocity
        cmd_vel.angular.z = 0.0  # No turn initially

        # Add some randomization effect to the control
        # This simulates how randomized parameters might affect control
        param_effect = (self.current_params['friction_coeff'] - 0.75) * 0.2  # Adjust based on friction
        cmd_vel.linear.x += param_effect

        # Publish command
        self.cmd_vel_pub.publish(cmd_vel)

        # Store command for validation
        self.cmd_buffer.append({
            'timestamp': self.get_clock().now().nanoseconds,
            'cmd': np.array([cmd_vel.linear.x, cmd_vel.angular.z])
        })

    def validate_performance(self):
        """Validate performance across different parameter sets"""
        if len(self.pose_buffer) < 10 or len(self.cmd_buffer) < 10:
            return 0.0

        # Calculate trajectory smoothness and consistency
        positions = [p['pose'][:2] for p in list(self.pose_buffer)[-20:]]  # Last 20 poses

        if len(positions) < 2:
            return 0.0

        # Calculate path efficiency (how straight vs. wandering)
        start_pos = positions[0]
        end_pos = positions[-1]
        direct_distance = math.sqrt((end_pos[0] - start_pos[0])**2 + (end_pos[1] - start_pos[1])**2)

        # Calculate actual path length
        path_length = 0.0
        for i in range(1, len(positions)):
            dx = positions[i][0] - positions[i-1][0]
            dy = positions[i][1] - positions[i-1][1]
            path_length += math.sqrt(dx*dx + dy*dy)

        # Path efficiency: direct_distance / path_length (1.0 = perfectly straight)
        efficiency = direct_distance / path_length if path_length > 0 else 0.0

        # Performance score based on efficiency (higher is better, but capped)
        performance_score = min(1.0, efficiency * 2.0)  # Double efficiency to make it more meaningful

        return performance_score

def main(args=None):
    rclpy.init(args=args)
    trainer = DomainRandomizationTrainer()

    try:
        rclpy.spin(trainer)
    except KeyboardInterrupt:
        trainer.get_logger().info('Shutting down domain randomization trainer')
    finally:
        trainer.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Exercise 2: System Identification Framework

Create a system identification system that compares simulation and real behavior to identify model parameters:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, Vector3
from sensor_msgs.msg import JointState, Imu
from std_msgs.msg import Float64MultiArray, String
import numpy as np
import math
from scipy.optimize import minimize
from collections import deque
import time

class SystemIdentifier(Node):
    def __init__(self):
        super().__init__('system_identifier')

        # Publishers
        self.param_update_pub = self.create_publisher(Float64MultiArray, '/system_identification/parameters', 10)
        self.status_pub = self.create_publisher(String, '/system_identification/status', 10)

        # Subscribers
        self.cmd_sub = self.create_subscription(Twist, '/cmd_vel', self.command_callback, 10)
        self.joint_sub = self.create_subscription(JointState, '/joint_states', self.joint_callback, 10)
        self.imu_sub = self.create_subscription(Imu, '/imu/data', self.imu_callback, 10)

        # Timer for identification
        self.identification_timer = self.create_timer(0.5, self.perform_system_identification)

        # Initialize system model parameters
        self.model_params = {
            'mass': 10.0,  # kg
            'inertia': 0.5,  # kg*m^2
            'friction_coeff': 0.1,  # N*s/m
            'motor_constant': 0.8,  # motor torque constant
            'gear_ratio': 10.0,  # gear ratio
            'wheel_radius': 0.05  # m
        }

        # Data collection buffers
        self.command_buffer = deque(maxlen=1000)  # Store last 1000 commands
        self.state_buffer = deque(maxlen=1000)    # Store last 1000 states
        self.time_buffer = deque(maxlen=1000)     # Store timestamps

        # Identification control variables
        self.identification_active = True
        self.identification_data_collected = 0
        self.min_data_points = 50  # Minimum data points needed for identification

        # Excitation signal generator
        self.excitation_frequency = 0.5  # Hz
        self.excitation_amplitude = 0.5  # amplitude of excitation
        self.excitation_time = 0.0

        self.get_logger().info('System Identifier initialized')

    def command_callback(self, msg):
        """Store commanded velocities"""
        current_time = self.get_clock().now().nanoseconds / 1e9  # Convert to seconds

        command_data = {
            'time': current_time,
            'linear_x': msg.linear.x,
            'angular_z': msg.angular.z
        }

        self.command_buffer.append(command_data)
        self.time_buffer.append(current_time)

    def joint_callback(self, msg):
        """Store joint state information"""
        if len(msg.position) >= 2 and len(msg.velocity) >= 2:
            state_data = {
                'position': msg.position[:2],  # First two joints
                'velocity': msg.velocity[:2],  # First two joints
                'effort': msg.effort[:2] if len(msg.effort) >= 2 else [0.0, 0.0]
            }

            self.state_buffer.append(state_data)

    def imu_callback(self, msg):
        """Store IMU data for system identification"""
        # This could be used for additional state information
        pass

    def perform_system_identification(self):
        """Perform system identification using collected data"""
        if len(self.command_buffer) < self.min_data_points or len(self.state_buffer) < self.min_data_points:
            status_msg = String()
            status_msg.data = f"Collecting data: {len(self.command_buffer)}/{self.min_data_points} points"
            self.status_pub.publish(status_msg)
            return

        # Generate excitation signal to improve identifiability
        self.generate_excitation_signal()

        # Perform parameter estimation
        if self.identification_active and len(self.command_buffer) >= self.min_data_points:
            try:
                estimated_params = self.estimate_parameters()
                if estimated_params is not None:
                    self.update_model_parameters(estimated_params)
                    self.publish_parameter_update(estimated_params)

                    status_msg = String()
                    status_msg.data = f"Parameters updated: mass={estimated_params[0]:.2f}, friction={estimated_params[2]:.3f}"
                    self.status_pub.publish(status_msg)

            except Exception as e:
                self.get_logger().error(f'Parameter estimation failed: {e}')

    def generate_excitation_signal(self):
        """Generate persistently exciting signals for better identification"""
        # This would typically send commands to the robot to generate rich data
        # For simulation, we'll just update the excitation time
        self.excitation_time += 0.5  # Timer period

        # Create a rich excitation signal (sum of sinusoids at different frequencies)
        excitation = 0.0
        for freq_mult in [1, 2, 3, 5]:  # Multiple frequencies
            excitation += self.excitation_amplitude * math.sin(
                2 * math.pi * self.excitation_frequency * freq_mult * self.excitation_time
            )

        # Normalize to reasonable command range
        excitation = max(-1.0, min(1.0, excitation))

    def estimate_parameters(self):
        """Estimate system parameters using least squares or other method"""
        # Convert buffers to numpy arrays for processing
        n_points = min(len(self.command_buffer), len(self.state_buffer))
        if n_points < self.min_data_points:
            return None

        # Get the most recent data points
        recent_commands = list(self.command_buffer)[-n_points:]
        recent_states = list(self.state_buffer)[-n_points:]

        # Prepare data for parameter estimation
        # This is a simplified example - real system ID would be more complex
        # We'll estimate a simple first-order system: tau = J*alpha + b*omega + friction
        # where tau is torque, J is inertia, alpha is angular acceleration, omega is angular velocity

        # Extract relevant data
        times = np.array([cmd['time'] for cmd in recent_commands])
        linear_cmds = np.array([cmd['linear_x'] for cmd in recent_commands])
        velocities = np.array([state['velocity'][0] if state['velocity'] else 0.0 for state in recent_states])

        # Calculate acceleration (derivative of velocity)
        if len(velocities) > 1:
            dt = np.diff(times)
            accelerations = np.diff(velocities) / (dt + 1e-10)  # Add small value to avoid division by zero
        else:
            return None

        # Use least squares to estimate parameters
        # Model: F = m*a + b*v + friction (simplified)
        # We want to solve for [m, b, friction] in F = [a, v, 1] * [m, b, friction]^T

        # Prepare regression matrices
        n_valid = len(accelerations)
        if n_valid < 10:  # Need minimum points
            return None

        # Use command as proxy for force (simplified)
        forces = linear_cmds[1:] * self.model_params['motor_constant']  # Approximate force from command

        # Regression matrix
        A = np.column_stack([
            accelerations,  # mass coefficient
            velocities[1:], # friction/damping coefficient
            np.ones(n_valid) # constant term
        ])

        # Solve least squares: minimize ||A*x - b||^2
        try:
            # Ensure we have enough valid data points
            if len(forces) != len(A):
                min_len = min(len(forces), len(A))
                forces = forces[:min_len]
                A = A[:min_len]

            if len(forces) < 5:  # Need minimum points
                return None

            params, residuals, rank, s = np.linalg.lstsq(A, forces, rcond=None)

            # Extract estimated parameters
            estimated_mass = max(0.1, params[0])  # Ensure positive mass
            estimated_damping = params[1]
            estimated_offset = params[2]

            return [estimated_mass, estimated_damping, estimated_offset]

        except np.linalg.LinAlgError:
            return None

    def update_model_parameters(self, estimated_params):
        """Update the internal model with estimated parameters"""
        # Update mass (first parameter)
        if 0.1 <= estimated_params[0] <= 50.0:  # Reasonable mass range
            self.model_params['mass'] = estimated_params[0]

        # Update friction/damping coefficient
        self.model_params['friction_coeff'] = max(0.0, estimated_params[1])

        # Update other parameters as needed
        # This is a simplified example - real systems would update multiple parameters

        self.get_logger().info(
            f'Updated parameters: mass={self.model_params["mass"]:.3f}, '
            f'friction={self.model_params["friction_coeff"]:.3f}'
        )

    def publish_parameter_update(self, params):
        """Publish updated parameters"""
        param_msg = Float64MultiArray()
        param_msg.data = params
        self.param_update_pub.publish(param_msg)

def main(args=None):
    rclpy.init(args=args)
    identifier = SystemIdentifier()

    try:
        rclpy.spin(identifier)
    except KeyboardInterrupt:
        identifier.get_logger().info('Shutting down system identifier')
    finally:
        identifier.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Exercise 3: Robust Control Implementation

Create a robust control system that maintains performance despite model uncertainties:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, PoseStamped
from sensor_msgs.msg import LaserScan, Imu
from nav_msgs.msg import Odometry
from std_msgs.msg import Float64, Bool
import numpy as np
import math
from collections import deque

class RobustController(Node):
    def __init__(self):
        super().__init__('robust_controller')

        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.robustness_score_pub = self.create_publisher(Float64, '/robustness_score', 10)
        self.safety_status_pub = self.create_publisher(Bool, '/safety_status', 10)

        # Subscribers
        self.scan_sub = self.create_subscription(LaserScan, '/scan', self.scan_callback, 10)
        self.odom_sub = self.create_subscription(Odometry, '/odom', self.odom_callback, 10)
        self.imu_sub = self.create_subscription(Imu, '/imu/data', self.imu_callback, 10)

        # Timer for control loop
        self.control_timer = self.create_timer(0.05, self.robust_control_loop)  # 20 Hz

        # Robot state
        self.current_pose = np.array([0.0, 0.0, 0.0])  # x, y, theta
        self.current_velocity = np.array([0.0, 0.0, 0.0])  # vx, vy, omega
        self.current_angular_velocity = 0.0

        # Uncertainty bounds (estimated model errors)
        self.uncertainty_bounds = {
            'mass_error': 0.5,  # ±0.5 kg uncertainty
            'friction_error': 0.2,  # ±0.2 N*s/m uncertainty
            'actuator_error': 0.15,  # ±15% actuator uncertainty
            'sensor_noise': 0.05  # ±0.05m sensor noise
        }

        # Robust control parameters
        self.nominal_params = {
            'mass': 10.0,
            'friction_coeff': 0.1,
            'max_force': 50.0
        }

        # Adaptive control components
        self.adaptive_gains = np.array([1.0, 0.5, 0.1])  # [pos_gain, vel_gain, integral_gain]
        self.velocity_error_integral = 0.0
        self.max_integral_windup = 5.0

        # Safety parameters
        self.safety_distance = 0.5  # meters
        self.max_linear_vel = 0.5  # m/s
        self.max_angular_vel = 1.0  # rad/s

        # Performance monitoring
        self.error_history = deque(maxlen=100)
        self.command_history = deque(maxlen=100)

        self.get_logger().info('Robust Controller initialized')

    def scan_callback(self, msg):
        """Process laser scan for obstacle detection"""
        # Find minimum distance to obstacles
        valid_ranges = [r for r in msg.ranges if msg.range_min <= r <= msg.range_max]
        if valid_ranges:
            min_distance = min(valid_ranges)
            self.closest_obstacle_distance = min_distance
        else:
            self.closest_obstacle_distance = float('inf')

    def odom_callback(self, msg):
        """Process odometry data"""
        # Update current pose
        self.current_pose[0] = msg.pose.pose.position.x
        self.current_pose[1] = msg.pose.pose.position.y

        # Convert quaternion to euler
        quat = msg.pose.pose.orientation
        siny_cosp = 2 * (quat.w * quat.z + quat.x * quat.y)
        cosy_cosp = 1 - 2 * (quat.y * quat.y + quat.z * quat.z)
        self.current_pose[2] = math.atan2(siny_cosp, cosy_cosp)

        # Update velocity
        self.current_velocity[0] = msg.twist.twist.linear.x
        self.current_velocity[1] = msg.twist.twist.linear.y
        self.current_angular_velocity = msg.twist.twist.angular.z

    def imu_callback(self, msg):
        """Process IMU data for additional state information"""
        # Use IMU for better heading estimation if available
        quat = msg.orientation
        siny_cosp = 2 * (quat.w * quat.z + quat.x * quat.y)
        cosy_cosp = 1 - 2 * (quat.y * quat.y + quat.z * quat.z)
        imu_heading = math.atan2(siny_cosp, cosy_cosp)

        # Blend with odometry heading for robustness
        self.current_pose[2] = 0.7 * self.current_pose[2] + 0.3 * imu_heading

    def robust_control_loop(self):
        """Main robust control loop"""
        # Define desired behavior (e.g., follow a trajectory or avoid obstacles)
        desired_cmd = self.compute_desired_command()

        # Apply robust control techniques
        robust_cmd = self.apply_robust_control(desired_cmd)

        # Ensure safety constraints
        safe_cmd = self.apply_safety_constraints(robust_cmd)

        # Publish command
        cmd_msg = Twist()
        cmd_msg.linear.x = float(safe_cmd[0])
        cmd_msg.angular.z = float(safe_cmd[1])
        self.cmd_vel_pub.publish(cmd_msg)

        # Monitor performance
        self.monitor_performance(safe_cmd)

        # Update robustness score
        self.update_robustness_score()

    def compute_desired_command(self):
        """Compute desired command based on current state and objectives"""
        # Example: Simple obstacle avoidance with wall following
        desired_linear = 0.3  # Default forward speed
        desired_angular = 0.0

        # Safety check
        if hasattr(self, 'closest_obstacle_distance'):
            if self.closest_obstacle_distance < self.safety_distance * 1.5:
                # Emergency stop or turn
                desired_angular = 0.8 if self.closest_obstacle_distance < 0.3 else 0.3
                desired_linear = 0.1  # Slow down when close to obstacles

        return np.array([desired_linear, desired_angular])

    def apply_robust_control(self, desired_cmd):
        """Apply robust control techniques to handle uncertainties"""
        # Sliding mode control approach
        # Define sliding surface: s = e + lambda*integral(e)
        # where e is the error between desired and actual behavior

        # For simplicity, we'll use a gain scheduling approach based on uncertainty
        current_uncertainty = self.estimate_current_uncertainty()

        # Adjust gains based on uncertainty level
        uncertainty_factor = 1.0 + current_uncertainty
        adjusted_gains = self.adaptive_gains * uncertainty_factor

        # Apply robust control law
        robust_cmd = desired_cmd.copy()

        # Add robustness term to counteract uncertainties
        robustness_term = 0.1 * current_uncertainty * np.sign(desired_cmd)
        robust_cmd += robustness_term

        # Apply saturation to prevent excessive commands
        robust_cmd[0] = np.clip(robust_cmd[0], -self.max_linear_vel, self.max_linear_vel)
        robust_cmd[1] = np.clip(robust_cmd[1], -self.max_angular_vel, self.max_angular_vel)

        return robust_cmd

    def estimate_current_uncertainty(self):
        """Estimate current level of model uncertainty"""
        # This is a simplified uncertainty estimator
        # In practice, this would use more sophisticated methods

        uncertainty_score = 0.0

        # Check for unexpected behavior (high control effort for little motion)
        if len(self.command_history) > 10:
            recent_commands = list(self.command_history)[-10:]
            avg_command = np.mean([cmd[0] for cmd in recent_commands])  # linear command
            avg_velocity = np.mean([vel[0] for vel in list(self.current_velocity)[-10:]]) if len(list(self.current_velocity)) >= 10 else 0

            if abs(avg_command) > 0.1 and abs(avg_velocity) < 0.05 * abs(avg_command):
                # High command but low response indicates high uncertainty
                uncertainty_score += 0.3

        # Add other uncertainty indicators here
        # For example: sensor consistency checks, model prediction errors, etc.

        return min(1.0, max(0.0, uncertainty_score))

    def apply_safety_constraints(self, cmd):
        """Apply safety constraints to control commands"""
        constrained_cmd = cmd.copy()

        # Limit velocities based on safety distance
        if hasattr(self, 'closest_obstacle_distance'):
            if self.closest_obstacle_distance < self.safety_distance:
                # Reduce speed proportionally to distance
                speed_factor = self.closest_obstacle_distance / self.safety_distance
                constrained_cmd[0] = cmd[0] * speed_factor
                constrained_cmd[1] = cmd[1] * speed_factor  # Also reduce turning in tight spaces

        # Ensure commands are within safe limits
        constrained_cmd[0] = np.clip(constrained_cmd[0], -self.max_linear_vel, self.max_linear_vel)
        constrained_cmd[1] = np.clip(constrained_cmd[1], -self.max_angular_vel, self.max_angular_vel)

        # Check if safety should be triggered
        safety_violated = (hasattr(self, 'closest_obstacle_distance') and
                          self.closest_obstacle_distance < self.safety_distance * 0.5)

        safety_msg = Bool()
        safety_msg.data = not safety_violated
        self.safety_status_pub.publish(safety_msg)

        return constrained_cmd

    def monitor_performance(self, cmd):
        """Monitor control performance for adaptation"""
        self.command_history.append(cmd)

        # Calculate performance metrics
        # For example, tracking error, control effort, stability measures
        if hasattr(self, 'current_velocity'):
            velocity_error = cmd[0] - self.current_velocity[0]  # Simple velocity tracking error
            self.error_history.append(abs(velocity_error))

    def update_robustness_score(self):
        """Update and publish robustness score"""
        if len(self.error_history) > 10:
            avg_error = sum(list(self.error_history)[-10:]) / 10
            # Convert to robustness score (lower error = higher robustness)
            robustness_score = max(0.0, 1.0 - avg_error)  # Simple conversion
        else:
            robustness_score = 1.0  # Assume perfect initially

        score_msg = Float64()
        score_msg.data = robustness_score
        self.robustness_score_pub.publish(score_msg)

def main(args=None):
    rclpy.init(args=args)
    controller = RobustController()

    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        controller.get_logger().info('Shutting down robust controller')
    finally:
        controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Physical AI Deployment (Edge)

### Exercise 4: Edge-Optimized Sim-to-Real Transfer

Create an optimized version for deployment on NVIDIA Jetson Orin Nano:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan
from std_msgs.msg import Float64MultiArray, Bool
import numpy as np
import math
import time
import psutil
from collections import deque

class EdgeOptimizedTransfer(Node):
    def __init__(self):
        super().__init__('edge_optimized_transfer')

        # Publishers with reduced queue sizes for edge efficiency
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 3)
        self.performance_pub = self.create_publisher(Float64MultiArray, '/edge_performance', 3)
        self.safety_pub = self.create_publisher(Bool, '/edge_safety', 3)

        # Subscribers
        self.scan_sub = self.create_subscription(LaserScan, '/scan', self.scan_callback, 3)

        # Timer with adaptive frequency for edge
        self.main_timer = self.create_timer(0.066, self.edge_control_loop)  # ~15 Hz for efficiency

        # Edge-optimized parameters
        self.base_frequency = 15.0  # Hz
        self.adaptive_frequency = 15.0
        self.cpu_threshold = 70.0
        self.memory_threshold = 80.0

        # Simplified robot model for edge
        self.robot_state = {
            'x': 0.0,
            'y': 0.0,
            'theta': 0.0,
            'v_linear': 0.0,
            'v_angular': 0.0
        }

        # Edge-optimized control parameters
        self.edge_control_params = {
            'max_linear_vel': 0.4,  # Reduced for safety
            'max_angular_vel': 0.8,
            'safety_distance': 0.4,  # Reduced for faster reaction
            'control_gain': 0.8      # Lower for stability
        }

        # Resource monitoring
        self.processing_times = deque(maxlen=20)
        self.last_update_time = time.time()

        # Simplified obstacle avoidance (reduced complexity)
        self.obstacle_distances = []

        self.get_logger().info('Edge Optimized Transfer initialized')

    def scan_callback(self, msg):
        """Process laser scan with edge-optimized algorithm"""
        start_time = time.time()

        # Simplified obstacle detection - only check key directions
        num_beams = len(msg.ranges)
        key_angles = [0, num_beams//4, num_beams//2, 3*num_beams//4]  # Front, left, back, right

        self.obstacle_distances = []
        for angle_idx in key_angles:
            if angle_idx < num_beams:
                range_val = msg.ranges[angle_idx]
                if msg.range_min <= range_val <= msg.range_max:
                    self.obstacle_distances.append(range_val)

        # Record processing time
        processing_time = time.time() - start_time
        self.processing_times.append(processing_time)

    def edge_control_loop(self):
        """Main control loop optimized for edge devices"""
        # Monitor resources and adapt
        self.adapt_to_resources()

        # Update robot state (simplified)
        self.update_robot_state()

        # Compute edge-optimized control
        cmd_vel = self.compute_edge_optimized_control()

        # Publish command
        self.cmd_vel_pub.publish(cmd_vel)

        # Publish performance metrics
        self.publish_performance_metrics()

    def adapt_to_resources(self):
        """Adapt control frequency and complexity based on resources"""
        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent

        # Adjust frequency based on CPU usage
        if cpu_percent > self.cpu_threshold:
            self.adaptive_frequency = max(5.0, self.adaptive_frequency * 0.9)
        elif cpu_percent < 50.0:
            self.adaptive_frequency = min(self.base_frequency, self.adaptive_frequency * 1.02)

        # Update timer if frequency changed significantly
        current_period = self.main_timer.timer_period_ns / 1e9
        target_period = 1.0 / self.adaptive_frequency

        if abs(current_period - target_period) > 0.02:  # 20ms threshold
            # Note: In practice, you might need to recreate the timer
            pass

    def update_robot_state(self):
        """Simplified state update for edge"""
        # In a real system, this would integrate IMU/odometry data
        # For simulation, we'll use a simple model
        dt = 0.066  # ~15 Hz

        # Simple motion integration
        self.robot_state['x'] += self.robot_state['v_linear'] * math.cos(self.robot_state['theta']) * dt
        self.robot_state['y'] += self.robot_state['v_linear'] * math.sin(self.robot_state['theta']) * dt
        self.robot_state['theta'] += self.robot_state['v_angular'] * dt

        # Normalize angle
        self.robot_state['theta'] = math.atan2(
            math.sin(self.robot_state['theta']),
            math.cos(self.robot_state['theta'])
        )

    def compute_edge_optimized_control(self):
        """Compute control with edge-optimized algorithm"""
        cmd = Twist()

        if not self.obstacle_distances:
            # Default forward motion if no obstacles detected
            cmd.linear.x = 0.2
            cmd.angular.z = 0.0
            return cmd

        # Simplified obstacle avoidance
        front_dist = self.obstacle_distances[0] if len(self.obstacle_distances) > 0 else float('inf')
        left_dist = self.obstacle_distances[1] if len(self.obstacle_distances) > 1 else float('inf')
        right_dist = self.obstacle_distances[3] if len(self.obstacle_distances) > 3 else float('inf')

        # Safety check
        if front_dist < self.edge_control_params['safety_distance']:
            # Too close to front obstacle - turn away
            if left_dist > right_dist:
                cmd.angular.z = self.edge_control_params['control_gain']
            else:
                cmd.angular.z = -self.edge_control_params['control_gain']
            cmd.linear.x = 0.1  # Slow down
        else:
            # Safe to proceed
            cmd.linear.x = min(0.3, self.edge_control_params['max_linear_vel'])
            cmd.angular.z = 0.0

        # Apply limits
        cmd.linear.x = max(0.0, min(cmd.linear.x, self.edge_control_params['max_linear_vel']))
        cmd.angular.z = max(-self.edge_control_params['max_angular_vel'],
                           min(cmd.angular.z, self.edge_control_params['max_angular_vel']))

        # Store for state update
        self.robot_state['v_linear'] = cmd.linear.x
        self.robot_state['v_angular'] = cmd.angular.z

        return cmd

    def publish_performance_metrics(self):
        """Publish edge performance metrics"""
        metrics = Float64MultiArray()

        avg_processing_time = np.mean(self.processing_times) if self.processing_times else 0
        cpu_usage = psutil.cpu_percent()
        memory_usage = psutil.virtual_memory().percent

        metrics.data = [
            cpu_usage,                    # CPU %
            memory_usage,                 # Memory %
            avg_processing_time,          # Avg processing time (s)
            self.adaptive_frequency,      # Current frequency
            float(len(self.obstacle_distances))  # Num obstacle readings
        ]

        self.performance_pub.publish(metrics)

        # Publish safety status
        safety_msg = Bool()
        min_dist = min(self.obstacle_distances) if self.obstacle_distances else float('inf')
        safety_msg.data = min_dist > self.edge_control_params['safety_distance'] * 0.7
        self.safety_pub.publish(safety_msg)

def main(args=None):
    rclpy.init(args=args)
    edge_transfer = EdgeOptimizedTransfer()

    try:
        rclpy.spin(edge_transfer)
    except KeyboardInterrupt:
        edge_transfer.get_logger().info('Shutting down edge optimized transfer')
    finally:
        edge_transfer.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Exercise 5: Validation and Calibration Framework

Create a comprehensive validation and calibration system for sim-to-real transfer:

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, PoseStamped, PointStamped
from sensor_msgs.msg import LaserScan, JointState
from nav_msgs.msg import Odometry
from std_msgs.msg import Float64MultiArray, String, Bool
from visualization_msgs.msg import Marker, MarkerArray
import numpy as np
import math
from collections import deque
import time
from scipy.spatial.distance import cdist

class TransferValidator(Node):
    def __init__(self):
        super().__init__('transfer_validator')

        # Publishers
        self.validation_score_pub = self.create_publisher(Float64MultiArray, '/transfer_validation/scores', 10)
        self.calibration_status_pub = self.create_publisher(String, '/transfer_validation/calibration_status', 10)
        self.performance_pub = self.create_publisher(Float64MultiArray, '/transfer_validation/performance', 10)
        self.marker_pub = self.create_publisher(Marker, '/transfer_validation/visualization', 10)

        # Subscribers
        self.sim_pose_sub = self.create_subscription(PoseStamped, '/sim/pose', self.sim_pose_callback, 10)
        self.real_pose_sub = self.create_subscription(PoseStamped, '/real/pose', self.real_pose_callback, 10)
        self.sim_scan_sub = self.create_subscription(LaserScan, '/sim/scan', self.sim_scan_callback, 10)
        self.real_scan_sub = self.create_subscription(LaserScan, '/real/scan', self.real_scan_callback, 10)

        # Timer for validation
        self.validation_timer = self.create_timer(1.0, self.perform_validation)

        # Data buffers for comparison
        self.sim_pose_buffer = deque(maxlen=50)
        self.real_pose_buffer = deque(maxlen=50)
        self.sim_scan_buffer = deque(maxlen=10)
        self.real_scan_buffer = deque(maxlen=10)

        # Validation metrics
        self.validation_metrics = {
            'pose_accuracy': 0.0,
            'trajectory_similarity': 0.0,
            'sensor_fidelity': 0.0,
            'temporal_alignment': 0.0
        }

        # Calibration parameters
        self.calibration_params = {
            'pose_offset_x': 0.0,
            'pose_offset_y': 0.0,
            'pose_offset_theta': 0.0,
            'scale_factor': 1.0,
            'sensor_noise_model': {'std': 0.02, 'bias': 0.0}
        }

        # Performance tracking
        self.start_time = time.time()
        self.validation_count = 0

        self.get_logger().info('Transfer Validator initialized')

    def sim_pose_callback(self, msg):
        """Store simulated pose data"""
        pose_data = {
            'timestamp': msg.header.stamp,
            'x': msg.pose.position.x,
            'y': msg.pose.position.y,
            'theta': self.quaternion_to_yaw(msg.pose.orientation)
        }
        self.sim_pose_buffer.append(pose_data)

    def real_pose_callback(self, msg):
        """Store real pose data"""
        pose_data = {
            'timestamp': msg.header.stamp,
            'x': msg.pose.position.x,
            'y': msg.pose.position.y,
            'theta': self.quaternion_to_yaw(msg.pose.orientation)
        }
        self.real_pose_buffer.append(pose_data)

    def sim_scan_callback(self, msg):
        """Store simulated scan data"""
        scan_data = {
            'timestamp': msg.header.stamp,
            'ranges': list(msg.ranges),
            'angle_min': msg.angle_min,
            'angle_increment': msg.angle_increment
        }
        self.sim_scan_buffer.append(scan_data)

    def real_scan_callback(self, msg):
        """Store real scan data"""
        scan_data = {
            'timestamp': msg.header.stamp,
            'ranges': list(msg.ranges),
            'angle_min': msg.angle_min,
            'angle_increment': msg.angle_increment
        }
        self.real_scan_buffer.append(scan_data)

    def quaternion_to_yaw(self, quat):
        """Convert quaternion to yaw angle"""
        siny_cosp = 2 * (quat.w * quat.z + quat.x * quat.y)
        cosy_cosp = 1 - 2 * (quat.y * quat.y + quat.z * quat.z)
        return math.atan2(siny_cosp, cosy_cosp)

    def perform_validation(self):
        """Perform comprehensive sim-to-real validation"""
        self.validation_count += 1

        # Calculate validation metrics
        self.validation_metrics['pose_accuracy'] = self.calculate_pose_accuracy()
        self.validation_metrics['trajectory_similarity'] = self.calculate_trajectory_similarity()
        self.validation_metrics['sensor_fidelity'] = self.calculate_sensor_fidelity()
        self.validation_metrics['temporal_alignment'] = self.calculate_temporal_alignment()

        # Calculate overall validation score
        overall_score = np.mean(list(self.validation_metrics.values()))

        # Publish results
        self.publish_validation_results(overall_score)
        self.publish_calibration_status(overall_score)
        self.publish_performance_metrics()
        self.publish_visualization(overall_score)

    def calculate_pose_accuracy(self):
        """Calculate pose accuracy between sim and real"""
        if len(self.sim_pose_buffer) < 2 or len(self.real_pose_buffer) < 2:
            return 0.0

        # Align buffers by timestamp (simplified alignment)
        min_len = min(len(self.sim_pose_buffer), len(self.real_pose_buffer))
        if min_len < 2:
            return 0.0

        sim_poses = list(self.sim_pose_buffer)[-min_len:]
        real_poses = list(self.real_pose_buffer)[-min_len:]

        # Calculate position errors
        position_errors = []
        orientation_errors = []

        for sim_pose, real_pose in zip(sim_poses, real_poses):
            pos_error = math.sqrt(
                (sim_pose['x'] - real_pose['x'])**2 +
                (sim_pose['y'] - real_pose['y'])**2
            )
            position_errors.append(pos_error)

            # Calculate orientation error
            angle_diff = abs(sim_pose['theta'] - real_pose['theta'])
            # Normalize angle difference to [0, π]
            angle_diff = min(angle_diff, 2*math.pi - angle_diff)
            orientation_errors.append(angle_diff)

        # Convert to accuracy scores (lower error = higher accuracy)
        avg_pos_error = np.mean(position_errors)
        avg_orient_error = np.mean(orientation_errors)

        # Convert to scores (higher = better)
        pos_score = max(0.0, min(1.0, 1.0 - avg_pos_error))  # Assuming 1m max error
        orient_score = max(0.0, min(1.0, 1.0 - avg_orient_error/math.pi))  # π rad max error

        return (pos_score + orient_score) / 2.0

    def calculate_trajectory_similarity(self):
        """Calculate how similar the trajectories are"""
        if len(self.sim_pose_buffer) < 5 or len(self.real_pose_buffer) < 5:
            return 0.0

        min_len = min(len(self.sim_pose_buffer), len(self.real_pose_buffer))
        if min_len < 5:
            return 0.0

        sim_poses = list(self.sim_pose_buffer)[-min_len:]
        real_poses = list(self.real_pose_buffer)[-min_len:]

        # Extract trajectories
        sim_traj = np.array([[p['x'], p['y']] for p in sim_poses])
        real_traj = np.array([[p['x'], p['y']] for p in real_poses])

        # Calculate Dynamic Time Warping (DTW) distance as a measure of similarity
        # For simplicity, we'll use a basic distance measure
        if len(sim_traj) != len(real_traj):
            return 0.0

        # Calculate average distance between corresponding points
        distances = np.linalg.norm(sim_traj - real_traj, axis=1)
        avg_distance = np.mean(distances)

        # Convert to similarity score
        similarity_score = max(0.0, min(1.0, 1.0 - avg_distance))  # Assuming 1m max deviation

        return similarity_score

    def calculate_sensor_fidelity(self):
        """Calculate how well sensors match between sim and real"""
        if len(self.sim_scan_buffer) < 1 or len(self.real_scan_buffer) < 1:
            return 0.0

        # Get most recent scans
        sim_scan = self.sim_scan_buffer[-1]
        real_scan = self.real_scan_buffer[-1]

        if len(sim_scan['ranges']) != len(real_scan['ranges']):
            return 0.0

        # Calculate correlation between scans
        sim_ranges = np.array([r for r in sim_scan['ranges'] if not (r != r or r == float('inf'))])  # Remove invalid values
        real_ranges = np.array([r for r in real_scan['ranges'] if not (r != r or r == float('inf'))])

        if len(sim_ranges) != len(real_ranges) or len(sim_ranges) < 10:
            return 0.0

        # Calculate correlation coefficient
        correlation = np.corrcoef(sim_ranges, real_ranges)[0, 1]

        # Convert to fidelity score (handle NaN case)
        if np.isnan(correlation):
            correlation = 0.0

        # Normalize to [0, 1]
        fidelity_score = max(0.0, correlation)

        return fidelity_score

    def calculate_temporal_alignment(self):
        """Calculate temporal alignment between sim and real"""
        if len(self.sim_pose_buffer) < 2 or len(self.real_pose_buffer) < 2:
            return 0.0

        # Calculate average time difference between corresponding poses
        min_len = min(len(self.sim_pose_buffer), len(self.real_pose_buffer))
        if min_len < 2:
            return 0.0

        sim_times = [p['timestamp'].nanosec / 1e9 for p in list(self.sim_pose_buffer)[-min_len:]]
        real_times = [p['timestamp'].nanosec / 1e9 for p in list(self.real_pose_buffer)[-min_len:]]

        # Calculate time differences
        time_diffs = [abs(s - r) for s, r in zip(sim_times, real_times)]
        avg_time_diff = np.mean(time_diffs)

        # Convert to alignment score (lower time diff = better alignment)
        alignment_score = max(0.0, min(1.0, 1.0 - avg_time_diff))  # Assuming 1s max diff

        return alignment_score

    def publish_validation_results(self, overall_score):
        """Publish validation scores"""
        scores_msg = Float64MultiArray()
        scores_msg.data = [
            self.validation_metrics['pose_accuracy'],
            self.validation_metrics['trajectory_similarity'],
            self.validation_metrics['sensor_fidelity'],
            self.validation_metrics['temporal_alignment'],
            overall_score
        ]
        self.validation_score_pub.publish(scores_msg)

    def publish_calibration_status(self, overall_score):
        """Publish calibration status"""
        status_msg = String()

        if overall_score >= 0.9:
            status_msg.data = "CALIBRATED"
        elif overall_score >= 0.7:
            status_msg.data = "GOOD"
        elif overall_score >= 0.5:
            status_msg.data = "FAIR"
        else:
            status_msg.data = "NEEDS_CALIBRATION"

        self.calibration_status_pub.publish(status_msg)

    def publish_performance_metrics(self):
        """Publish performance metrics"""
        uptime = time.time() - self.start_time
        validations_per_sec = self.validation_count / max(uptime, 1.0)

        metrics_msg = Float64MultiArray()
        metrics_msg.data = [
            uptime,
            validations_per_sec,
            float(self.validation_count),
            self.validation_metrics['pose_accuracy'],
            self.validation_metrics['trajectory_similarity']
        ]

        self.performance_pub.publish(metrics_msg)

    def publish_visualization(self, score):
        """Publish visualization marker"""
        marker = Marker()
        marker.header.frame_id = "map"
        marker.header.stamp = self.get_clock().now().to_msg()
        marker.ns = "transfer_validation"
        marker.id = 0
        marker.type = Marker.CYLINDER
        marker.action = Marker.ADD

        marker.pose.position.x = 0.0
        marker.pose.position.y = 0.0
        marker.pose.position.z = 0.5
        marker.pose.orientation.w = 1.0

        # Scale based on score
        marker.scale.x = 0.2 + 0.3 * score  # 0.2 to 0.5m diameter
        marker.scale.y = marker.scale.x
        marker.scale.z = 0.1  # Height

        # Color based on score (green to red)
        marker.color.r = 1.0 - score  # Red for low scores
        marker.color.g = score        # Green for high scores
        marker.color.b = 0.0
        marker.color.a = 0.7

        self.marker_pub.publish(marker)

def main(args=None):
    rclpy.init(args=args)
    validator = TransferValidator()

    try:
        rclpy.spin(validator)
    except KeyboardInterrupt:
        validator.get_logger().info('Shutting down transfer validator')
    finally:
        validator.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Summary

Sim-to-real transfer techniques are essential for bridging the gap between simulation and physical robotics applications. The key concepts covered in this module include:

1. **Domain Randomization**: Training algorithms across varied simulation conditions to improve robustness
2. **System Identification**: Determining real-world parameters to calibrate simulation models
3. **Robust Control**: Designing controllers that maintain performance despite model uncertainties
4. **Edge Optimization**: Adapting transfer techniques for resource-constrained platforms
5. **Validation and Calibration**: Comprehensive frameworks for validating and calibrating sim-to-real systems

The exercises progress from basic domain randomization to advanced validation and calibration techniques, providing students with practical experience in ensuring successful transfer from simulation to reality.

## Exercises

1. Implement a domain randomization framework that trains controllers across multiple randomized simulation conditions
2. Create a system identification system that compares simulation and real behavior to update model parameters
3. ایک مضبوط کنٹرول سسٹم تیار کریں جو ماڈل کی غیر یقینی صورتحال کے باوجود کارکردگی کو برقرار رکھتا ہے
4. NVIDIA جیٹسن اورین نینو پر تعیناتی کے لئے ایک ایج آپٹیمائزڈ سم ٹو ریئل ٹرانسفر سسٹم ڈیزائن کریں
5. سم سے حقیقی منتقلی کی کامیابی کی پیمائش کے لئے ایک جامع توثیق اور انشانکن فریم ورک بنائیں