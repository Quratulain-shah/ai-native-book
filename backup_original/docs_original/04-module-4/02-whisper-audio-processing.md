---
sidebar_position: 2
---

# Whisper Audio Processing: Voice-to-Action Commands with ReSpeaker Microphone

## Theory

OpenAI Whisper is a robust automatic speech recognition (ASR) system that converts spoken language into text. In robotics applications, Whisper enables natural human-robot interaction by processing voice commands captured from microphones like the ReSpeaker array, converting speech to text that can be interpreted by cognitive planning systems to generate robot actions.

### Whisper Architecture

- **Transformer-based Model**: Encoder-decoder architecture with multi-head attention mechanisms
- **Multilingual Support**: Trained on 98 languages for diverse interaction scenarios
- **Robustness**: Handles various accents, background noise, and audio quality conditions
- **End-to-End Processing**: Direct mapping from audio to text without intermediate phoneme recognition

### ReSpeaker Microphone Arrays

- **Far-Field Processing**: Optimized for voice commands from distance with beamforming
- **Noise Suppression**: Advanced algorithms to filter background noise and enhance speech
- **Directional Sensitivity**: Multiple microphones for spatial audio processing and source localization
- **USB Interface**: Easy integration with robotics platforms including Jetson Orin Nano

### Voice Command Pipeline

- **Audio Capture**: ReSpeaker microphone array captures voice commands with beamforming
- **Preprocessing**: Audio normalization, noise reduction, and format conversion
- **Speech Recognition**: Whisper model converts audio to text with confidence scoring
- **Command Interpretation**: LLM processes text to extract actionable intents
- **Action Execution**: ROS 2 action sequences execute the interpreted commands

## Sim (Simulation Lab)

### Whisper Integration for Robotics

1. **Whisper Installation and Setup**
   ```bash
   # Install Whisper for robotics applications
   pip install openai-whisper
   pip install pyaudio  # For audio capture
   pip install soundfile  # For audio file processing
   pip install webrtcvad  # For voice activity detection

   # Download Whisper model (base model for edge deployment)
   python -c "import whisper; whisper.load_model('base')"
   ```

2. **Whisper Processing Pipeline**
   ```python
   # whisper_robotics_pipeline.py
   import whisper
   import numpy as np
   import torch
   import threading
   import queue
   from typing import Dict, List, Optional, Callable
   import time

   class WhisperRoboticsProcessor:
       def __init__(self, model_size="base", device="cuda" if torch.cuda.is_available() else "cpu"):
           """
           Initialize Whisper processor for robotics applications
           """
           self.model_size = model_size
           self.device = device
           self.model = whisper.load_model(model_size).to(device)
           self.audio_queue = queue.Queue()
           self.command_callbacks = []
           self.running = False
           self.command_history = []

       def add_command_callback(self, callback: Callable[[str], None]):
           """Add callback function to process recognized commands"""
           self.command_callbacks.append(callback)

       def process_audio(self, audio_data: np.ndarray) -> Dict:
           """
           Process audio data with Whisper model
           """
           # Convert audio to appropriate format for Whisper
           if len(audio_data.shape) > 1:
               # Convert stereo to mono if needed
               audio_data = audio_data.mean(axis=1)

           # Ensure audio is in the right format (16kHz)
           if len(audio_data) > 0:
               # Process with Whisper
               result = self.model.transcribe(
                   audio_data,
                   language="en",  # Specify language for better accuracy
                   temperature=0.0,  # Deterministic output
                   compression_ratio_threshold=2.4,  # Filter out low-quality transcriptions
                   logprob_threshold=-1.0,  # Filter out low-confidence transcriptions
                   no_speech_threshold=0.6  # Filter out non-speech
               )

               return {
                   'text': result['text'].strip(),
                   'confidence': self._calculate_confidence(result),
                   'timestamp': time.time(),
                   'language': result.get('language', 'unknown')
               }

           return {'text': '', 'confidence': 0.0, 'timestamp': time.time(), 'language': 'unknown'}

       def _calculate_confidence(self, result: Dict) -> float:
           """Calculate confidence score from Whisper result"""
           if 'avg_logprob' in result and result['avg_logprob'] is not None:
               # Convert log probability to confidence (0-1 scale)
               # Higher logprob means higher confidence
               logprob = result['avg_logprob']
               # Normalize to 0-1 range (empirical bounds)
               confidence = max(0.0, min(1.0, (logprob + 2.0) / 4.0))
               return confidence
           return 0.5  # Default confidence if not available

       def process_command(self, command_text: str, confidence: float):
           """Process recognized command text"""
           if confidence > 0.7 and len(command_text) > 3:  # Basic validation
               # Add to command history
               self.command_history.append({
                   'text': command_text,
                   'confidence': confidence,
                   'timestamp': time.time()
               })

               # Call all registered callbacks
               for callback in self.command_callbacks:
                   try:
                       callback(command_text)
                   except Exception as e:
                       print(f"Error in command callback: {e}")

       def get_recent_commands(self, limit: int = 5) -> List[Dict]:
           """Get recent commands from history"""
           return self.command_history[-limit:]

   # Example usage
   processor = WhisperRoboticsProcessor()
   ```

