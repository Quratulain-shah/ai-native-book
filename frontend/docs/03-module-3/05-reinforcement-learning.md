---
sidebar_position: 5
---

# Reinforcement Learning: Introduction to RL for Robot Control

## Theory

Reinforcement Learning (RL) is a machine learning paradigm where an agent learns to make decisions by interacting with an environment to maximize cumulative rewards. In robotics, RL enables robots to learn complex behaviors and control policies through trial and error, making it particularly suitable for tasks where traditional control methods are difficult to implement.

### Key RL Concepts

- **Agent**: The learning entity (the robot)
- **Environment**: The world in which the agent operates
- **State (s)**: The current situation of the agent
- **Action (a)**: What the agent can do
- **Reward (r)**: Feedback from the environment
- **Policy (π)**: Strategy for selecting actions
- **Value Function (V)**: Expected future rewards from a state
- **Q-Function (Q)**: Expected future rewards for state-action pairs

### RL in Robotics Context

- **Continuous Action Spaces**: Robot control often involves continuous motor commands
- **High-Dimensional State Spaces**: Multiple sensors provide rich state information
- **Real-time Constraints**: Robots must make decisions quickly
- **Safety Requirements**: Learning must be safe for both robot and environment
- **Sample Efficiency**: Limited real-world training time requires efficient learning

### RL Algorithm Categories

- **Model-Free RL**: Direct learning without environmental model (DQN, PPO, SAC)
- **Model-Based RL**: Learning environmental dynamics for planning (MBPO, PETS)
- **Actor-Critic Methods**: Combining policy and value learning (A3C, PPO, SAC)
- **Hierarchical RL**: Learning at multiple levels of abstraction

## Sim (Simulation Lab)

### Setting up RL Environment for Robotics

1. **Gym Environment Creation**
   ```bash
   # Install required packages
   pip install gymnasium[box2d] stable-baselines3[extra] torch torchvision torchaudio

   # Create custom robotics environment
   mkdir -p ~/rl_robotics_env/src
   cd ~/rl_robotics_env/src
   ```

2. **Example: Simple Navigation Environment**
   ```python
   # navigation_env.py
   import gymnasium as gym
   from gymnasium import spaces
   import numpy as np
   import math

   class SimpleNavigationEnv(gym.Env):
       """Simple navigation environment for RL training"""

       def __init__(self):
           super(SimpleNavigationEnv, self).__init__()

           # Define action space: [linear_vel, angular_vel]
           self.action_space = spaces.Box(
               low=np.array([-1.0, -1.0], dtype=np.float32),
               high=np.array([1.0, 1.0], dtype=np.float32),
               dtype=np.float32
           )

           # Define observation space: [x, y, theta, goal_x, goal_y, obstacle_x, obstacle_y]
           self.observation_space = spaces.Box(
               low=np.array([-10, -10, -np.pi, -10, -10, -10, -10], dtype=np.float32),
               high=np.array([10, 10, np.pi, 10, 10, 10, 10], dtype=np.float32),
               dtype=np.float32
           )

           # Initialize state
           self.robot_pos = np.array([0.0, 0.0])
           self.robot_theta = 0.0
           self.goal_pos = np.array([5.0, 5.0])
           self.obstacle_pos = np.array([2.5, 2.5])
           self.max_steps = 1000
           self.current_step = 0

       def reset(self, seed=None, options=None):
           super().reset(seed=seed)

           # Randomize starting position
           self.robot_pos = np.random.uniform(-2, 2, size=2)
           self.robot_theta = np.random.uniform(-np.pi, np.pi)
           self.goal_pos = np.array([5.0, 5.0])
           self.obstacle_pos = np.array([2.5, 2.5])
           self.current_step = 0

           return self._get_observation(), {}

       def step(self, action):
           # Extract actions
           linear_vel = np.clip(action[0], -1.0, 1.0)
           angular_vel = np.clip(action[1], -1.0, 1.0)

           # Update robot state
           dt = 0.1  # Time step
           self.robot_theta += angular_vel * dt
           self.robot_pos[0] += linear_vel * np.cos(self.robot_theta) * dt
           self.robot_pos[1] += linear_vel * np.sin(self.robot_theta) * dt

           # Calculate reward
           reward = self._calculate_reward()

           # Check termination
           terminated = self._check_termination()
           self.current_step += 1
           truncated = self.current_step >= self.max_steps

           return self._get_observation(), reward, terminated, truncated, {}

       def _get_observation(self):
           return np.concatenate([
               self.robot_pos,
               [self.robot_theta],
               self.goal_pos,
               self.obstacle_pos
           ])

       def _calculate_reward(self):
           # Distance to goal
           dist_to_goal = np.linalg.norm(self.robot_pos - self.goal_pos)

           # Distance to obstacle (penalize being too close)
           dist_to_obstacle = np.linalg.norm(self.robot_pos - self.obstacle_pos)
           obstacle_penalty = max(0, 1 - dist_to_obstacle) * 5 if dist_to_obstacle < 1.0 else 0

           # Reward is negative distance to goal minus obstacle penalty
           reward = -dist_to_goal - obstacle_penalty

           # Bonus for reaching goal
           if dist_to_goal < 0.5:
               reward += 100

           return reward

       def _check_termination(self):
           dist_to_goal = np.linalg.norm(self.robot_pos - self.goal_pos)
           return dist_to_goal < 0.5
   ```

