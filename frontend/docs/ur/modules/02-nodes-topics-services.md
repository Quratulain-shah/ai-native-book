---
title: "ROS 2 نوڈس، ٹوپکس، اور سروسز"
slug: "/ur/nodes-topics-services"
sidebar_position: 3
---

# ROS 2 نوڈس، ٹوپکس، اور سروسز

## ROS 2 نوڈس

ROS 2 نوڈس روبوٹکس ایپلی کیشن کے بنیادی اجزاء ہیں۔ ہر نوڈ ایک الگ عمل ہوتا ہے جو ROS 2 کلائنٹ لائبریریز کا استعمال کرتا ہے۔ نوڈس ایک دوسرے کے ساتھ ٹوپکس، سروسز، اور ایکشنز کے ذریعے بات چیت کرتے ہیں۔

### نوڈ کی خصوصیات

- **نام**: ہر نوڈ کا ایک منفرد نام ہوتا ہے
- **نیمسپیس**: نوڈ کا نام اس کے نیمسپیس کے ساتھ جڑا ہوتا ہے
- **پیرامیٹرز**: نوڈس کو کنفیگر کرنے کے لیے پیرامیٹرز استعمال کیے جاتے ہیں
- **لائف سائیکل**: نوڈس کے لائف سائیکل اسٹیٹس ہوتے ہیں (جیسے: کونفیگر، ایکٹیو، ان ایکٹیو)

### نوڈ کی تخلیق

#### Python میں نوڈ کی مثال

```python
import rclpy
from rclpy.node import Node

class SensorNode(Node):
    def __init__(self):
        super().__init__('sensor_node')
        self.get_logger().info('Sensor Node has been started')

        # نوڈ کے لیے پیرامیٹر کی ترتیب
        self.declare_parameter('sensor_rate', 1.0)
        self.sensor_rate = self.get_parameter('sensor_rate').value

def main(args=None):
    rclpy.init(args=args)
    node = SensorNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### C++ میں نوڈ کی مثال

```cpp
#include "rclcpp/rclcpp.hpp"

class SensorNode : public rclcpp::Node
{
public:
    SensorNode() : Node("sensor_node")
    {
        RCLCPP_INFO(this->get_logger(), "Sensor Node has been started");

        // پیرامیٹر کی ترتیب
        this->declare_parameter("sensor_rate", 1.0);
        double sensor_rate = this->get_parameter("sensor_rate").as_double();
    }
};

int main(int argc, char * argv[])
{
    rclcpp::init(argc, argv);
    rclcpp::spin(std::make_shared<SensorNode>());
    rclcpp::shutdown();
    return 0;
}
```

## ٹوپکس

ٹوپکس ROS 2 میں ڈیٹا کے بہاؤ کا ایک طریقہ ہیں جو "پبلش/سبسکرائب" ماڈل کا استعمال کرتے ہیں۔ ایک نوڈ ڈیٹا پبلش کر سکتا ہے اور دوسرے نوڈس اس ڈیٹا کو سبسکرائب کر سکتے ہیں۔

### ٹوپکس کی خصوصیات

- **اون وے کمیونیکیشن**: ڈیٹا ایک سمت میں بہتا ہے
- **اصل میں متوازی**: متعدد سبسکرائبرز ایک پبلشر سے ڈیٹا حاصل کر سکتے ہیں
- **میسج ٹائپس**: ہر ٹوپک کا ایک مخصوص میسج ٹائپ ہوتا ہے

### ٹوپکس کا استعمال

#### Python میں پبلشر

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class PublisherNode(Node):
    def __init__(self):
        super().__init__('publisher_node')
        self.publisher = self.create_publisher(String, 'topic_name', 10)
        timer_period = 0.5  # سیکنڈز میں
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello World: {self.i}'
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    node = PublisherNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### Python میں سبسکرائبر

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class SubscriberNode(Node):
    def __init__(self):
        super().__init__('subscriber_node')
        self.subscription = self.create_subscription(
            String,
            'topic_name',
            self.listener_callback,
            10)
        self.subscription  # احتیاطی کوڈ کو روکنے کے لیے

    def listener_callback(self, msg):
        self.get_logger().info(f'I heard: "{msg.data}"')

def main(args=None):
    rclpy.init(args=args)
    node = SubscriberNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## سروسز

سروسز ROS 2 میں "ریکویسٹ/ریسپانس" ماڈل کا استعمال کرتے ہیں۔ ایک نوڈ سروس کلائنٹ ہوتا ہے اور دوسرا سروس سرور ہوتا ہے۔ یہ مواصلات کا ایک مکمل طور پر متوازی طریقہ ہے۔

### سروسز کی خصوصیات

- **دو طرفہ مواصلات**: کلائنٹ ریکویسٹ بھیجتا ہے، سرور ریسپانس دیتا ہے
- **کارکردگی**: سروسز کو کال کرنا ہینڈل کرنا
- **سینکرونائزیشن**: ریکویسٹ اور ریسپانس کے مابین ربط

### سروسز کا استعمال

#### Python میں سروس سرور

```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddTwoIntsServer(Node):
    def __init__(self):
        super().__init__('add_two_ints_server')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)

    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'Returning {request.a} + {request.b} = {response.sum}')
        return response

