---
title: "ہارڈ ویئر سیٹ اپ: فزیکل ای آئی اور ہیومنوائڈ روبوٹکس"
slug: "/ur/hardware-setup"
sidebar_position: 3
---

# ہارڈ ویئر سیٹ اپ: فزیکل ای آئی اور ہیومنوائڈ روبوٹکس

## سیٹ اپ کا جائزہ

یہ ہارڈ ویئر سیٹ اپ آپ کو فزیکل ای آئی اور ہیومنوائڈ روبوٹکس کے تجربات کے لیے ضروری ہے۔ ہم روبوٹکس کے لیے مروجہ اوزاروں اور ٹیکنالوجیز کو استعمال کرتے ہیں تاکہ صنعت کے معیار کا تجربہ فراہم کیا جا سکے۔

## ضروری ہارڈ ویئر

### ہیومنوائڈ روبوٹ

- **روبوٹ ماڈل**: ایل ایچ ڈی ایچ یا ایس ایچ ڈی ایچ سیریز
- **موٹرز**: ہائی ٹارک سیوو موٹرز (18+ یونٹس)
- **سینسرز**:
  - IMU (انرشل میزورمینٹ یونٹ)
  - کیمرہ (RGB + ڈیپتھ)
  - لیزر لائٹ ڈیٹکٹرز
  - ٹچ سینسرز
- **پراسیسر**: NVIDIA Jetson AGX Orin یا اس سے بہتر

### کمپیوٹیشنل سسٹم

- **CPU**: 8+ کورز، 3.0+ GHz
- **RAM**: 32GB+ DDR4
- **GPU**: NVIDIA RTX 3080 یا اس سے بہتر
- **سٹوریج**: 1TB+ NVMe SSD

### اضافی سامان

- **پاور سپلائی**: 12V/24V ریگولیٹڈ پاور سپلائی
- **کنیکٹیویٹی**: وائی فائی 6، ایتھرنیٹ
- **سینسر کٹ**: IMU، گائیرو اسکوپ، ایکسلیرومیٹر
- **ڈیولپمنٹ ٹولز**: USB-C کیبلز، جمپر وائرز، ملٹی میٹر

## سافٹ ویئر کی ضروریات

### آپریٹنگ سسٹم

- **Ubuntu 22.04 LTS** (ترجیحی)
- یا **ROS 2 Humble Hawksbill** کے ساتھ کم از کم Ubuntu 20.04

### ROS 2 انسٹالیشن

```bash
# Ubuntu 22.04 کے لیے ROS 2 Humble انسٹال کریں
sudo apt update && sudo apt install curl gnupg lsb-release
curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key | sudo apt-key add -
sudo sh -c 'echo "deb [arch=$(dpkg --print-architecture)] http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" > /etc/apt/sources.list.d/ros2.list'
sudo apt update
sudo apt install ros-humble-desktop
```

### اضافی ڈیپینڈنسیز

```bash
# ہیومنوائڈ روبوٹکس کے لیے ضروری پیکیجز
sudo apt install ros-humble-ros2-control ros-humble-ros2-controllers
sudo apt install ros-humble-gazebo-ros2-control
sudo apt install ros-humble-hardware-interface
sudo apt install ros-humble-controller-manager
```

## NVIDIA Isaac انسٹالیشن

### Isaac ROS DevKit

1. NVIDIA Developer اکاؤنٹ حاصل کریں
2. Isaac ROS DevKit ڈاؤن لوڈ کریں
3. کنٹینر کے ذریعے انسٹال کریں:

```bash
# Isaac ROS کنٹینر انسٹال کریں
docker pull nvcr.io/nvidia/isaac_ros/isaac_ros_dev:latest
```

## VLM (وژن لینگویج ایکشن) ماڈلز

### ضروری ماڈلز

- CLIP (Contrastive Language-Image Pretraining)
- BLIP-2 (Bootstrapping Language-Image Pre-training)
- VIMA (Vision-Language-Action Models)

### ماڈلز کی تنصیب

```bash
pip install torch torchvision
pip install transformers
pip install open_clip_torch
```

## ٹیسٹنگ کا عمل

ہارڈ ویئر کو مناسب طریقے سے کام کر رہا ہے یقینی بنانے کے لیے یہ اسٹیپس کریں:

1. تمام کنیکشنز کو چیک کریں
2. پاور سپلائی کی جانچ کریں
3. سینسرز کی کیلیبریشن کریں
4. ROS 2 کنیکٹیویٹی کی تصدیق کریں
5. ہارڈ ویئر کنٹرول ٹیسٹ کریں

## مسائل کا حل

### مشکل 1: ROS 2 کنکشن نہیں ہو رہا

- یقینی بنائیں کہ ROS_DOMAIN_ID سیٹ ہے
- یقینی بنائیں کہ اینٹ ورک اسٹیٹس آر ٹی ایس ہے

### مشکل 2: سینسرز ریسپانس نہیں دے رہے

- ڈرائیورز کی جانچ کریں
- کیبلز کی جانچ کریں
- پاور سپلائی کی سطح کی تصدیق کریں