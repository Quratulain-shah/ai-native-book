---
sidebar_position: 4
---

# Navigation2 Systems: Path Planning and Obstacle Avoidance for Humanoids

## Theory

Navigation2 (Nav2) is the next-generation navigation framework for ROS 2, designed for autonomous mobile robots. It provides a complete solution for path planning, obstacle avoidance, and navigation in complex environments. For humanoid robots, Nav2 requires special considerations due to their unique kinematics and dynamics.

### Core Nav2 Components

- **Global Planner**: Creates optimal paths from start to goal (e.g., A*, Dijkstra, RRT*)
- **Local Planner**: Executes paths while avoiding obstacles in real-time (e.g., DWA, TEB, MPC)
- **Costmap**: Represents obstacles and navigable space in 2D/3D maps
- **Controller**: Low-level control for robot motion execution
- **Recovery Behaviors**: Strategies for handling navigation failures

### Humanoid-Specific Navigation Challenges

- **Complex Kinematics**: Multi-degree-of-freedom leg systems
- **Dynamic Stability**: Maintaining balance during movement
- **Step Planning**: Navigating over obstacles and stairs
- **Terrain Adaptation**: Handling uneven surfaces and slopes
- **Upper Body Considerations**: Arm and torso movements during navigation

### Navigation Pipeline

```
Goal → Global Planner → Path → Local Planner → Commands → Robot
        ↓              ↓         ↓             ↓
    Costmap (Static)  Costmap (Global)  Costmap (Local)  Sensors
```

## Sim (Simulation Lab)

### Setting up Nav2 for Humanoid Simulation

1. **Navigation Stack Configuration**
   ```bash
   # Create navigation configuration files
   mkdir -p ~/nav2_ws/src/nav2_humanoid_config
   cd ~/nav2_ws/src/nav2_humanoid_config

   # Create costmap parameters
   # local_costmap_params.yaml
   local_costmap:
     local_costmap:
       ros__parameters:
         update_frequency: 10.0
         publish_frequency: 5.0
         global_frame: odom
         robot_base_frame: base_link
         use_sim_time: true
         rolling_window: true
         width: 10
         height: 10
         resolution: 0.05
         plugins: ["voxel_layer", "inflation_layer"]
         inflation_layer:
           plugin: "nav2_costmap_2d::InflationLayer"
           inflation_radius: 1.0
           cost_scaling_factor: 3.0

   # global_costmap_params.yaml
   global_costmap:
     global_costmap:
       ros__parameters:
         update_frequency: 1.0
         publish_frequency: 1.0
         global_frame: map
         robot_base_frame: base_link
         use_sim_time: true
         rolling_window: false
         plugins: ["static_layer", "obstacle_layer", "inflation_layer"]
         inflation_layer:
           plugin: "nav2_costmap_2d::InflationLayer"
           inflation_radius: 2.0
           cost_scaling_factor: 3.0
   ```

2. **Launch Nav2 in Simulation**
   ```bash
   # Launch Nav2 with simulation-specific parameters
   ros2 launch nav2_bringup navigation_launch.py \
     use_sim_time:=true \
     params_file:=install/nav2_humanoid_config/share/config/nav2_params.yaml

   # Launch RViz for visualization
   ros2 launch nav2_bringup rviz_launch.py
   ```

3. **Testing Navigation Behaviors**
   ```bash
   # Send navigation goal programmatically
   ros2 run nav2_msgs send_goal.py 1.0 1.0 0.0

   # Monitor navigation topics
   ros2 topic echo /local_costmap/costmap
   ros2 topic echo /global_costmap/costmap
   ros2 topic echo /nav_through_poses/_action/status
   ```

### Example: Humanoid-Specific Navigation Configuration