def main(args=None):
    rclpy.init(args=args)
    node = AddTwoIntsServer()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### Python میں سروس کلائنٹ

```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddTwoIntsClient(Node):
    def __init__(self):
        super().__init__('add_two_ints_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')

        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting again...')

        self.req = AddTwoInts.Request()

    def send_request(self, a, b):
        self.req.a = a
        self.req.b = b
        self.future = self.cli.call_async(self.req)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()

def main(args=None):
    rclpy.init(args=args)
    client = AddTwoIntsClient()
    response = client.send_request(2, 3)
    if response:
        client.get_logger().info(f'Result of add_two_ints: {response.sum}')
    else:
        client.get_logger().info('Service call failed')
    client.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## ایکشنز

ایکشنز طویل مدتی کاموں کے لیے استعمال ہوتے ہیں جن میں پیش رفت کی رپورٹنگ اور کینسلیشن کی ضرورت ہوتی ہے۔ ایکشنز تین پیغامات کا استعمال کرتے ہیں: گول، فیڈ بیک، اور ریزولٹ۔

### ایکشنز کی خصوصیات

- **پیش رفت کی رپورٹنگ**: کام کی پیش رفت کے بارے میں اپ ڈیٹس
- **کینسلیشن**: کام کو منسوخ کرنے کی صلاحیت
- **گول سٹیٹس**: گول کی کارکردگی کی رپورٹنگ

## ROS 2 کمانڈز

### نوڈس کے لیے کمانڈز

```bash
# تمام نوڈس کو دیکھیں
ros2 node list

# ایک نوڈ کی معلومات حاصل کریں
ros2 node info <node_name>

# نوڈ کو کال کریں
ros2 run <package_name> <executable_name>
```

### ٹوپکس کے لیے کمانڈز

```bash
# تمام ٹوپکس کو دیکھیں
ros2 topic list

# ٹوپک کی معلومات حاصل کریں
ros2 topic info <topic_name>

# ٹوپک کو پبلش کریں
ros2 topic pub <topic_name> <msg_type> <data>

# ٹوپک کو سبسکرائب کریں
ros2 topic echo <topic_name>
```

### سروسز کے لیے کمانڈز

```bash
# تمام سروسز کو دیکھیں
ros2 service list

# سروس کو کال کریں
ros2 service call <service_name> <service_type> <request_data>
```

## مواصلاتی پیٹرنز

### 1. پبلش/سبسکرائب (پب/سب)

- ڈیٹا کا ایک طرفہ بہاؤ
- متعدد سبسکرائبرز ایک پبلشر سے ڈیٹا حاصل کر سکتے ہیں
- ایونٹ ڈریون مواصلات

### 2. ریکویسٹ/ریسپانس (سروسز)

- ڈیٹا کا دو طرفہ بہاؤ
- ایک کلائنٹ اور ایک سرور
- سینکرونائز کی گئی مواصلات

### 3. گول/فیڈ بیک/ریزولٹ (ایکشنز)

- طویل مدتی کاموں کے لیے
- پیش رفت کی رپورٹنگ
- کینسلیشن کی صلاحیت

## ROS 2 میسج ٹائپس

ROS 2 کئی معیاری میسج ٹائپس فراہم کرتا ہے:

- **std_msgs**: بنیادی ڈیٹا ٹائپس (Int32, String, Float64 وغیرہ)
- **geometry_msgs**: جیومیٹری ڈیٹا (Point, Pose, Twist وغیرہ)
- **sensor_msgs**: سینسر ڈیٹا (LaserScan, Image, JointState وغیرہ)
- **nav_msgs**: نیویگیشن ڈیٹا (Odometry, Path وغیرہ)

## خلاصہ

ROS 2 نوڈس، ٹوپکس، سروسز، اور ایکشنز فزیکل ای آئی اور ہیومنوائڈ روبوٹکس کے لیے بنیادی مواصلاتی طریقے ہیں۔ ان کا صحیح استعمال روبوٹکس سسٹم کی ترقی کے لیے ضروری ہے۔