3. **Voice Activity Detection and Command Recognition**
   ```python
   # vad_command_detection.py
   import webrtcvad
   import collections
   import pyaudio
   import numpy as np
   import threading
   import time

   class VoiceActivityDetector:
       def __init__(self, sample_rate=16000, frame_duration=30, vad_aggressiveness=3):
           """
           Initialize Voice Activity Detector
           """
           self.sample_rate = sample_rate
           self.frame_duration = frame_duration
           self.vad = webrtcvad.Vad(vad_aggressiveness)
           self.frame_size = int(sample_rate * frame_duration / 1000)
           self.ring_buffer = collections.deque(maxlen=30)  # 30 frames = 900ms
           self.is_speech = False
           self.speech_buffer = []
           self.min_silence_frames = 10  # Wait for 300ms of silence
           self.silence_counter = 0

       def is_speech_frame(self, frame: bytes) -> bool:
           """Check if a frame contains speech"""
           try:
               return self.vad.is_speech(frame, self.sample_rate)
           except:
               return False

       def process_audio_chunk(self, audio_chunk: bytes) -> Optional[np.ndarray]:
           """
           Process audio chunk and return speech segment when detected
           """
           self.ring_buffer.append(audio_chunk)
           is_speech_current = self.is_speech_frame(audio_chunk)

           if is_speech_current:
               # We're in a speech segment
               self.speech_buffer.extend(list(audio_chunk))
               self.silence_counter = 0
               self.is_speech = True
           else:
               # We're in silence
               if self.is_speech:
                   # Previously in speech, now in silence
                   self.silence_counter += 1
                   if self.silence_counter >= self.min_silence_frames:
                       # End of speech detected
                       speech_data = b''.join(self.speech_buffer)
                       self.speech_buffer = []
                       self.is_speech = False
                       self.silence_counter = 0
                       return self._bytes_to_numpy(speech_data)

           return None

       def _bytes_to_numpy(self, audio_bytes: bytes) -> np.ndarray:
           """Convert audio bytes to numpy array"""
           # Convert bytes to int16, then normalize to float32
           audio_int16 = np.frombuffer(audio_bytes, dtype=np.int16)
           audio_float32 = audio_int16.astype(np.float32) / 32768.0
           return audio_float32

   # Integration with Whisper
   class WhisperVoiceCommandDetector:
       def __init__(self):
           self.vad = VoiceActivityDetector()
           self.whisper_processor = WhisperRoboticsProcessor()
           self.audio_stream = None
           self.running = False

       def setup_audio_stream(self):
           """Setup audio stream from ReSpeaker microphone"""
           import pyaudio
           self.audio = pyaudio.PyAudio()
           self.audio_stream = self.audio.open(
               format=pyaudio.paInt16,
               channels=1,
               rate=16000,
               input=True,
               frames_per_buffer=480  # 30ms at 16kHz
           )

       def start_detection(self):
           """Start voice command detection"""
           self.running = True
           self.setup_audio_stream()

           while self.running:
               try:
                   # Read audio chunk
                   chunk = self.audio_stream.read(480, exception_on_overflow=False)
                   audio_data = self.vad.process_audio_chunk(chunk)

                   if audio_data is not None:
                       # Process speech with Whisper
                       result = self.whisper_processor.process_audio(audio_data)
                       if result['confidence'] > 0.7:
                           self.whisper_processor.process_command(
                               result['text'],
                               result['confidence']
                           )

                   time.sleep(0.01)  # Small delay to prevent excessive CPU usage

               except Exception as e:
                   print(f"Error in voice detection: {e}")
                   time.sleep(0.1)

       def stop_detection(self):
           """Stop voice command detection"""
           self.running = False
           if self.audio_stream:
               self.audio_stream.stop_stream()
               self.audio_stream.close()
           if self.audio:
               self.audio.terminate()
   ```

