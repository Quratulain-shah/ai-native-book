# Physical AI & Humanoid Robotics Platform

<div align="center">
  <h3>📚 Interactive Learning Platform for Physical AI and Humanoid Robotics</h3>
  <p>A comprehensive educational platform combining modern web technologies with AI capabilities to create an immersive learning experience.</p>
</div>

## 📖 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Course Content](#course-content)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

The Physical AI & Humanoid Robotics Platform is a cutting-edge educational system designed to teach **Physical AI** and **Humanoid Robotics** concepts through an interactive, web-based learning environment. This platform combines a modern Docusaurus-based frontend with a powerful AI-driven backend to deliver an immersive learning experience for students and professionals interested in embodied artificial intelligence.

The platform follows a "Theory → Digital Twin → Physical Deployment" pedagogical approach, ensuring students first understand fundamental concepts before applying them in simulation, and finally deploying them on real hardware.

## 🚀 Key Features

### 📚 Interactive Learning Environment
- **Focus Mode Reading**: Distraction-free reading experience with adjustable text size and layout
- **Progress Tracking**: Automatic tracking of reading progress with visual progress bars
- **Interactive Books**: Dynamic book viewing with authentication gate for premium content
- **Embedded Quizzes**: Real-time knowledge checks with immediate feedback and scoring
- **Multimedia Integration**: Seamless embedding of videos, diagrams, and interactive content

### 🌐 Multi-Language Support
- **Real-time Translation**: On-the-fly translation of course content to Urdu
- **RTL Support**: Proper right-to-left text rendering for Urdu and other RTL languages
- **Cultural Adaptation**: Context-aware translation maintaining educational context

### 🤖 AI-Powered Features
- **RAG (Retrieval Augmented Generation)**: Ask questions about course content with AI-powered answers
- **Contextual Q&A**: Ability to ask questions about specific text selections
- **Semantic Search**: Intelligent search through course content using vector embeddings
- **Content Generation**: AI-assisted content creation and explanation

### 🔐 Authentication & Security
- **Better Auth Integration**: Secure authentication with Google OAuth support
- **Session Management**: Proper session handling and user state management
- **Premium Content Gate**: Authentication required for accessing premium educational content
- **User Progress Tracking**: Personalized learning paths and progress monitoring

### 🎮 Interactive Components
- **3D Visualizations**: React Three Fiber integration for interactive 3D graphics
- **Spline Tool Integration**: Advanced 3D scene rendering capabilities
- **Knowledge Maps**: Interactive visual representations of learning paths and concepts
- **Robotics Diagrams**: Dynamic rendering of robotics concepts and architectures

### 📱 Responsive Design
- **Mobile-First Approach**: Fully responsive design for all device sizes
- **Dark/Light Themes**: User preference-based theme switching
- **Accessibility**: WCAG-compliant design for inclusive learning
- **Performance Optimized**: Fast loading times and smooth interactions

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Docusaurus v3.9.2 (React-based static site generator)
- **Language**: TypeScript with React components
- **Styling**: Tailwind CSS with custom CSS modules
- **3D Graphics**: React Three Fiber, Spline Tool integration
- **Authentication**: Better Auth with Google OAuth
- **State Management**: React hooks and context API

### Backend Stack
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy with PostgreSQL/SQLite
- **Vector Database**: Qdrant for semantic search and RAG functionality
- **AI Services**: OpenAI API integration for content generation
- **Translation**: DeepTranslator library for multi-language support
- **Authentication**: Better Auth integration

### Deployment Architecture
- **Frontend**: GitHub Pages hosting
- **Backend**: Hugging Face Spaces containerized deployment
-- **Database**: PostgreSQL/SQLite for user data and content
- **Vector Store**: Qdrant for semantic search capabilities


## 🛠️ Installation

### Prerequisites
- Node.js (version 20.0 or higher)
- Python (version 3.8 or higher)
- Docker (for backend containerization)
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Quratulainshah/Spec-Driven-Development-Hackathon-I.git
cd Spec-Driven-Development-Hackathon-I

# Install dependencies
npm install

# Start the development server
npm start

# The application will be available at http://localhost:3000
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env file with your API keys and configuration

# Start the backend server
uvicorn src.main:app --reload --port 8000
```

## 📖 Usage

### Starting the Application
1. **Start the backend server**:
   ```bash
   cd backend
   uvicorn src.main:app --reload --port 8000
   ```

2. **Start the frontend**:
   ```bash
   npm start
   ```

3. **Access the application** at `http://localhost:3000`

### Core Features Usage

#### Reading Books
1. Navigate to the books section
2. Authenticate with your credentials
3. Browse available books and modules
4. Use focus mode for distraction-free reading
5. Track your reading progress

#### Interactive Learning
1. Complete embedded quizzes after each section
2. Watch integrated videos and multimedia content
3. Use the translation feature for Urdu content
4. Ask questions using the AI chat feature

#### AI-Powered Assistance
1. Use the chat widget to ask questions about course content
2. Select text and ask specific questions about it
3. Get personalized explanations based on your queries

## 📁 Project Structure

