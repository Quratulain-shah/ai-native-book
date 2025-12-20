---
title: "URDF ماڈلنگ: یونیورسال روبوٹک ڈیسکرپشن فارمیٹ"
slug: "/ur/urdf-modeling"
sidebar_position: 4
---

# URDF ماڈلنگ: یونیورسال روبوٹک ڈیسکرپشن فارمیٹ

## URDF کیا ہے؟

URDF (Universal Robot Description Format) ایک XML فارمیٹ ہے جو ROS 2 میں روبوٹس کے جسمانی اور مواصلاتی ماڈل کی وضاحت کے لیے استعمال ہوتا ہے۔ URDF فائلز روبوٹ کے لیے جسمانی ساخت، سینسرز، اور دیگر کمپوننٹس کی تفصیل فراہم کرتی ہیں۔

## URDF کی خصوصیات

### 1. جسمانی ساخت

URDF روبوٹ کی جسمانی ساخت کی وضاحت کرتا ہے، بشمول:
- لینکس (Links): روبوٹ کے جسمانی حصار
- جوائنٹس (Joints): لینکس کے مابین مواصلات
- سینسرز (Sensors): سینسرز کی جگہ اور خصوصیات

### 2. وژولائزیشن

URDF ماڈلز 3D ویژولائزیشن کے لیے استعمال ہوتے ہیں:
- rviz2 میں روبوٹ کا مodel
- گیزبو سیمیولیشن میں فزیکل ماڈل
- ڈیزائن کی تصدیق

### 3. سیمیولیشن

URDF ماڈلز سیمیولیشن کے لیے استعمال ہوتے ہیں:
- گیزبو میں فزیکل خصوصیات
- سینسر سیمیولیشن
- کنٹرول الگورتھم ٹیسٹنگ

## URDF فائل کی ساخت

ایک URDF فائل XML فارمیٹ میں ہوتی ہے اور اس کی مندرجہ ذیل ساخت ہوتی ہے:

```xml
<?xml version="1.0"?>
<robot name="robot_name">
  <!-- لینکس کی وضاحت -->
  <link name="link_name">
    <visual>
      <geometry>
        <box size="1 1 1"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <box size="1 1 1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1"/>
      <inertia ixx="1" ixy="0" ixz="0" iyy="1" iyz="0" izz="1"/>
    </inertial>
  </link>

  <!-- جوائنٹس کی وضاحت -->
  <joint name="joint_name" type="revolute">
    <parent link="parent_link"/>
    <child link="child_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
  </joint>
</robot>
```

## URDF لینکس

### لینک کی وضاحت

ہر لینک روبوٹ کا ایک جسمانی حصار ہے:

```xml
<link name="base_link">
  <visual>
    <geometry>
      <cylinder radius="0.1" length="0.2"/>
    </geometry>
    <material name="blue">
      <color rgba="0 0 1 1"/>
    </material>
  </visual>
  <collision>
    <geometry>
      <cylinder radius="0.1" length="0.2"/>
    </geometry>
  </collision>
  <inertial>
    <mass value="1"/>
    <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
  </inertial>
</link>
```

### لینک کے اجزاء

1. **وژول**: 3D ویژولائزیشن کے لیے استعمال ہوتا ہے
2. **کولیژن**: فزیکل کولیژن ڈیٹیکشن کے لیے استعمال ہوتا ہے
3. **انیشل**: ڈائنامکس کیلکولیشن کے لیے استعمال ہوتا ہے

## URDF جوائنٹس

### جوائنٹ کی وضاحت

جوائنٹس لینکس کے مابین مواصلات کی وضاحت کرتے ہیں:

```xml
<joint name="joint_name" type="revolute">
  <parent link="base_link"/>
  <child link="arm_link"/>
  <origin xyz="0 0 0.1" rpy="0 0 0"/>
  <axis xyz="0 0 1"/>
  <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
</joint>
```

### جوائنٹ کی اقسام

1. **ریوولوٹ (Revolute)**: گھومنے والا جوائنٹ، محدود حرکت
2. **کونٹنیوئس (Continuous)**: لامحدود گھومنے والا جوائنٹ
3. **پریسمیٹک (Prismatic)**: لکیری حرکت والے جوائنٹ
4. **فکسڈ (Fixed)**: غیر متحرک جوائنٹ
5. **فلوٹنگ (Floating)**: 6-ڈویلیوشن حرکت
6. **پلنر (Planar)**: 2-ڈویلیوشن حرکت

## URDF سینسرز

### سینسر کی وضاحت

URDF میں سینسرز کی وضاحت بھی کی جا سکتی ہے:

```xml
<joint name="camera_joint" type="fixed">
  <parent link="base_link"/>
  <child link="camera_link"/>
  <origin xyz="0.1 0 0.1" rpy="0 0 0"/>
</joint>

<link name="camera_link">
  <visual>
    <geometry>
      <box size="0.05 0.05 0.05"/>
    </geometry>
  </visual>
  <sensor name="camera" type="camera">
    <camera>
      <horizontal_fov>1.089</horizontal_fov>
      <image>
        <width>640</width>
        <height>480</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.1</near>
        <far>100</far>
      </clip>
    </camera>
  </sensor>
</link>
```

## URDF اور Xacro