### ReSpeaker Microphone Array Simulation

```python
# respeaker_simulation.py
import numpy as np
import soundfile as sf
from scipy import signal
import threading
import time

class ReSpeakerSimulator:
    """
    Simulate ReSpeaker microphone array behavior for testing
    """
    def __init__(self, sample_rate=16000, num_mics=6):
        self.sample_rate = sample_rate
        self.num_mics = num_mics
        self.mic_positions = self._calculate_mic_positions()
        self.running = False

    def _calculate_mic_positions(self):
        """
        Calculate positions for 6-mic ReSpeaker array (circular arrangement)
        """
        radius = 0.04  # 4cm radius
        positions = []
        for i in range(self.num_mics):
            angle = 2 * np.pi * i / self.num_mics
            x = radius * np.cos(angle)
            y = radius * np.sin(angle)
            positions.append((x, y, 0))
        return positions

    def simulate_beamforming(self, source_audio, source_position, noise_level=0.1):
        """
        Simulate beamforming effect of ReSpeaker array
        """
        # Add noise to simulate real-world conditions
        noisy_audio = source_audio + np.random.normal(0, noise_level, source_audio.shape)

        # Apply beamforming (simplified simulation)
        # In reality, this would involve delay-and-sum beamforming
        beamformed = noisy_audio  # Simplified for simulation

        return beamformed

    def generate_test_audio(self, duration=3.0, frequency=1000):
        """
        Generate test audio signal
        """
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        audio_signal = np.sin(2 * np.pi * frequency * t)
        return audio_signal

# Example usage in simulation environment
def simulate_whisper_with_respeaker():
    """
    Simulate Whisper processing with ReSpeaker-like audio input
    """
    # Create simulator
    respeaker_sim = ReSpeakerSimulator()

    # Generate test audio (simulating voice command)
    test_audio = respeaker_sim.generate_test_audio(duration=2.0, frequency=800)  # Lower freq for voice

    # Simulate beamforming
    beamformed_audio = respeaker_sim.simulate_beamforming(
        test_audio,
        source_position=(0.5, 0.5, 1.0)  # Source position in 3D space
    )

    # Process with Whisper
    processor = WhisperRoboticsProcessor()
    result = processor.process_audio(beamformed_audio)
    print(f"Simulated recognition result: {result}")

# Run simulation
simulate_whisper_with_respeaker()
```

## Real (Physical Deployment)

### ReSpeaker Microphone Hardware Integration

1. **ReSpeaker Setup on Jetson Orin Nano**
   ```bash
   # Install ReSpeaker drivers and dependencies
   sudo apt update
   sudo apt install -y python3-pip python3-dev build-essential
   sudo apt install -y portaudio19-dev libportaudio2 libportaudiocpp0
   sudo apt install -y alsa-utils alsa-base alsa-tools

   # Install Python audio libraries
   pip3 install pyaudio
   pip3 install spidev  # For SPI communication with ReSpeaker
   pip3 install gpiozero  # For GPIO control

   # Configure audio settings for ReSpeaker
   # Create ALSA configuration file
   sudo tee /etc/asound.conf > /dev/null <<EOF
   pcm.reSpeaker {
       type hw
       card 1
       device 0
   }

   ctl.reSpeaker {
       type hw
       card 1
   }

   pcm.!default {
       type asym
       playback.pcm {
           type plug
           slave.pcm "dmix:card=1,device=0"
       }
       capture.pcm {
           type plug
           slave.pcm "dsnoop:card=1,device=0"
       }
   }
   EOF

   # Test ReSpeaker microphone
   arecord -D reSpeaker -f cd -d 5 test.wav
   aplay test.wav
   ```

