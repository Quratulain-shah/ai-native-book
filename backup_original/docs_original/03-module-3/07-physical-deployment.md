---
sidebar_position: 7
---

# Physical Deployment: Deploying the AI "Brain" to Jetson Orin Nano

## Theory

The Jetson Orin Nano serves as the "Edge Brain" for AI-powered robotics systems, providing the computational power needed to run complex AI models in real-time while maintaining energy efficiency suitable for mobile robots. Deploying trained AI models from high-performance workstations to the Jetson Orin Nano requires careful optimization to balance performance, power consumption, and real-time constraints.

### Edge Computing Architecture

- **Compute Capabilities**: 2 TFLOPS AI performance with 1024-core NVIDIA Ampere GPU with Tensor Cores
- **Power Efficiency**: 5W to 15W configurable power modes for mobile robotics applications
- **Memory Constraints**: 4GB or 8GB LPDDR5 memory with high bandwidth for AI workloads
- **I/O Interfaces**: Multiple camera interfaces, GPIO pins, SPI/I2C buses for sensor integration

### AI Model Deployment Pipeline

- **Model Optimization**: TensorRT optimization, quantization, and pruning for edge deployment
- **Real-time Inference**: GPU-accelerated inference with deterministic timing guarantees
- **Resource Management**: Dynamic allocation of CPU/GPU resources based on computational requirements
- **Thermal Management**: Active cooling support and thermal throttling for sustained performance

### Edge vs Cloud Considerations

- **Latency**: Edge processing eliminates network latency for critical control decisions
- **Bandwidth**: Reduced data transmission requirements for real-time applications
- **Privacy**: Sensitive data processing occurs locally without network transmission
- **Reliability**: Autonomous operation independent of network connectivity

## Sim (Simulation Lab)

### Model Optimization for Jetson Deployment

1. **Model Conversion Pipeline**
   ```bash
   # Convert ONNX model to TensorRT engine for Jetson optimization
   python -m tensorrt.tools.trtexec \
     --onnx=trained_model.onnx \
     --saveEngine=optimized_model.trt \
     --fp16 \
     --workspace=2048 \
     --buildOnly
   ```

2. **Quantization for Performance**
   ```python
   # quantization_script.py
   import tensorrt as trt
   import numpy as np
   import pycuda.driver as cuda
   import pycuda.autoinit

   def quantize_model_for_jetson(onnx_model_path, output_path):
       """Quantize model for Jetson Orin Nano deployment"""
       # Create TensorRT builder and network
       logger = trt.Logger(trt.Logger.WARNING)
       builder = trt.Builder(logger)
       network = builder.create_network(1 << int(trt.NetworkDefinitionCreationFlag.EXPLICIT_BATCH))
       config = builder.create_builder_config()

       # Enable INT8 quantization
       config.set_flag(trt.BuilderFlag.INT8)

       # Set up calibration data for INT8 quantization
       # This requires representative data from your domain
       calibrator = create_calibration_data()
       config.int8_calibrator = calibrator

       # Parse ONNX model
       parser = trt.OnnxParser(network, logger)
       with open(onnx_model_path, 'rb') as model:
           parser.parse(model.read())

       # Build optimized engine
       serialized_engine = builder.build_serialized_network(network, config)

       # Save optimized engine
       with open(output_path, 'wb') as f:
           f.write(serialized_engine)

       return serialized_engine

   def create_calibration_data():
       """Create calibration data for INT8 quantization"""
       # Implementation of calibration data generator
       # This should provide representative input data for your model
       pass
   ```

3. **Performance Profiling**
   ```bash
   # Profile TensorRT model performance on Jetson
   python -m tensorrt.tools.trtexec \
     --loadEngine=optimized_model.trt \
     --profilingVerbosity=detailed \
     --timingIteration=100 \
     --avgTimingIteration=10 \
     --workspace=2048
   ```

### Jetson Inference Engine Implementation