```yaml
# nav2_params.yaml - Humanoid-specific configuration
amcl:
  ros__parameters:
    use_sim_time: True
    alpha1: 0.2
    alpha2: 0.2
    alpha3: 0.2
    alpha4: 0.2
    alpha5: 0.2
    base_frame_id: "base_link"
    beam_skip_distance: 0.5
    beam_skip_error_threshold: 0.9
    beam_skip_threshold: 0.3
    do_beamskip: false
    global_frame_id: "map"
    lambda_short: 0.1
    laser_likelihood_max_dist: 2.0
    laser_max_range: 100.0
    laser_min_range: -1.0
    laser_model_type: "likelihood_field"
    max_beams: 60
    max_particles: 2000
    min_particles: 500
    odom_frame_id: "odom"
    pf_err: 0.05
    pf_z: 0.99
    recovery_alpha_fast: 0.0
    recovery_alpha_slow: 0.0
    resample_interval: 1
    robot_model_type: "nav2_amcl::DifferentialMotionModel"
    save_pose_rate: 0.5
    sigma_hit: 0.2
    tf_broadcast: true
    transform_tolerance: 1.0
    update_min_a: 0.2
    update_min_d: 0.1
    z_hit: 0.5
    z_max: 0.05
    z_rand: 0.5
    z_short: 0.05

bt_navigator:
  ros__parameters:
    use_sim_time: True
    global_frame: map
    robot_base_frame: base_link
    odom_topic: /odom
    bt_loop_duration: 10
    default_server_timeout: 20
    enable_groot_monitoring: True
    groot_zmq_publisher_port: 1666
    groot_zmq_server_port: 1667
    # Humanoid-specific behavior tree
    # Custom BT for humanoid navigation
    plugin_lib_names:
    - nav2_compute_path_to_pose_action_bt_node
    - nav2_compute_path_through_poses_action_bt_node
    - nav2_follow_path_action_bt_node
    - nav2_spin_action_bt_node
    - nav2_wait_action_bt_node
    - nav2_assisted_teleop_action_bt_node
    - nav2_back_up_action_bt_node
    - nav2_drive_on_heading_bt_node
    - nav2_clear_costmap_service_bt_node
    - nav2_is_stuck_condition_bt_node
    - nav2_goal_reached_condition_bt_node
    - nav2_goal_updated_condition_bt_node
    - nav2_initial_pose_received_condition_bt_node
    - nav2_reinitialize_global_localization_service_bt_node
    - nav2_rate_controller_bt_node
    - nav2_distance_controller_bt_node
    - nav2_speed_controller_bt_node
    - nav2_truncate_path_action_bt_node
    - nav2_truncate_path_local_action_bt_node
    - nav2_goal_updater_node_bt_node
    - nav2_recovery_node_bt_node
    - nav2_pipeline_sequence_bt_node
    - nav2_round_robin_node_bt_node
    - nav2_transform_available_condition_bt_node
    - nav2_time_expired_condition_bt_node
    - nav2_path_expiring_timer_condition
    - nav2_distance_traveled_condition_bt_node
    - nav2_single_trigger_bt_node
    - nav2_is_battery_low_condition_bt_node
    - nav2_navigate_through_poses_action_bt_node
    - nav2_navigate_to_pose_action_bt_node
    - nav2_remove_passed_goals_action_bt_node
    - nav2_planner_selector_bt_node
    - nav2_controller_selector_bt_node
    - nav2_goal_checker_selector_bt_node

controller_server:
  ros__parameters:
    use_sim_time: True
    controller_frequency: 20.0
    min_x_velocity_threshold: 0.001
    min_y_velocity_threshold: 0.5
    min_theta_velocity_threshold: 0.001
    # Humanoid-specific controllers
    # For humanoid robots, we may need custom controllers
    progress_checker_plugin: "progress_checker"
    goal_checker_plugin: "goal_checker"
    controller_plugins: ["FollowPath"]

    # Humanoid-specific path follower
    FollowPath:
      plugin: "nav2_mppi_controller::MPPIController"
      time_steps: 50
      model_dt: 0.05
      batch_size: 1000
      vx_std: 0.2
      vy_std: 0.2
      wz_std: 0.3
      vx_max: 0.5
      vx_min: -0.15
      vy_max: 0.5
      wz_max: 1.0
      xy_goal_tolerance: 0.25
      yaw_goal_tolerance: 0.25
      stateful: True
      progress_checker:
        plugin: "nav2_controller::SimpleProgressChecker"
        required_movement_radius: 0.5
        movement_time_allowance: 10.0
      goal_checker:
        plugin: "nav2_controller::SimpleGoalChecker"
        xy_goal_tolerance: 0.25
        yaw_goal_tolerance: 0.25
        stateful: True

local_costmap:
  local_costmap:
    ros__parameters:
      update_frequency: 10.0
      publish_frequency: 5.0
      global_frame: odom
      robot_base_frame: base_link
      use_sim_time: True
      rolling_window: True
      width: 10
      height: 10
      resolution: 0.05
      robot_radius: 0.3  # Humanoid-specific radius
      plugins: ["obstacle_layer", "voxel_layer", "inflation_layer"]
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 3.0
        inflation_radius: 1.0
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        enabled: True
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
      voxel_layer:
        plugin: "nav2_costmap_2d::VoxelLayer"
        enabled: True
        publish_voxel_map: True
        origin_z: 0.0
        z_resolution: 0.05
        z_voxels: 16
        max_obstacle_height: 2.0
        mark_threshold: 0
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"

global_costmap:
  global_costmap:
    ros__parameters:
      update_frequency: 1.0
      publish_frequency: 1.0
      global_frame: map
      robot_base_frame: base_link
      use_sim_time: True
      robot_radius: 0.3  # Humanoid-specific radius
      resolution: 0.05
      plugins: ["static_layer", "obstacle_layer", "inflation_layer"]
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 3.0
        inflation_radius: 2.0
      static_layer:
        plugin: "nav2_costmap_2d::StaticLayer"
        map_subscribe_transient_local: True
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        enabled: True
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"

planner_server:
  ros__parameters:
    expected_planner_frequency: 20.0
    planner_plugins: ["GridBased"]
    GridBased:
      plugin: "nav2_navfn_planner::NavfnPlanner"
      tolerance: 0.5
      use_astar: false
      allow_unknown: true
```