2. **ReSpeaker Hardware Control**
   ```python
   # respeaker_hardware_control.py
   import spidev
   import RPi.GPIO as GPIO
   import time
   import struct

   class ReSpeakerHardwareController:
       def __init__(self, spi_bus=0, spi_device=0):
           """
           Control ReSpeaker hardware features via SPI
           """
           self.spi = spidev.SpiDev()
           self.spi.open(spi_bus, spi_device)
           self.spi.max_speed_hz = 1000000  # 1MHz
           self.spi.mode = 0

           # GPIO setup for LEDs and other controls
           GPIO.setmode(GPIO.BCM)
           self.led_pins = [12, 13, 14, 15, 16, 17]  # GPIO pins for LEDs
           for pin in self.led_pins:
               GPIO.setup(pin, GPIO.OUT)

       def set_led_pattern(self, pattern: list):
           """
           Set LED pattern on ReSpeaker array
           pattern: list of 6 values (0-255) for each LED
           """
           for i, brightness in enumerate(pattern):
               # Send LED control command via SPI
               command = [0x70 + i, min(255, max(0, brightness))]  # Example protocol
               self.spi.xfer2(command)

       def set_led_vu_meter(self, audio_level: float):
           """
           Set LED as VU meter based on audio level
           """
           # Map audio level (0.0-1.0) to number of LEDs to light
           num_leds = int(audio_level * 6)
           pattern = [255 if i < num_leds else 0 for i in range(6)]
           self.set_led_pattern(pattern)

       def set_led_direction(self, direction: int):
           """
           Light LED in direction of sound source
           direction: 0-5 (corresponding to mic positions)
           """
           pattern = [255 if i == direction else 0 for i in range(6)]
           self.set_led_pattern(pattern)

       def close(self):
           """Clean up hardware resources"""
           self.spi.close()
           GPIO.cleanup()

   # Example usage
   respeaker_ctrl = ReSpeakerHardwareController()
   ```

### Real-time Whisper Processing Pipeline