3. **Training an RL Agent**
   ```python
   # train_navigation_agent.py
   import gymnasium as gym
   from stable_baselines3 import PPO
   from stable_baselines3.common.env_util import make_vec_env
   from stable_baselines3.common.callbacks import EvalCallback
   import os

   # Create environment
   env = make_vec_env(lambda: SimpleNavigationEnv(), n_envs=4)

   # Create RL agent
   model = PPO(
       "MlpPolicy",
       env,
       verbose=1,
       tensorboard_log="./ppo_navigation_tensorboard/",
       learning_rate=3e-4,
       n_steps=2048,
       batch_size=64,
       n_epochs=10,
       gamma=0.99,
       gae_lambda=0.95,
       clip_range=0.2,
       ent_coef=0.01
   )

   # Train the agent
   model.learn(total_timesteps=100000)

   # Save the trained model
   model.save("ppo_navigation_agent")

   # Test the trained agent
   obs = env.reset()
   for i in range(1000):
       action, _states = model.predict(obs)
       obs, rewards, dones, info = env.step(action)
   ```

### Advanced RL Algorithms for Robotics

1. **Soft Actor-Critic (SAC) for Continuous Control**
   ```python
   from stable_baselines3 import SAC

   model = SAC(
       "MlpPolicy",
       env,
       verbose=1,
       learning_rate=3e-4,
       buffer_size=1000000,
       learning_starts=1000,
       batch_size=256,
       tau=0.005,
       gamma=0.99,
       train_freq=1,
       gradient_steps=1,
       ent_coef='auto',
       target_update_interval=1,
       target_entropy='auto',
       use_sde=True,
       sde_sample_freq=-1,
       optimize_memory_usage=True,
   )
   ```

2. **Twin Delayed DDPG (TD3) for Robust Control**
   ```python
   from stable_baselines3 import TD3
   from stable_baselines3.td3 import MlpPolicy

   model = TD3(
       MlpPolicy,
       env,
       learning_rate=1e-3,
       buffer_size=1000000,
       learning_starts=10000,
       batch_size=100,
       tau=0.005,
       gamma=0.99,
       train_freq=(1, "episode"),
       gradient_steps=-1,
       action_noise=None,
       replay_buffer_class=None,
       replay_buffer_kwargs=None,
       optimize_memory_usage=False,
       policy_delay=2,
       target_policy_noise=0.2,
       target_noise_clip=0.5,
       create_eval_env=False,
       policy_kwargs=None,
       verbose=0,
       seed=None,
       device="auto",
       _init_setup_model=True,
   )
   ```

## Real (Physical Deployment)

### Deploying RL on Jetson Orin Nano

1. **Optimizing RL Models for Edge Deployment**
   ```bash
   # Install optimized inference libraries
   pip install onnx onnxruntime-gpu  # For optimized inference on Jetson

   # Convert trained model to ONNX format
   python convert_to_onnx.py --model-path ppo_navigation_agent.zip
   ```

2. **Example: Optimized Inference on Jetson**
   ```python
   # jetson_rl_inference.py
   import numpy as np
   import onnxruntime as ort
   import rospy
   from geometry_msgs.msg import Twist
   from sensor_msgs.msg import LaserScan
   from nav_msgs.msg import Odometry

   class JetsonRLInference:
       def __init__(self):
           rospy.init_node('rl_navigation_controller')

           # Load ONNX model for optimized inference
           self.session = ort.InferenceSession(
               "ppo_navigation_agent.onnx",
               providers=['CUDAExecutionProvider', 'CPUExecutionProvider']
           )

           # Publishers and subscribers
           self.cmd_vel_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
           self.odom_sub = rospy.Subscriber('/odom', Odometry, self.odom_callback)
           self.scan_sub = rospy.Subscriber('/scan', LaserScan, self.scan_callback)

           # Robot state
           self.current_pose = None
           self.laser_data = None
           self.rate = rospy.Rate(10)  # 10 Hz control rate

       def odom_callback(self, msg):
           self.current_pose = msg.pose.pose

       def scan_callback(self, msg):
           self.laser_data = msg.ranges

       def get_observation(self):
           """Convert robot state to observation format expected by RL model"""
           if self.current_pose is None or self.laser_data is None:
               return np.zeros(37)  # Return zero observation if data unavailable

           # Example: combine pose and laser data
           pose_x = self.current_pose.position.x
           pose_y = self.current_pose.position.y
           # ... extract other pose components

           # Process laser data (take every 10th reading to reduce dimensionality)
           processed_laser = [r if r < 10.0 else 10.0 for r in self.laser_data[::10]]

           # Combine all observations
           observation = np.concatenate([
               [pose_x, pose_y],  # Robot position
               processed_laser    # Processed laser readings
           ])

           return observation

       def run(self):
           while not rospy.is_shutdown():
               # Get current observation
               obs = self.get_observation()

               # Get action from RL model
               input_name = self.session.get_inputs()[0].name
               action = self.session.run(None, {input_name: obs.reshape(1, -1)})[0][0]

               # Convert action to Twist message
               cmd_vel = Twist()
               cmd_vel.linear.x = action[0]  # Linear velocity
               cmd_vel.angular.z = action[1]  # Angular velocity

               # Publish command
               self.cmd_vel_pub.publish(cmd_vel)

               self.rate.sleep()

   if __name__ == '__main__':
       controller = JetsonRLInference()
       controller.run()
   ```

