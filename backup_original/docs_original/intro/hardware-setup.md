---
title: "Hardware Setup Guide"
slug: "/hardware-setup"
sidebar_position: 3
---

# Hardware Setup Guide

This guide provides comprehensive instructions for setting up the hardware platforms used throughout the Physical AI & Humanoid Robotics course. Proper hardware setup is critical for successful completion of simulation-to-reality transfer exercises and physical deployment activities.

## Safety First

:::caution
**CRITICAL SAFETY NOTICE**: All hardware platforms must be operated following documented safety protocols. Never operate robots without proper safety measures in place, including emergency stop procedures and clear operational boundaries. Students must complete safety training before accessing hardware platforms.
:::

Before beginning any hardware setup, ensure you have:
- Completed the safety training module
- Read all safety documentation for each platform
- Identified emergency stop procedures
- Established clear operational boundaries
- Verified power and network requirements

## RTX Workstation Setup

### System Requirements
- **GPU**: NVIDIA RTX 4090, RTX 4080, or equivalent (minimum 24GB VRAM)
- **CPU**: Intel i9-13900K or AMD Ryzen 9 7950X
- **RAM**: 64GB DDR5 (128GB recommended for Isaac Sim)
- **Storage**: 2TB NVMe SSD (primary), 4TB HDD (secondary)
- **OS**: Ubuntu 22.04 LTS or Windows 11 Pro
- **Network**: Gigabit Ethernet (10GbE recommended)

### Installation Steps

1. **Install NVIDIA GPU Drivers**
   ```bash
   # For Ubuntu
   sudo apt update
   sudo apt install nvidia-driver-535 nvidia-utils-535
   sudo reboot

   # Verify installation
   nvidia-smi
   ```

2. **Install CUDA Toolkit**
   ```bash
   wget https://developer.download.nvidia.com/compute/cuda/12.3.0/local_installers/cuda_12.3.0_545.23.06_linux.run
   sudo sh cuda_12.3.0_545.23.06_linux.run
   ```

3. **Configure Environment Variables**
   Add to `~/.bashrc`:
   ```bash
   export PATH=/usr/local/cuda/bin:$PATH
   export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
   ```

4. **Install Isaac Sim Dependencies**
   ```bash
   sudo apt install python3.10-dev python3.10-venv
   sudo apt install build-essential cmake pkg-config
   sudo apt install libgl1-mesa-dev libglx-dev libegl1-mesa-dev
   ```

:::tip
Always verify your GPU has adequate cooling and power supply capacity before running intensive simulation workloads.
:::

## NVIDIA Jetson Orin Nano Setup

### System Requirements
- **Platform**: NVIDIA Jetson Orin Nano Developer Kit (8GB or 16GB)
- **Power**: 19V/65W AC adapter or barrel jack power
- **Network**: Ethernet connection preferred (WiFi acceptable)
- **Storage**: 32GB+ microSD card or eMMC storage
- **OS**: JetPack SDK 5.1.3 or later

### Installation Steps

1. **Flash JetPack SDK**
   - Download JetPack SDK from NVIDIA Developer website
   - Use NVIDIA SDK Manager to flash Jetson Orin Nano
   - Select ROS 2 Humble Hawksbill during installation
   - Ensure CUDA, TensorRT, and OpenCV are included

