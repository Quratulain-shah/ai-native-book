---
title: "ROS 2 فنڈامینٹلز"
slug: "/ur/ros2-fundamentals"
sidebar_position: 2
---

# ROS 2 فنڈامینٹلز

## ROS 2 کیا ہے؟

ROS 2 (Robot Operating System 2) ایک اوپن سورس ڈسٹری بیوٹیڈ کمپیوٹیشنل فریم ورک ہے جو روبوٹکس ایپلی کیشنز کی ترقی کے لیے استعمال ہوتا ہے۔ یہ ایک اصل آپریٹنگ سسٹم نہیں ہے، بلکہ یہ کمپوننٹس کے مابین مواصلات، ڈیٹا کے بہاؤ، اور سسٹم کے مینجمنٹ کے لیے لائبریریز اور ٹولز کا ایک مجموعہ ہے۔

## ROS 2 کی خصوصیات

### 1. ڈسٹری بیوٹیڈ ارکیٹیکچر

ROS 2 ایک ڈسٹری بیوٹیڈ سسٹم کے طور پر کام کرتا ہے جہاں مختلف نوڈس مختلف مشینوں یا عملے پر چل سکتے ہیں۔ یہ نوڈس ٹوپکس، سروسز، اور ایکشنز کے ذریعے بات چیت کرتے ہیں۔

### 2. DDS (Data Distribution Service)

ROS 2 DDS (Data Distribution Service) کا استعمال کرتا ہے جو ڈسٹری بیوٹیڈ سسٹم کے لیے ایک صنعتی معیار کا مواصلاتی پروٹوکول ہے۔ DDS سیکورٹی، قابل اعتماد ڈیلیوری، اور کارکردگی کے لیے ذمہ دار ہے۔

### 3. زبان کے لحاظ سے آزادی

ROS 2 متعدد پروگرامنگ زبانوں کی حمایت کرتا ہے، بشمول:
- C++
- Python
- Java
- Rust

### 4. سیکورٹی کی حمایت

ROS 2 کو سیکورٹی کے خیالات کے ساتھ ڈیزائن کیا گیا ہے، بشمول:
- توثیق (Authentication)
- اجازت (Authorization)
- ڈیٹا کی خفیت (Data Confidentiality)

## ROS 2 مقابلہ ROS 1

| خصوصیت | ROS 1 | ROS 2 |
|---------|-------|-------|
| مواصلات | Master-based | Master-less (DDS) |
| سیکورٹی | غیر محفوظ | اندراجی سیکورٹی |
| کارکردگی | کم | بہتر |
| ہارڈ ریئل ٹائم | عدم حمایت | حمایت |
| ملٹی پل پلیٹ فارمز | محدود | وسیع حمایت |

## ROS 2 ایکو سسٹم

### کلائنٹ لائبریریز

- **rclcpp**: C++ کے لیے کلائنٹ لائبریری
- **rclpy**: Python کے لیے کلائنٹ لائبریری
- **rcljava**: Java کے لیے کلائنٹ لائبریری
- **rclnodejs**: Node.js کے لیے کلائنٹ لائبریری

### ٹولز

- **ros2**: ROS 2 کمانڈ لائن ٹول
- **rviz2**: 3D ویژولائزیشن ٹول
- **rqt**: GUI ٹول کا مجموعہ
- **rosbag2**: ڈیٹا ریکارڈنگ ٹول

## ROS 2 ورک اسپیس

ROS 2 ورک اسپیس ایک ڈائرکٹری ہے جہاں ROS 2 پیکیجز کو ترقی، کمپائل، اور چلانے کے لیے ترتیب دیا جاتا ہے۔ ایک ROS 2 ورک اسپیس کی ساخت یوں ہوتی ہے:

```
workspace/
├── src/
├── build/
├── install/
└── log/
```

### ورک اسپیس کی ترتیب

```bash
# ورک اسپیس ڈائریکٹری بنائیں
mkdir -p ~/ros2_ws/src

# ورک اسپیس میں چلیں
cd ~/ros2_ws

# پیکیجز کمپائل کریں
colcon build

# سیٹ اپ فائل سورس کریں
source install/setup.bash
```

## ROS 2 پیکیج کی ترتیب

ایک ROS 2 پیکیج مندرجہ ذیل فائلز پر مشتمل ہوتا ہے:

```
my_package/
├── CMakeLists.txt
├── package.xml
├── src/
├── include/
├── launch/
├── config/
└── test/
```

### package.xml

`package.xml` فائل پیکیج کی میٹا ڈیٹا، انحصار، اور مصنف کی معلومات فراہم کرتی ہے:

```xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>my_package</name>
  <version>0.0.0</version>
  <description>My ROS 2 Package</description>
  <maintainer email="user@example.com">User</maintainer>
  <license>Apache-2.0</license>

  <depend>rclcpp</depend>
  <depend>rclpy</depend>

  <export>
    <build_type>ament_cmake</build_type>
  </export>
</package>
```

## ROS 2 نوڈس

ROS 2 نوڈس پروگرام کے اجزاء ہیں جو ROS 2 کلائنٹ لائبریریز کا استعمال کرتے ہوئے مواصلات کرتے ہیں۔ ایک نوڈ ایک ROS 2 پیکیج کے اندر ایک الگ عمل ہوتا ہے۔

### Python میں نوڈ کی مثال

```python
import rclpy
from rclpy.node import Node

class MyNode(Node):
    def __init__(self):
        super().__init__('my_node')
        self.get_logger().info('My Node has been started')

def main(args=None):
    rclpy.init(args=args)
    node = MyNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## خلاصہ

ROS 2 روبوٹکس ایپلی کیشنز کی ترقی کے لیے ایک طاقتور فریم ورک ہے جو ڈسٹری بیوٹیڈ مواصلات، سیکورٹی، اور کارکردگی کی خصوصیات فراہم کرتا ہے۔ اس کا استعمال جسمانی ای آئی اور ہیومنوائڈ روبوٹکس کے لیے بنیادی ہے۔