```python
# jetson_inference_engine.py
import tensorrt as trt
import pycuda.driver as cuda
import pycuda.autoinit
import numpy as np
import cv2
import time
from typing import Dict, Any, Optional

class JetsonInferenceEngine:
    def __init__(self, engine_path: str):
        """Initialize TensorRT inference engine on Jetson Orin Nano"""
        self.engine_path = engine_path
        self.engine = self._load_engine()
        self.context = self.engine.create_execution_context()
        self._allocate_buffers()
        self.input_shape = self.engine.get_binding_shape(0)
        self.output_shape = self.engine.get_binding_shape(1)

    def _load_engine(self) -> trt.ICudaEngine:
        """Load TensorRT engine from file"""
        with open(self.engine_path, 'rb') as f:
            engine_data = f.read()

        runtime = trt.Runtime(trt.Logger(trt.Logger.WARNING))
        return runtime.deserialize_cuda_engine(engine_data)

    def _allocate_buffers(self):
        """Allocate input/output buffers for inference"""
        self.input_buffer = cuda.pagelocked_empty(
            trt.volume(self.engine.get_binding_shape(0)),
            dtype=trt.nptype(self.engine.get_binding_dtype(0))
        )
        self.output_buffer = cuda.pagelocked_empty(
            trt.volume(self.engine.get_binding_shape(1)),
            dtype=trt.nptype(self.engine.get_binding_dtype(1))
        )
        self.input_gpu = cuda.mem_alloc(self.input_buffer.nbytes)
        self.output_gpu = cuda.mem_alloc(self.output_buffer.nbytes)

    def preprocess_input(self, image: np.ndarray) -> np.ndarray:
        """Preprocess input image for inference"""
        # Resize image to model input size
        h, w = self.input_shape[2], self.input_shape[3]
        image = cv2.resize(image, (w, h))

        # Normalize image
        image = image.astype(np.float32) / 255.0

        # Convert to CHW format (channels, height, width)
        image = np.transpose(image, (2, 0, 1))

        # Flatten for TensorRT
        image = np.ascontiguousarray(image, dtype=np.float32).ravel()

        return image

    def infer(self, input_data: np.ndarray) -> np.ndarray:
        """Run inference on Jetson Orin Nano"""
        # Copy input to device
        np.copyto(self.input_buffer, input_data)
        cuda.memcpy_htod(self.input_gpu, self.input_buffer)

        # Run inference
        start_time = time.time()
        self.context.execute_v2([int(self.input_gpu), int(self.output_gpu)])
        inference_time = time.time() - start_time

        # Copy output from device
        cuda.memcpy_dtoh(self.output_buffer, self.output_gpu)
        output = np.copy(self.output_buffer)

        return output, inference_time

    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for the inference engine"""
        return {
            'input_shape': self.input_shape,
            'output_shape': self.output_shape,
            'memory_usage': self.input_buffer.nbytes + self.output_buffer.nbytes,
            'precision': 'FP16' if self.engine.fp16 else 'INT8' if self.engine.int8 else 'FP32'
        }

# Example usage
if __name__ == "__main__":
    # Initialize inference engine
    engine = JetsonInferenceEngine("optimized_model.trt")

    # Load test image
    test_image = cv2.imread("test_image.jpg")

    # Preprocess and run inference
    preprocessed = engine.preprocess_input(test_image)
    output, inference_time = engine.infer(preprocessed)

    print(f"Inference time: {inference_time:.4f} seconds")
    print(f"Output shape: {output.shape}")
    print(f"Performance metrics: {engine.get_performance_metrics()}")
```

### Multi-Model Pipeline for AI Brain