### Example: Navigation with Humanoid-Specific Constraints

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped
from nav2_msgs.action import NavigateToPose
from rclpy.action import ActionClient
import math

class HumanoidNavigation(Node):
    def __init__(self):
        super().__init__('humanoid_navigation')

        # Action client for navigation
        self.nav_client = ActionClient(
            self,
            NavigateToPose,
            'navigate_to_pose'
        )

        # Publisher for visualization
        self.goal_pub = self.create_publisher(PoseStamped, 'goal_pose', 10)

    def send_goal(self, x, y, theta):
        """Send navigation goal with humanoid-specific constraints"""
        # Wait for action server
        self.nav_client.wait_for_server()

        # Create goal message
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = 'map'
        goal_msg.pose.header.stamp = self.get_clock().now().to_msg()

        goal_msg.pose.pose.position.x = x
        goal_msg.pose.pose.position.y = y
        goal_msg.pose.pose.position.z = 0.0  # Humanoid navigation is 2D for now

        # Convert angle to quaternion
        goal_msg.pose.pose.orientation.z = math.sin(theta / 2.0)
        goal_msg.pose.pose.orientation.w = math.cos(theta / 2.0)

        # Send goal
        self.nav_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )

        # Publish for visualization
        pose_stamped = PoseStamped()
        pose_stamped.header = goal_msg.pose.header
        pose_stamped.pose = goal_msg.pose.pose
        self.goal_pub.publish(pose_stamped)

    def feedback_callback(self, feedback_msg):
        """Handle navigation feedback"""
        feedback = feedback_msg.feedback
        self.get_logger().info(f'Navigation progress: {feedback.distance_remaining:.2f}m remaining')

def main(args=None):
    rclpy.init(args=args)
    nav_node = HumanoidNavigation()

    # Example: Navigate to position (2.0, 2.0) with orientation 0
    nav_node.send_goal(2.0, 2.0, 0.0)

    try:
        rclpy.spin(nav_node)
    except KeyboardInterrupt:
        pass
    finally:
        nav_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Real (Physical Deployment)