```
Spec-Driven-Development-Hackathon-I/
├── docs/                    # Course content and documentation
│   ├── 01-module-1/         # Module 1: The Robotic Nervous System
│   ├── 02-module-2/         # Module 2: The Digital Twin
│   ├── 03-module-3/         # Module 3: The AI-Robot Brain
│   ├── 04-module-4/         # Module 4: Vision-Language-Action
│   └── intro/               # Introduction and pedagogical approach
├── src/                     # Frontend source code
│   ├── components/          # React components
│   │   ├── Book/           # Book-related components
│   │   ├── ChatWidget/     # AI chat functionality
│   │   ├── Auth/           # Authentication components
│   │   └── ui/             # UI components and utilities
│   ├── pages/              # Docusaurus pages
│   ├── theme/              # Theme customization
│   └── lib/                # Utility functions
├── backend/                 # Backend API server
│   ├── src/                # Python source code
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── main.py         # Main API entry point
│   │   ├── database.py     # Database configuration
│   │   └── services/       # Backend services
│   └── requirements.txt    # Python dependencies
├── specs/                   # Feature specifications (Spec-Driven Development)
├── blog/                    # Blog content
├── static/                  # Static assets
└── package.json            # Frontend dependencies
```

## 🌐 API Endpoints

### Book Management
- `GET /books/{book_id}` - Retrieve book content
- `POST /books` - Create new book
- `PUT /books/{book_id}` - Update book content
- `POST /books/{book_id}/translate` - Translate book to Urdu

### AI Services
- `POST /query/general` - General questions about course content
- `POST /query/selected-text` - Questions about specific text selections
- `POST /translate-text` - General text translation

### Health Check
- `GET /` - API health status and service availability

## 🛠️ Technologies Used

### Frontend Technologies
- **Docusaurus**: Static site generator for documentation and learning content
- **React**: Component-based UI development
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **React Three Fiber**: 3D graphics rendering
- **Better Auth**: Authentication and user management
- **Framer Motion**: Smooth animations and transitions

### Backend Technologies
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Qdrant**: Vector database for semantic search
- **OpenAI API**: AI-powered content generation
- **DeepTranslator**: Multi-language translation
- **Pydantic**: Data validation and serialization

### Development Tools
- **Docker**: Containerization for deployment
- **GitHub Actions**: CI/CD pipeline
- **Hugging Face Spaces**: Backend hosting
- **PostgreSQL**: Production database

## 📚 Course Content

The curriculum is organized into four progressive modules following the "Theory → Digital Twin → Physical Deployment" pedagogical flow:

### Module 1: The Robotic Nervous System (Weeks 3-5)
- ROS 2 fundamentals and basic robot control
- Nodes, topics, and services
- URDF modeling and digital twin simulation
- Python implementation with rclpy
- Digital twin simulation and physical deployment

### Module 2: The Digital Twin (Weeks 6-7)
- Gazebo physics simulation
- Unity rendering and visualization
- Sensor integration and data processing
- LiDAR and depth camera systems
- Digital twin exercises and sim-to-real transfer

### Module 3: The AI-Robot Brain (Weeks 8-10)
- NVIDIA Isaac Sim and ROS integration
- VSLAM navigation and mapping
- Navigation2 systems
- Reinforcement learning for robotics
- Digital twin training and physical deployment

### Module 4: Vision-Language-Action (Weeks 11-13)
- Vision-Language-Action systems
- Audio processing with Whisper
- LLM-based cognitive planning
- Autonomous humanoid capstone projects
- Simulated and physical capstone deployment

### Learning Objectives
By the end of this course, students will be able to:
1. Understand the theoretical foundations of embodied intelligence and the unique challenges of physical AI systems
2. Implement robotic systems using ROS 2 (Robot Operating System 2) and related middleware
3. Design and deploy AI algorithms on edge computing platforms, specifically the NVIDIA Jetson Orin Nano
4. Develop perception systems that integrate multiple sensor modalities (LiDAR, cameras, IMU)
5. Create control systems that enable safe and effective physical interaction
6. Apply Vision-Language-Action (VLA) systems to enable natural human-robot interaction
7. Execute sim-to-real transfer techniques to deploy simulation-trained systems in the physical world

### Hardware Platform Overview
The course utilizes state-of-the-art hardware platforms:
- **NVIDIA Jetson Orin Nano**: High-performance edge computing platform optimized for AI workloads
- **Intel RealSense D435i**: Advanced depth sensing and computer vision capabilities
- **Unitree Go2/G1**: Advanced quadrupedal robots demonstrating dynamic locomotion
- **RTX Workstation**: High-performance computing for simulation and development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add documentation for new features
- Ensure all tests pass before submitting
- Keep PRs focused on a single feature or bug fix

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🙏 Acknowledgments

- The Physical AI & Humanoid Robotics Platform represents a comprehensive educational initiative combining cutting-edge technology with pedagogical best practices
- Special thanks to the open-source community for the tools and libraries that made this project possible
- The platform demonstrates the potential of AI-assisted learning in technical education

---

<div align="center">
  <p>Made with ❤️ for the future of robotics education</p>
  <p>© 2025 Physical AI & Humanoid Robotics Platform</p>
</div>