```python
# real_time_whisper_pipeline.py
import pyaudio
import numpy as np
import threading
import queue
import time
from collections import deque
import whisper
import torch

class RealTimeWhisperProcessor:
    def __init__(self, model_size="base"):
        """
        Real-time Whisper processing for voice commands
        """
        self.model_size = model_size
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = whisper.load_model(model_size).to(self.device)

        # Audio parameters
        self.sample_rate = 16000
        self.chunk_size = 1024
        self.buffer_duration = 5  # 5 seconds of audio buffer
        self.buffer_size = self.sample_rate * self.buffer_duration

        # Audio buffers
        self.audio_buffer = deque(maxlen=self.buffer_size)
        self.processing_queue = queue.Queue()
        self.command_queue = queue.Queue()

        # Audio stream
        self.audio = pyaudio.PyAudio()
        self.stream = None

        # Processing control
        self.running = False
        self.processing_thread = None
        self.command_callbacks = []

    def start_audio_capture(self):
        """Start audio capture from ReSpeaker microphone"""
        self.stream = self.audio.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=self.sample_rate,
            input=True,
            frames_per_buffer=self.chunk_size,
            stream_callback=self._audio_callback
        )
        self.running = True

        # Start processing thread
        self.processing_thread = threading.Thread(target=self._process_audio, daemon=True)
        self.processing_thread.start()

        print("Real-time Whisper processor started")

    def _audio_callback(self, in_data, frame_count, time_info, status):
        """Audio input callback function"""
        # Convert audio data to numpy array
        audio_array = np.frombuffer(in_data, dtype=np.int16).astype(np.float32) / 32768.0

        # Add to buffer
        for sample in audio_array:
            self.audio_buffer.append(sample)

        return (None, pyaudio.paContinue)

    def _process_audio(self):
        """Process audio in real-time for voice commands"""
        silence_threshold = 0.01  # Minimum amplitude to consider as speech
        min_command_duration = 0.5  # Minimum duration for a command (seconds)
        max_command_duration = 5.0  # Maximum duration to process (seconds)

        while self.running:
            # Check if we have enough audio data
            if len(self.audio_buffer) >= self.sample_rate * min_command_duration:
                # Convert buffer to numpy array
                audio_array = np.array(self.audio_buffer)

                # Check for speech activity (simple energy-based VAD)
                if self._is_speech_active(audio_array, silence_threshold):
                    # Extract a segment to process
                    segment_duration = min(len(audio_array) / self.sample_rate, max_command_duration)
                    segment_size = int(segment_duration * self.sample_rate)
                    segment = np.array(list(self.audio_buffer)[-segment_size:])

                    # Check for end of speech (silence)
                    if self._is_end_of_speech(segment, silence_threshold):
                        # Process the command
                        self._process_command_segment(segment)

            time.sleep(0.1)  # Check every 100ms

    def _is_speech_active(self, audio_data, threshold):
        """Check if speech is active in the audio data"""
        if len(audio_data) == 0:
            return False
        energy = np.mean(np.abs(audio_data))
        return energy > threshold

    def _is_end_of_speech(self, audio_segment, threshold, min_silence_duration=0.3):
        """Check if speech has ended (silence detected)"""
        # Look at the end of the segment for silence
        silence_samples = int(min_silence_duration * self.sample_rate)
        if len(audio_segment) < silence_samples:
            return False

        end_segment = audio_segment[-silence_samples:]
        avg_energy = np.mean(np.abs(end_segment))
        return avg_energy < threshold

    def _process_command_segment(self, audio_segment):
        """Process a complete voice command segment"""
        try:
            # Process with Whisper
            result = self.model.transcribe(
                audio_segment,
                language="en",
                temperature=0.0,
                compression_ratio_threshold=2.4,
                logprob_threshold=-1.0,
                no_speech_threshold=0.6
            )

            # Validate result
            if result['text'].strip() and self._calculate_confidence(result) > 0.7:
                command_text = result['text'].strip()
                confidence = self._calculate_confidence(result)

                # Add to command queue for processing
                self.command_queue.put({
                    'text': command_text,
                    'confidence': confidence,
                    'timestamp': time.time()
                })

                print(f"Recognized command: '{command_text}' (confidence: {confidence:.2f})")

        except Exception as e:
            print(f"Error processing audio segment: {e}")

    def _calculate_confidence(self, result):
        """Calculate confidence from Whisper result"""
        if 'avg_logprob' in result and result['avg_logprob'] is not None:
            logprob = result['avg_logprob']
            confidence = max(0.0, min(1.0, (logprob + 2.0) / 4.0))
            return confidence
        return 0.5

    def add_command_callback(self, callback):
        """Add callback function for processed commands"""
        self.command_callbacks.append(callback)

    def process_commands(self):
        """Process recognized commands"""
        while self.running:
            try:
                command = self.command_queue.get(timeout=1.0)
                for callback in self.command_callbacks:
                    try:
                        callback(command)
                    except Exception as e:
                        print(f"Error in command callback: {e}")
            except queue.Empty:
                continue

    def stop(self):
        """Stop the real-time processor"""
        self.running = False
        if self.stream:
            self.stream.stop_stream()
            self.stream.close()
        if self.audio:
            self.audio.terminate()

# Example usage
def handle_voice_command(command):
    """Callback function to handle recognized voice commands"""
    print(f"Processing command: {command['text']}")
    # Here you would integrate with ROS 2 to execute robot actions
    # For example: publish to a ROS 2 topic for the cognitive planning system

processor = RealTimeWhisperProcessor()
processor.add_command_callback(handle_voice_command)
processor.start_audio_capture()

try:
    # Keep running
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    processor.stop()
    print("Whisper processor stopped")
```

### ROS 2 Integration for Voice Commands