```python
# ai_brain_pipeline.py
import threading
import queue
import time
from typing import Dict, List, Any
import numpy as np

class AIBrainPipeline:
    def __init__(self, models_config: Dict[str, str]):
        """Initialize AI Brain pipeline with multiple models"""
        self.models = {}
        self.model_threads = {}
        self.input_queues = {}
        self.output_queues = {}
        self.running = False

        # Initialize models based on configuration
        for model_name, engine_path in models_config.items():
            self.models[model_name] = JetsonInferenceEngine(engine_path)
            self.input_queues[model_name] = queue.Queue(maxsize=10)
            self.output_queues[model_name] = queue.Queue(maxsize=10)

    def start_model_thread(self, model_name: str):
        """Start inference thread for a specific model"""
        thread = threading.Thread(
            target=self._model_inference_loop,
            args=(model_name,),
            daemon=True
        )
        thread.start()
        self.model_threads[model_name] = thread

    def _model_inference_loop(self, model_name: str):
        """Run continuous inference loop for a model"""
        model = self.models[model_name]

        while self.running:
            try:
                # Get input from queue (with timeout to allow graceful shutdown)
                input_data = self.input_queues[model_name].get(timeout=1.0)

                # Run inference
                output, inference_time = model.infer(input_data)

                # Put result in output queue
                result = {
                    'output': output,
                    'inference_time': inference_time,
                    'timestamp': time.time()
                }
                self.output_queues[model_name].put(result)

            except queue.Empty:
                continue  # Check if still running
            except Exception as e:
                print(f"Error in {model_name} inference: {e}")

    def start_pipeline(self):
        """Start all model inference threads"""
        self.running = True
        for model_name in self.models.keys():
            self.start_model_thread(model_name)

    def stop_pipeline(self):
        """Stop all model inference threads"""
        self.running = False
        for thread in self.model_threads.values():
            thread.join()

    def submit_input(self, model_name: str, input_data: np.ndarray):
        """Submit input data for a specific model"""
        try:
            self.input_queues[model_name].put_nowait(input_data)
            return True
        except queue.Full:
            print(f"Input queue for {model_name} is full")
            return False

    def get_output(self, model_name: str, timeout: float = 1.0) -> Optional[Dict[str, Any]]:
        """Get output from a specific model"""
        try:
            return self.output_queues[model_name].get(timeout=timeout)
        except queue.Empty:
            return None

# Example configuration
models_config = {
    'perception': 'perception_model.trt',
    'navigation': 'navigation_model.trt',
    'control': 'control_model.trt'
}

# Example usage
if __name__ == "__main__":
    pipeline = AIBrainPipeline(models_config)
    pipeline.start_pipeline()

    # Submit inputs to different models
    # perception_input = preprocess_camera_data()
    # pipeline.submit_input('perception', perception_input)

    # Get outputs from models
    # perception_result = pipeline.get_output('perception')

    pipeline.stop_pipeline()
```

## Real (Physical Deployment)

### Jetson Orin Nano Setup and Configuration

1. **JetPack SDK Installation**
   ```bash
   # Download and install JetPack SDK 5.1+ for Orin Nano
   # This includes CUDA, TensorRT, OpenCV, and other essential libraries

   # Verify Jetson system information
   sudo jetson_release -v

   # Check GPU status
   sudo tegrastats  # Monitor GPU utilization, power, temperature

   # Verify CUDA installation
   nvcc --version
   nvidia-smi
   ```

2. **Power Mode Configuration**
   ```bash
   # Set Jetson to maximum performance mode for AI workloads
   sudo nvpmodel -m 0  # Mode 0: MAXN (maximum performance)

   # Check current power mode
   sudo nvpmodel -q

   # Enable fan control for thermal management
   sudo jetson_clocks
   ```

3. **Docker Container Setup for AI Deployment**
   ```dockerfile
   # Dockerfile for AI Brain deployment
   FROM nvcr.io/nvidia/jetson-l4t:r35.2.1

   # Install Python dependencies
   RUN apt-get update && apt-get install -y \
       python3-pip \
       python3-dev \
       build-essential \
       && rm -rf /var/lib/apt/lists/*

   # Install AI framework dependencies
   RUN pip3 install --upgrade pip
   RUN pip3 install \
       numpy \
       opencv-python \
       pycuda \
       tensorrt \
       torch \
       torchvision \
       torchaudio \
       --index-url https://pypi.ngc.nvidia.com

   # Copy model files and application code
   COPY models/ /app/models/
   COPY src/ /app/src/

   # Set working directory
   WORKDIR /app

   # Set environment variables for Jetson optimization
   ENV CUDA_VISIBLE_DEVICES=0
   ENV PYTHONPATH=/app/src:$PYTHONPATH

   # Run the AI Brain application
   CMD ["python3", "src/ai_brain_main.py"]
   ```

### ROS 2 Integration on Jetson