3. **Safety Considerations for Physical Deployment**
   ```python
   class SafeRLController:
       def __init__(self):
           self.max_linear_vel = 0.5  # Limit speed for safety
           self.max_angular_vel = 0.5
           self.emergency_stop_distance = 0.3  # Stop if obstacle closer than 0.3m

       def apply_safety_constraints(self, action, laser_data):
           """Apply safety constraints to RL actions"""
           linear_vel = np.clip(action[0], -self.max_linear_vel, self.max_linear_vel)
           angular_vel = np.clip(action[1], -self.max_angular_vel, self.max_angular_vel)

           # Emergency stop if too close to obstacles
           min_distance = min(laser_data) if laser_data else float('inf')
           if min_distance < self.emergency_stop_distance:
               linear_vel = 0.0
               angular_vel = 0.0

           return np.array([linear_vel, angular_vel])
   ```

### Real-world RL Training Strategies

1. **Sim-to-Real Transfer**
   - Use domain randomization in simulation
   - Implement system identification techniques
   - Use transfer learning approaches

2. **Safe Exploration**
   - Use constrained RL algorithms
   - Implement curriculum learning
   - Use human demonstrations for initial guidance

3. **Sample Efficiency**
   - Use experience replay
   - Implement curriculum learning
   - Use model-based RL approaches

### Example: Complete RL Training Pipeline

```python
# complete_rl_pipeline.py
import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env
from stable_baselines3.common.callbacks import EvalCallback, StopTrainingOnRewardThreshold
from stable_baselines3.common.monitor import Monitor
import numpy as np

class RLPipeline:
    def __init__(self, env_class, model_class=PPO, model_params=None):
        self.env_class = env_class
        self.model_class = model_class
        self.model_params = model_params or {}

    def create_env(self, n_envs=4):
        """Create vectorized environment for training"""
        return make_vec_env(
            lambda: Monitor(self.env_class()),
            n_envs=n_envs
        )

    def create_eval_callback(self, eval_env, reward_threshold=200):
        """Create evaluation callback for early stopping"""
        stop_callback = StopTrainingOnRewardThreshold(
            reward_threshold=reward_threshold,
            verbose=1
        )

        eval_callback = EvalCallback(
            eval_env,
            callback_on_new_best=None,
            n_eval_episodes=5,
            best_model_save_path="./logs/",
            log_path="./logs/",
            eval_freq=1000,
            callback_after_eval=stop_callback
        )

        return eval_callback

    def train(self, total_timesteps=100000, save_path="trained_model"):
        """Train the RL agent"""
        # Create training and evaluation environments
        train_env = self.create_env(n_envs=4)
        eval_env = self.create_env(n_envs=1)

        # Create model
        model = self.model_class(
            "MlpPolicy",
            train_env,
            verbose=1,
            tensorboard_log="./tensorboard_logs/",
            **self.model_params
        )

        # Create evaluation callback
        eval_callback = self.create_eval_callback(eval_env)

        # Train the model
        model.learn(
            total_timesteps=total_timesteps,
            callback=eval_callback,
            progress_bar=True
        )

        # Save the trained model
        model.save(save_path)
        return model

# Usage example
if __name__ == "__main__":
    pipeline = RLPipeline(SimpleNavigationEnv)
    trained_model = pipeline.train(total_timesteps=200000, save_path="ppo_navigation_final")
```

## Troubleshooting

1. **Training Instability**: Adjust learning rate, increase batch size, or use gradient clipping
2. **Poor Convergence**: Check reward shaping, increase training time, or try different algorithms
3. **Overfitting**: Use regularization, add noise, or implement cross-validation
4. **Safety Issues**: Implement safety constraints and emergency stops

## Exercises

1. **Environment Setup**: Create a custom RL environment for a specific robot task
2. **Algorithm Comparison**: Compare different RL algorithms (PPO, SAC, TD3) on the same task
3. **Hyperparameter Tuning**: Optimize hyperparameters for better performance
4. **Simulation to Real**: Implement domain randomization for sim-to-real transfer
5. **Safety Implementation**: Add safety constraints to the RL controller