2. **Initial Configuration**
   ```bash
   # Set up user account and network
   sudo usermod -a -G dialout $USER
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Robotics Dependencies**
   ```bash
   # Install ROS 2 dependencies
   sudo apt install python3-rosdep python3-rosinstall python3-vcstool

   # Initialize rosdep
   sudo rosdep init
   rosdep update
   ```

4. **Configure Hardware Interfaces**
   ```bash
   # Enable I2C, SPI, UART interfaces
   sudo usermod -a -G i2c $USER
   sudo usermod -a -G spi $USER
   sudo usermod -a -G dialout $USER
   ```

5. **Performance Configuration**
   ```bash
   # Set to MAX performance mode
   sudo nvpmodel -m 0
   sudo jetson_clocks
   ```

:::warning
Monitor Jetson Orin Nano temperature during intensive workloads. Ensure adequate cooling is provided to prevent thermal throttling.
:::

## Intel RealSense D435i Setup

### System Requirements
- **Platform**: Any computer with USB 3.0 port
- **OS**: Ubuntu 22.04, Windows 11, or JetPack on Jetson
- **USB**: USB 3.0 Type-A or Type-C port
- **Power**: USB bus power or external power supply

### Installation Steps

1. **Install RealSense SDK**
   ```bash
   # For Ubuntu
   sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key F6E65AC044F831AC80A06380C8B3A55A6F3EFCDE
   sudo add-apt-repository "deb https://librealsense.intel.com/Debian/apt-repo $(lsb_release -cs) main" -u
   sudo apt-get install librealsense2-dkms
   sudo apt-get install librealsense2-dev
   ```

2. **Install ROS 2 Interface**
   ```bash
   cd ~/ros2_ws/src
   git clone -b humble https://github.com/IntelRealSense/realsense-ros.git
   cd ~/ros2_ws
   colcon build --packages-select realsense2_camera
   source install/setup.bash
   ```

3. **Test Camera Connection**
   ```bash
   # Verify camera detection
   rs-enumerate-devices

   # Test with ROS 2
   ros2 launch realsense2_camera rs_launch.py
   ```

4. **Calibration**
   - Use the RealSense viewer for initial calibration
   - Perform extrinsic calibration if mounting on robot
   - Verify depth accuracy with calibration patterns

:::note
The RealSense D435i provides synchronized RGB and depth data. Ensure proper lighting conditions for optimal depth sensing performance.
:::

## Unitree Go2/G1 Setup

### System Requirements
- **Platform**: Unitree Go2 or G1 quadruped robot
- **Controller**: Unitree remote controller or PC with WiFi
- **Network**: 2.4GHz WiFi connection to robot
- **Safety**: Operation area clear of obstacles and personnel

### Initial Setup

1. **Battery Preparation**
   - Charge robot battery to 100% before first use
   - Verify battery health through Unitree app
   - Install battery securely with proper alignment

2. **Network Configuration**
   ```bash
   # Connect to robot's WiFi network
   # Default network: UnitreeGo_XYZ (password: 12345678)
   # Robot IP: 192.168.123.168
   ```

3. **Safety Check**
   - Verify all mechanical connections are secure
   - Check for proper leg alignment
   - Ensure operation area is clear of obstacles
   - Have emergency stop procedure ready

4. **ROS 2 Interface Setup**
   ```bash
   # Install Unitree ROS 2 package
   cd ~/ros2_ws/src
   git clone -b humble https://github.com/unitreerobotics/unitree_ros2.git
   cd ~/ros2_ws
   colcon build --packages-select laikago_ros2 --cmake-args -DCMAKE_BUILD_TYPE=Release
   source install/setup.bash
   ```

5. **Initial Connection Test**
   ```bash
   # Test basic communication
   ros2 launch laikago_ros2 laikago.launch.py
   ```

:::danger
Unitree robots are powerful machines. Never operate without proper safety measures. Maintain safe distance during operation and have emergency stop readily available.
:::

## Network Configuration

### Local Network Setup
For optimal performance, configure your network as follows:

1. **Static IP Assignment**
   ```bash
   # Example for Jetson Orin Nano
   sudo nano /etc/netplan/01-network-manager-all.yaml
   # Configure static IP: 192.168.1.100 (or similar)
   sudo netplan apply
   ```

2. **Firewall Configuration**
   ```bash
   # Open necessary ports for ROS 2 communication
   sudo ufw allow 8080
   sudo ufw allow 11311  # ROS 2 master
   sudo ufw allow 50051  # gRPC for Isaac Sim
   ```

3. **Time Synchronization**
   ```bash
   # Ensure all devices have synchronized time
   sudo timedatectl set-ntp true
   ```

## Troubleshooting Common Issues

### ROS 2 Communication Issues
- Verify network connectivity between devices
- Check ROS_DOMAIN_ID consistency across devices
- Ensure firewall allows necessary ports
- Confirm RMW implementation compatibility

### GPU Memory Issues
- Monitor VRAM usage with `nvidia-smi`
- Reduce simulation complexity if needed
- Close unnecessary applications
- Consider using CUDA memory management

### RealSense Depth Issues
- Ensure adequate lighting conditions
- Clean camera lenses regularly
- Check for reflective surfaces causing artifacts
- Verify USB bandwidth is sufficient

### Jetson Power Management
- Use MAX performance mode for intensive tasks
- Monitor thermal conditions
- Ensure adequate cooling
- Check power supply capacity

## Maintenance and Care

### Regular Maintenance
- Clean all optical sensors regularly
- Check mechanical connections on robots
- Update firmware and software regularly
- Backup important configurations

### Storage Management
- Regularly clean simulation cache files
- Monitor disk space on all devices
- Archive completed projects
- Maintain version control for all code

## ہارڈ ویئر کی وضاحتیں خلاصہ

| اجزاء | ماڈل | کلیدی چشمی | مقصد |
| ----------- | ------- | ----------- | --------- |
| GPU | RTX 4090 | 24 جی بی وی آر اے ایم ، کوڈا 8.9 | نقالی ، AI تخفیف |
| ایج AI | جیٹسن اورین نینو | 8GB/16GB ، 100TOPS | جسمانی تعیناتی |
| گہرائی کیمرا | REALSENSE D435I | RGB + گہرائی ، IMU | خیال |
| روبوٹ | یونٹری GO2/G1 | چوکور ، 2m/s | جسمانی AI توثیق |

یہ ہارڈ ویئر سیٹ اپ تخروپن سے حقیقی دنیا کی تعیناتی تک مکمل جسمانی AI ڈویلپمنٹ پائپ لائن کو قابل بناتا ہے ، جو نظریہ → ڈیجیٹل جڑواں → جسمانی تعیناتی تدریسی نقطہ نظر کی حمایت کرتا ہے۔