```python
# whisper_ros2_integration.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Float32
from sensor_msgs.msg import AudioData
import pyaudio
import numpy as np
import whisper
import torch
import threading
import queue
import time

class WhisperROS2Node(Node):
    def __init__(self):
        super().__init__('whisper_ros2_node')

        # Initialize Whisper model
        self.model_size = "base"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = whisper.load_model(self.model_size).to(self.device)

        # Audio parameters
        self.sample_rate = 16000
        self.chunk_size = 1024

        # Initialize PyAudio
        self.audio = pyaudio.PyAudio()

        # ROS 2 publishers
        self.command_publisher = self.create_publisher(String, 'voice_commands', 10)
        self.confidence_publisher = self.create_publisher(Float32, 'voice_confidence', 10)

        # ROS 2 subscribers
        self.audio_subscriber = self.create_subscription(
            AudioData,
            'microphone/audio_raw',
            self.audio_callback,
            10
        )

        # Audio processing queue
        self.audio_queue = queue.Queue()
        self.running = False
        self.processing_thread = None

        # Start audio processing
        self.start_audio_processing()

        self.get_logger().info('Whisper ROS2 Node initialized')

    def start_audio_processing(self):
        """Start audio processing thread"""
        self.running = True
        self.processing_thread = threading.Thread(target=self._process_audio_queue, daemon=True)
        self.processing_thread.start()

    def audio_callback(self, msg):
        """Callback for audio data from microphone"""
        try:
            # Convert audio data to numpy array
            audio_array = np.frombuffer(msg.data, dtype=np.int16).astype(np.float32) / 32768.0
            self.audio_queue.put(audio_array)
        except Exception as e:
            self.get_logger().error(f'Error processing audio: {e}')

    def _process_audio_queue(self):
        """Process audio data from queue"""
        while self.running:
            try:
                # Get audio data from queue
                audio_data = self.audio_queue.get(timeout=1.0)

                # Process with Whisper
                result = self.model.transcribe(
                    audio_data,
                    language="en",
                    temperature=0.0,
                    compression_ratio_threshold=2.4,
                    logprob_threshold=-1.0,
                    no_speech_threshold=0.6
                )

                # Validate and publish result
                confidence = self._calculate_confidence(result)
                if result['text'].strip() and confidence > 0.7:
                    command_text = result['text'].strip()

                    # Publish command
                    command_msg = String()
                    command_msg.data = command_text
                    self.command_publisher.publish(command_msg)

                    # Publish confidence
                    confidence_msg = Float32()
                    confidence_msg.data = confidence
                    self.confidence_publisher.publish(confidence_msg)

                    self.get_logger().info(f'Voice command: {command_text} (confidence: {confidence:.2f})')

            except queue.Empty:
                continue
            except Exception as e:
                self.get_logger().error(f'Error in audio processing: {e}')

    def _calculate_confidence(self, result):
        """Calculate confidence from Whisper result"""
        if 'avg_logprob' in result and result['avg_logprob'] is not None:
            logprob = result['avg_logprob']
            confidence = max(0.0, min(1.0, (logprob + 2.0) / 4.0))
            return confidence
        return 0.5

    def destroy_node(self):
        """Clean up resources"""
        self.running = False
        if self.processing_thread:
            self.processing_thread.join()
        if self.audio:
            self.audio.terminate()
        super().destroy_node()

def main(args=None):
    rclpy.init(args=args)
    whisper_node = WhisperROS2Node()

    try:
        rclpy.spin(whisper_node)
    except KeyboardInterrupt:
        pass
    finally:
        whisper_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Voice Command Validation and Error Handling

```python
# voice_command_validation.py
import re
import json
from typing import Dict, List, Tuple