### Deploying Nav2 on Unitree Humanoid Robots

1. **Hardware Integration**
   ```bash
   # Launch Unitree robot bringup
   ros2 launch unitree_ros2_driver unitree_driver.launch.py

   # Launch navigation stack with Unitree-specific parameters
   ros2 launch nav2_unitree_bringup navigation.launch.py
   ```

2. **Humanoid-Specific Navigation Configuration**
   ```bash
   # Configure for Unitree Go2/G1 specific dimensions and capabilities
   ros2 param set /local_costmap/local_costmap/robot_radius 0.25  # Adjust for specific robot
   ros2 param set /global_costmap/global_costmap/robot_radius 0.25

   # Set appropriate speed limits for humanoid stability
   ros2 param set /controller_server/FollowPath/vx_max 0.3  # Lower for stability
   ros2 param set /controller_server/FollowPath/wz_max 0.5  # Limited turning for balance
   ```

3. **Safety and Stability Considerations**
   - Implement balance-aware navigation
   - Limit maximum speeds for stability
   - Add step planning for terrain navigation
   - Monitor robot health during navigation

### Unitree-Specific Navigation Pipeline

```bash
# Complete launch file for Unitree navigation
# unitree_nav2.launch.py

from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import IncludeLaunchDescription, DeclareLaunchArgument
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    # Launch arguments
    use_sim_time = LaunchConfiguration('use_sim_time', default='false')
    params_file = LaunchConfiguration('params_file')

    # Include Unitree robot bringup
    unitree_bringup = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            PathJoinSubstitution([
                FindPackageShare('unitree_ros2_driver'),
                'launch',
                'unitree_driver.launch.py'
            ])
        ])
    )

    # Navigation2 stack
    navigation = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            PathJoinSubstitution([
                FindPackageShare('nav2_bringup'),
                'launch',
                'navigation_launch.py'
            ])
        ]),
        launch_arguments={
            'use_sim_time': use_sim_time,
            'params_file': params_file
        }.items()
    )

    # Custom humanoid controller
    humanoid_controller = Node(
        package='humanoid_navigation',
        executable='balance_controller',
        name='balance_controller',
        parameters=[
            {'use_sim_time': use_sim_time},
            {'max_step_height': 0.15},  # Maximum step height for Unitree robots
            {'balance_threshold': 0.2},  # Balance maintenance threshold
            {'stability_check_rate': 10.0}
        ],
        remappings=[
            ('/cmd_vel', '/unitree/cmd_vel'),
            ('/odom', '/unitree/odom'),
            ('/imu', '/unitree/imu')
        ]
    )

    return LaunchDescription([
        unitree_bringup,
        navigation,
        humanoid_controller
    ])
```

### Real-time Navigation Considerations

- **Balance Maintenance**: Ensure navigation commands maintain robot stability
- **Terrain Adaptation**: Adjust navigation for uneven surfaces
- **Obstacle Height**: Consider 3D obstacle avoidance for humanoid robots
- **Step Planning**: Plan foot placements for stair navigation

### Performance Optimization

- **Path Smoothing**: Apply smoothing algorithms for natural humanoid movement
- **Dynamic Reconfiguration**: Adjust parameters based on terrain
- **Multi-level Planning**: Combine high-level path planning with low-level step planning

## Troubleshooting

1. **Navigation Failures**: Check costmap configuration and obstacle detection
2. **Oscillation**: Adjust controller parameters and costmap inflation
3. **Performance Issues**: Optimize costmap resolution and update rates
4. **Stability Problems**: Implement balance-aware navigation constraints

## Exercises

1. **Nav2 Configuration**: Set up Nav2 with humanoid-specific parameters
2. **Path Planning**: Test global and local planners in various environments
3. **Obstacle Avoidance**: Implement dynamic obstacle avoidance
4. **Unitree Integration**: Deploy navigation on Unitree robot simulation
5. **Stability Analysis**: Evaluate navigation performance with balance constraints