Xacro URDF کے لیے ایک XML ماکرو لینگویج ہے جو URDF کو زیادہ قابل استعمال اور زیادہ آسان بنا دیتا ہے:

### Xacro کی مثال

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="robot_with_xacro">
  <!-- ویریبلز -->
  <xacro:property name="base_width" value="0.5"/>
  <xacro:property name="base_length" value="0.8"/>
  <xacro:property name="base_height" value="0.2"/>

  <!-- مکرو -->
  <xacro:macro name="box_link" params="name xyz size color">
    <link name="${name}">
      <visual>
        <geometry>
          <box size="${size}"/>
        </geometry>
        <material name="${color}">
          <color rgba="0 0 1 1"/>
        </material>
      </visual>
      <collision>
        <geometry>
          <box size="${size}"/>
        </geometry>
      </collision>
      <inertial>
        <mass value="1"/>
        <inertia ixx="1" ixy="0" ixz="0" iyy="1" iyz="0" izz="1"/>
      </inertial>
    </link>
  </xacro:macro>

  <!-- مکرو کا استعمال -->
  <xacro:box_link name="base_link" xyz="0 0 0" size="${base_width} ${base_length} ${base_height}" color="blue"/>
</robot>
```

## URDF اور Gazebo انٹیگریشن

### Gazebo خصوصیات

URDF کو Gazebo سیمیولیشن کے ساتھ انٹیگریٹ کیا جا سکتا ہے:

```xml
<link name="base_link">
  <visual>
    <geometry>
      <box size="1 1 1"/>
    </geometry>
  </visual>
  <collision>
    <geometry>
      <box size="1 1 1"/>
    </geometry>
  </collision>
  <inertial>
    <mass value="1"/>
    <inertia ixx="1" ixy="0" ixz="0" iyy="1" iyz="0" izz="1"/>
  </inertial>

  <!-- Gazebo خصوصیات -->
  <gazebo reference="base_link">
    <material>Gazebo/Blue</material>
    <mu1>0.2</mu1>
    <mu2>0.2</mu2>
  </gazebo>
</link>
```

### Gazebo پلگ انز

```xml
<gazebo>
  <plugin name="diff_drive" filename="libgazebo_ros_diff_drive.so">
    <left_joint>left_wheel_joint</left_joint>
    <right_joint>right_wheel_joint</right_joint>
    <wheel_separation>0.4</wheel_separation>
    <wheel_diameter>0.2</wheel_diameter>
  </plugin>
</gazebo>
```

## URDF فائلز کا استعمال

### URDF فائل لوڈ کرنا

```bash
# URDF فائل کو rviz2 میں دیکھیں
ros2 run rviz2 rviz2

# URDF فائل کو گیزبو میں لوڈ کریں
gz sim -r urdf_file.sdf
```

### URDF چیک کرنا

```bash
# URDF کو چیک کریں
check_urdf my_robot.urdf

# URDF کو Xacro سے URDF میں تبدیل کریں
xacro my_robot.xacro > my_robot.urdf
```

## URDF ماڈلنگ کی بہترین مشقیں

### 1. ڈیزائن کی منصوبہ بندی

- روبوٹ کی کینمیٹک چین کو منصوبہ بند کریں
- جوائنٹس کی اقسام کا صحیح انتخاب کریں
- سینسرز کی جگہ کو منصوبہ بند کریں

### 2. ماڈل کی تصدیق

- URDF کو چیک کریں کہ یہ درست ہے
- rviz2 میں ماڈل کو دیکھیں
- گیزبو میں سیمیولیشن کریں

### 3. فزیکل خصوصیات

- صحیح انیشل ویلیوز کا استعمال کریں
- کولیژن جیومیٹری کو درست کریں
- وژول اور کولیژن کو الگ الگ کریں

## URDF اور ROS 2 انٹیگریشن

### روبوٹ اسٹیٹ پبلشر

```xml
<node pkg="robot_state_publisher" exec="robot_state_publisher" name="robot_state_publisher">
  <param name="robot_description" value="$(find-pkg-share my_robot_description)/urdf/my_robot.urdf"/>
</node>
```

### جوائنٹ اسٹیٹ پبلشر

```xml
<node pkg="joint_state_publisher" exec="joint_state_publisher" name="joint_state_publisher">
</node>
```

## URDF ٹولز

### URDF کی تصدیق

```bash
# URDF کو چیک کریں
check_urdf robot.urdf

# URDF کو ڈیبگ کریں
urdf_to_graphiz robot.urdf
```

### URDF ویو اور ٹیسٹ

```bash
# URDF کو rviz2 میں دیکھیں
ros2 launch urdf_tutorial display.launch.py model:=path/to/robot.urdf

# URDF کو rviz2 میں دیکھیں (Xacro کے ساتھ)
ros2 launch urdf_tutorial display.launch.py model:=path/to/robot.xacro
```

## خلاصہ

URDF روبوٹکس ڈیزائن کا ایک اہم حصہ ہے جو ROS 2 اور گیزبو کے لیے روبوٹ کی جسمانی وضاحت فراہم کرتا ہے۔ URDF کا صحیح استعمال روبوٹکس سسٹم کی ترقی، سیمیولیشن، اور ڈیپلومنٹ کے لیے ضروری ہے۔