class VoiceCommandValidator:
    def __init__(self):
        # Define valid command patterns
        self.command_patterns = {
            'navigation': [
                r'move to (.+)',
                r'go to (.+)',
                r'go (forward|backward|left|right)',
                r'approach (.+)',
                r'come to me'
            ],
            'manipulation': [
                r'pick up (.+)',
                r'grasp (.+)',
                r'lift (.+)',
                r'put (.+) (on|in|at) (.+)',
                r'place (.+) (on|in|at) (.+)'
            ],
            'interaction': [
                r'greet (.+)',
                r'say hello',
                r'wave',
                r'nod',
                r'follow me'
            ],
            'status': [
                r'what can you do',
                r'tell me about yourself',
                r'are you ready',
                r'help'
            ]
        }

        # Define valid object names
        self.valid_objects = [
            'cube', 'box', 'cylinder', 'ball', 'table', 'chair', 'door',
            'person', 'human', 'robot', 'object', 'item'
        ]

        # Define valid locations
        self.valid_locations = [
            'kitchen', 'living room', 'bedroom', 'office', 'hallway',
            'entrance', 'exit', 'left', 'right', 'front', 'back',
            'here', 'there', 'near', 'far'
        ]

    def validate_command(self, command_text: str, confidence: float) -> Dict:
        """
        Validate voice command and extract parameters
        """
        result = {
            'is_valid': False,
            'command_type': None,
            'parameters': {},
            'confidence': confidence,
            'suggested_corrections': []
        }

        # Check confidence threshold
        if confidence < 0.7:
            result['suggested_corrections'].append("Command confidence too low, please repeat clearly")
            return result

        # Normalize command text
        normalized_command = command_text.lower().strip()

        # Check against command patterns
        for cmd_type, patterns in self.command_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, normalized_command)
                if match:
                    result['is_valid'] = True
                    result['command_type'] = cmd_type
                    result['parameters'] = self._extract_parameters(match, cmd_type)
                    break
            if result['is_valid']:
                break

        # If command is not recognized, suggest alternatives
        if not result['is_valid']:
            result['suggested_corrections'] = self._suggest_corrections(normalized_command)

        return result

    def _extract_parameters(self, match, cmd_type: str) -> Dict:
        """Extract parameters from matched command"""
        params = {}
        groups = match.groups()

        if cmd_type == 'navigation':
            if len(groups) >= 1:
                params['target'] = groups[0].strip()
        elif cmd_type == 'manipulation':
            if len(groups) >= 1:
                params['object'] = groups[0].strip()
            if len(groups) >= 3:
                params['action'] = groups[1].strip()
                params['destination'] = groups[2].strip()
        elif cmd_type == 'interaction':
            if len(groups) >= 1:
                params['target'] = groups[0].strip()

        return params

    def _suggest_corrections(self, command: str) -> List[str]:
        """Suggest possible corrections for unrecognized commands"""
        suggestions = []

        # Check for similar sounding commands
        for cmd_type, patterns in self.command_patterns.items():
            for pattern in patterns:
                # Simple similarity check (this could be more sophisticated)
                if any(word in command for word in ['move', 'go', 'navigate']):
                    suggestions.append("Try saying 'go to kitchen' or 'move forward'")
                    break
                elif any(word in command for word in ['pick', 'grasp', 'lift']):
                    suggestions.append("Try saying 'pick up the red cube' or 'grasp the object'")
                    break
                elif any(word in command for word in ['hello', 'greet', 'wave']):
                    suggestions.append("Try saying 'greet the person' or 'wave'")
                    break

        if not suggestions:
            suggestions.append("I didn't understand that command. Available commands include: "
                             "move to [location], pick up [object], greet [person], say hello")

        return suggestions

    def get_command_suggestions(self) -> str:
        """Get a summary of available voice commands"""
        suggestions = "Available voice commands:\n"
        for cmd_type, patterns in self.command_patterns.items():
            suggestions += f"\n{cmd_type.title()} commands:\n"
            for pattern in patterns[:3]:  # Show first 3 patterns for each type
                suggestions += f"  - {pattern}\n"
        return suggestions

# Example usage
validator = VoiceCommandValidator()
test_commands = [
    "Move to the kitchen",
    "Pick up the red cube",
    "Greet the person",
    "What can you do"
]

for cmd in test_commands:
    result = validator.validate_command(cmd, 0.85)
    print(f"Command: '{cmd}'")
    print(f"Valid: {result['is_valid']}, Type: {result['command_type']}")
    print(f"Parameters: {result['parameters']}")
    if result['suggested_corrections']:
        print(f"Suggestions: {result['suggested_corrections']}")
    print()