```python
# ai_brain_ros2_node.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, CompressedImage
from geometry_msgs.msg import Twist
from std_msgs.msg import String
import cv2
from cv_bridge import CvBridge
import numpy as np

class AIBrainNode(Node):
    def __init__(self):
        super().__init__('ai_brain_node')

        # Initialize CV bridge for image processing
        self.bridge = CvBridge()

        # Initialize AI Brain pipeline
        self.ai_brain = AIBrainPipeline(self.get_models_config())
        self.ai_brain.start_pipeline()

        # Create subscribers for sensor data
        self.image_subscription = self.create_subscription(
            Image,
            'camera/image_raw',
            self.image_callback,
            10
        )

        self.lidar_subscription = self.create_subscription(
            String,  # Using String as placeholder - replace with actual LiDAR message type
            'lidar/scan',
            self.lidar_callback,
            10
        )

        # Create publishers for control commands
        self.cmd_vel_publisher = self.create_publisher(
            Twist,
            'cmd_vel',
            10
        )

        # Timer for AI processing loop
        self.processing_timer = self.create_timer(0.033, self.process_ai_brain)  # ~30 Hz

        self.get_logger().info('AI Brain Node initialized')

    def get_models_config(self):
        """Get configuration for AI models"""
        return {
            'perception': '/models/perception_model.trt',
            'navigation': '/models/navigation_model.trt',
            'control': '/models/control_model.trt'
        }

    def image_callback(self, msg):
        """Process incoming camera image"""
        try:
            # Convert ROS image to OpenCV format
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')

            # Preprocess image for perception model
            preprocessed = self.ai_brain.models['perception'].preprocess_input(cv_image)

            # Submit to perception model
            self.ai_brain.submit_input('perception', preprocessed)

        except Exception as e:
            self.get_logger().error(f'Error processing image: {e}')

    def lidar_callback(self, msg):
        """Process incoming LiDAR data"""
        # Process LiDAR data and submit to navigation model
        # Implementation depends on specific LiDAR message format
        pass

    def process_ai_brain(self):
        """Main AI processing loop"""
        # Get perception results
        perception_result = self.ai_brain.get_output('perception', timeout=0.01)
        if perception_result:
            # Process perception output for navigation
            nav_input = self.process_perception_output(perception_result['output'])
            self.ai_brain.submit_input('navigation', nav_input)

        # Get navigation results
        navigation_result = self.ai_brain.get_output('navigation', timeout=0.01)
        if navigation_result:
            # Process navigation output for control
            control_input = self.process_navigation_output(navigation_result['output'])
            self.ai_brain.submit_input('control', control_input)

        # Get control results
        control_result = self.ai_brain.get_output('control', timeout=0.01)
        if control_result:
            # Convert control output to Twist message
            cmd_vel = self.convert_control_output(control_result['output'])
            self.cmd_vel_publisher.publish(cmd_vel)

    def process_perception_output(self, output):
        """Process perception model output"""
        # Convert perception output to navigation input format
        # Implementation depends on specific model architecture
        return output

    def process_navigation_output(self, output):
        """Process navigation model output"""
        # Convert navigation output to control input format
        # Implementation depends on specific model architecture
        return output

    def convert_control_output(self, output):
        """Convert control model output to Twist message"""
        # Convert neural network output to velocity commands
        twist = Twist()
        twist.linear.x = float(output[0])  # Forward velocity
        twist.angular.z = float(output[1])  # Angular velocity
        return twist

def main(args=None):
    rclpy.init(args=args)
    ai_brain_node = AIBrainNode()

    try:
        rclpy.spin(ai_brain_node)
    except KeyboardInterrupt:
        pass
    finally:
        ai_brain_node.ai_brain.stop_pipeline()
        ai_brain_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Deployment and Optimization Strategies

1. **Model Deployment Script**
   ```bash
   #!/bin/bash
   # deploy_ai_brain.sh

   # Set Jetson to maximum performance mode
   echo "Setting Jetson to MAXN mode..."
   sudo nvpmodel -m 0
   sudo jetson_clocks

   # Create deployment directory structure
   DEPLOY_DIR="/opt/ai_brain"
   mkdir -p $DEPLOY_DIR/models
   mkdir -p $DEPLOY_DIR/logs
   mkdir -p $DEPLOY_DIR/config

   # Copy optimized models to deployment directory
   cp -r /workspace/models/*.trt $DEPLOY_DIR/models/

   # Set appropriate permissions
   sudo chown -R $USER:$USER $DEPLOY_DIR

   # Create systemd service for AI Brain
   sudo tee /etc/systemd/system/ai-brain.service > /dev/null <<EOF
   [Unit]
   Description=AI Brain Service for Jetson Orin Nano
   After=network.target

   [Service]
   Type=simple
   User=$USER
   WorkingDirectory=$DEPLOY_DIR
   ExecStart=/usr/bin/python3 /opt/ai_brain/src/ai_brain_main.py
   Restart=always
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   EOF

   # Enable and start the service
   sudo systemctl daemon-reload
   sudo systemctl enable ai-brain.service
   sudo systemctl start ai-brain.service

   echo "AI Brain deployment completed!"
   ```

2. **Thermal Management and Monitoring**
   ```python
   # thermal_monitor.py
   import subprocess
   import time
   import threading
   from typing import Dict, Callable

   class ThermalManager:
       def __init__(self, temperature_threshold=80.0, callback: Callable = None):
           self.temperature_threshold = temperature_threshold
           self.callback = callback
           self.running = False
           self.monitor_thread = None

       def get_jetson_status(self) -> Dict[str, float]:
           """Get current Jetson system status"""
           try:
               # Use tegrastats to get system status
               result = subprocess.run(['tegrastats'], capture_output=True, text=True, timeout=1)
               # Parse tegrastats output to extract temperature, power, etc.
               # This is a simplified version - real implementation would parse the output properly
               status = {
                   'temperature': 70.0,  # Placeholder - would parse actual value
                   'gpu_util': 0.0,
                   'cpu_util': 0.0,
                   'power': 0.0
               }
               return status
           except Exception as e:
               print(f"Error getting Jetson status: {e}")
               return {}

       def start_monitoring(self):
           """Start thermal monitoring thread"""
           self.running = True
           self.monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
           self.monitor_thread.start()

       def _monitor_loop(self):
           """Continuous monitoring loop"""
           while self.running:
               status = self.get_jetson_status()

               if status and 'temperature' in status:
                   temp = status['temperature']
                   if temp > self.temperature_threshold:
                       print(f"WARNING: Temperature {temp}°C exceeds threshold {self.temperature_threshold}°C")
                       if self.callback:
                           self.callback(temp, status)

               time.sleep(1.0)  # Check every second

       def stop_monitoring(self):
           """Stop thermal monitoring"""
           self.running = False
           if self.monitor_thread:
               self.monitor_thread.join()

   # Example usage
   def thermal_warning_handler(temperature: float, status: Dict):
       print(f"Thermal event: {temperature}°C - Reducing AI workload")
       # Implementation could reduce model complexity, slow down inference rate, etc.

   thermal_manager = ThermalManager(
       temperature_threshold=80.0,
       callback=thermal_warning_handler
   )
   thermal_manager.start_monitoring()
   ```

### Performance Optimization Techniques

1. **Dynamic Model Loading**
   ```python
   # dynamic_model_loader.py
   import os
   import time
   from typing import Dict, Optional

   class DynamicModelLoader:
       def __init__(self, model_dir: str = "/opt/ai_brain/models"):
           self.model_dir = model_dir
           self.loaded_models = {}
           self.model_timestamps = {}

       def load_model(self, model_name: str) -> Optional[JetsonInferenceEngine]:
           """Load model with file change monitoring"""
           model_path = os.path.join(self.model_dir, f"{model_name}.trt")

           if not os.path.exists(model_path):
               print(f"Model {model_name} not found at {model_path}")
               return None

           # Check if model file has been updated
           current_timestamp = os.path.getmtime(model_path)

           if (model_name in self.loaded_models and
               self.model_timestamps.get(model_name) == current_timestamp):
               # Model is already loaded and unchanged
               return self.loaded_models[model_name]

           # Load or reload the model
           try:
               model = JetsonInferenceEngine(model_path)
               self.loaded_models[model_name] = model
               self.model_timestamps[model_name] = current_timestamp
               print(f"Model {model_name} loaded/reloaded successfully")
               return model
           except Exception as e:
               print(f"Error loading model {model_name}: {e}")
               return None

       def get_model(self, model_name: str) -> Optional[JetsonInferenceEngine]:
           """Get model, automatically reloading if file changed"""
           return self.load_model(model_name)
   ```

2. **Resource Allocation Manager**
   ```python
   # resource_manager.py
   import psutil
   import threading
   import time
   from typing import Dict, Tuple

   class ResourceManager:
       def __init__(self, cpu_threshold=80.0, memory_threshold=80.0):
           self.cpu_threshold = cpu_threshold
           self.memory_threshold = memory_threshold
           self.resource_usage = {'cpu': 0.0, 'memory': 0.0, 'gpu': 0.0}
           self.running = False
           self.monitor_thread = None

       def get_system_resources(self) -> Dict[str, float]:
           """Get current system resource usage"""
           cpu_percent = psutil.cpu_percent(interval=1)
           memory_percent = psutil.virtual_memory().percent

           # For GPU usage on Jetson, we can use nvidia-ml-py or parse tegrastats
           # This is a simplified version
           gpu_percent = self._get_gpu_usage()

           return {
               'cpu': cpu_percent,
               'memory': memory_percent,
               'gpu': gpu_percent
           }

       def _get_gpu_usage(self) -> float:
           """Get GPU usage percentage on Jetson"""
           try:
               # Parse nvidia-smi or tegrastats for GPU usage
               # This is a placeholder implementation
               return 0.0  # Would implement actual GPU usage monitoring
           except:
               return 0.0

       def start_monitoring(self):
           """Start resource monitoring"""
           self.running = True
           self.monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
           self.monitor_thread.start()

       def _monitor_loop(self):
           """Resource monitoring loop"""
           while self.running:
               self.resource_usage = self.get_system_resources()
               time.sleep(1.0)

       def should_reduce_workload(self) -> bool:
           """Check if workload should be reduced based on resource usage"""
           return (self.resource_usage['cpu'] > self.cpu_threshold or
                   self.resource_usage['memory'] > self.memory_threshold or
                   self.resource_usage['gpu'] > self.cpu_threshold)  # Using cpu_threshold for GPU as well

       def get_optimization_recommendation(self) -> str:
           """Get optimization recommendation based on resource usage"""
           if self.should_reduce_workload():
               if self.resource_usage['gpu'] > self.cpu_threshold:
                   return "Reduce model complexity or inference frequency"
               elif self.resource_usage['memory'] > self.memory_threshold:
                   return "Reduce batch size or use model quantization"
               else:
                   return "Reduce inference frequency or optimize model"
           return "Current resource usage is acceptable"
   ```

### Best Practices for Jetson Deployment

1. **Energy Efficiency Optimization**
   - Use INT8 quantization to reduce power consumption
   - Implement adaptive inference frequency based on task requirements
   - Optimize model architecture for the target Jetson platform
   - Use power management APIs to control performance modes dynamically

2. **Reliability and Safety**
   - Implement watchdog timers for critical AI processes
   - Add health checks for AI model performance
   - Include fallback mechanisms for AI system failures
   - Implement proper error handling and logging

3. **Performance Monitoring**
   - Monitor inference latency and throughput
   - Track thermal conditions and power consumption
   - Log model accuracy and performance metrics
   - Implement alerting for performance degradation

## Troubleshooting

1. **Model Loading Issues**: Verify TensorRT engine compatibility with Jetson Orin Nano architecture
2. **Performance Problems**: Check power mode settings, thermal conditions, and memory usage
3. **Memory Constraints**: Use model quantization, reduce batch sizes, or optimize model architecture
4. **ROS 2 Integration**: Verify message type compatibility and network configuration
5. **Thermal Issues**: Implement thermal monitoring and adaptive performance scaling

## Exercises

1. ** ماڈل کی اصلاح **: تربیت یافتہ ماڈل کو ٹینسورٹ فارمیٹ میں تبدیل کریں اور کارکردگی میں بہتری کی پیمائش کریں
2. ** ملٹی ماڈل پائپ لائن **: خیال ، نیویگیشن اور کنٹرول ماڈل کے ساتھ ایک پائپ لائن کو نافذ کریں
3. ** ROS 2 انضمام **: ROS 2 نوڈ بنائیں جو AI دماغ کو روبوٹ کنٹرول کے ساتھ مربوط کرتا ہے
4. ** کارکردگی کی نگرانی **: وسائل کی نگرانی اور انکولی اصلاح کو نافذ کریں
5. ** حقیقی دنیا کی تعیناتی **: جیٹسن اورین نینو پر AI دماغ کو تعینات کریں اور جسمانی روبوٹ کے ساتھ ٹیسٹ کریں