```

### Performance Optimization for Edge Deployment

1. **Model Quantization for Whisper**
   ```python
   # whisper_quantization.py
   import torch
   import whisper
   import numpy as np

   def quantize_whisper_model(model_size="base", output_path="quantized_whisper.pt"):
       """
       Quantize Whisper model for edge deployment on Jetson Orin Nano
       """
       # Load model
       model = whisper.load_model(model_size)

       # Set model to evaluation mode
       model.eval()

       # Example input for calibration (dummy audio)
       dummy_input = torch.randn(1, 80, 3000)  # (batch, mel_filters, time)

       # Quantize the model using PyTorch's static quantization
       quantized_model = torch.quantization.quantize_dynamic(
           model,
           {torch.nn.Linear, torch.nn.Conv1d},
           dtype=torch.qint8
       )

       # Save quantized model
       torch.save(quantized_model.state_dict(), output_path)
       print(f"Quantized model saved to {output_path}")

       return quantized_model

   def benchmark_model_performance(original_model, quantized_model, test_audio):
       """
       Benchmark performance difference between original and quantized models
       """
       import time

       # Test original model
       start_time = time.time()
       original_result = original_model.transcribe(test_audio)
       original_time = time.time() - start_time

       # Test quantized model
       start_time = time.time()
       quantized_result = quantized_model.transcribe(test_audio)
       quantized_time = time.time() - start_time

       print(f"Original model time: {original_time:.2f}s")
       print(f"Quantized model time: {quantized_time:.2f}s")
       print(f"Speed improvement: {original_time/quantized_time:.2f}x")

   # Example usage
   # quantized_model = quantize_whisper_model()
   ```

2. **Audio Buffer Management**
   ```python
   # audio_buffer_manager.py
   from collections import deque
   import numpy as np
   import threading

   class AudioBufferManager:
       def __init__(self, sample_rate=16000, max_duration=10.0):
           """
           Manage audio buffers efficiently for real-time processing
           """
           self.sample_rate = sample_rate
           self.max_samples = int(sample_rate * max_duration)
           self.buffer = deque(maxlen=self.max_samples)
           self.lock = threading.Lock()
           self.total_samples = 0

       def add_audio(self, audio_data: np.ndarray):
           """Add audio data to the buffer"""
           with self.lock:
               for sample in audio_data:
                   self.buffer.append(sample)
               self.total_samples += len(audio_data)

       def get_recent_audio(self, duration: float) -> np.ndarray:
           """Get recent audio data of specified duration"""
           samples_needed = int(duration * self.sample_rate)
           with self.lock:
               recent_samples = list(self.buffer)[-samples_needed:]
               return np.array(recent_samples)

       def get_speech_segment(self, start_time: float, end_time: float) -> np.ndarray:
           """Get audio segment between specific times"""
           samples_per_sec = self.sample_rate
           start_idx = int(start_time * samples_per_sec)
           end_idx = int(end_time * samples_per_sec)

           with self.lock:
               if start_idx < 0:
                   start_idx = 0
               if end_idx > len(self.buffer):
                   end_idx = len(self.buffer)

               segment = list(self.buffer)[start_idx:end_idx]
               return np.array(segment)

       def clear_buffer(self):
           """Clear the audio buffer"""
           with self.lock:
               self.buffer.clear()
               self.total_samples = 0

       def get_buffer_stats(self):
           """Get buffer statistics"""
           with self.lock:
               return {
                   'current_duration': len(self.buffer) / self.sample_rate,
                   'total_samples': self.total_samples,
                   'buffer_full': len(self.buffer) >= self.buffer.maxlen
               }
   ```

### Best Practices for Voice Command Systems

1. **Robustness Considerations**
   - Implement confidence-based filtering to reject low-quality transcriptions
   - Use wake word detection to reduce false activations
   - Include command confirmation for critical actions
   - Provide audio feedback when commands are recognized

2. **Privacy and Security**
   - Process sensitive audio data locally when possible
   - Implement secure communication channels
   - Include privacy controls for voice data
   - Encrypt stored voice data if necessary

3. **User Experience**
   - Provide clear feedback when listening for commands
   - Support natural language variations for the same action
   - Include error recovery and clarification mechanisms
   - Allow for multi-turn conversations for complex tasks

## Troubleshooting

1. **Audio Capture Issues**: Verify ReSpeaker microphone connection and ALSA configuration
2. **Whisper Performance**: Check model size vs. computational resources, consider quantization
3. **Recognition Accuracy**: Adjust confidence thresholds and validate audio quality
4. **ROS 2 Integration**: Verify message type compatibility and network configuration
5. **Resource Constraints**: Monitor CPU/GPU usage and optimize buffer sizes

## Exercises

1. **ReSpeaker Setup**: Configure and test ReSpeaker microphone array with Jetson Orin Nano
2.
3. ** کمانڈ کی توثیق **: تسلیم شدہ صوتی احکامات کے لئے توثیق کا نظام بنائیں
4. ** ROS 2 انضمام **: ROS 2 میسج پاسنگ کے ساتھ صوتی کمانڈ پروسیسنگ کو مربوط کریں
5. ** وائس ٹو ایکشن پائپ لائن **: صوتی ان پٹ سے روبوٹ ایکشن پر عمل درآمد تک مکمل پائپ لائن بنائیں