# Physical AI & Humanoid Robotics Textbook

This project contains the implementation of a comprehensive Physical AI & Humanoid Robotics textbook following a 13-week curriculum structure. The textbook covers ROS 2 fundamentals, Digital Twin simulations, NVIDIA Isaac ecosystem, and Vision-Language-Action systems with a focus on the "Theory → Simulation → Physical Deployment" pedagogical flow.

## Project Structure

```
├── frontend/                 # Docusaurus documentation (textbook content)
│   ├── docs/                # Textbook content organized by modules
│   │   ├── intro/           # Introduction and syllabus content
│   │   ├── 01-module-1/     # Module 1: The Robotic Nervous System (Weeks 3-5)
│   │   ├── 02-module-2/     # Module 2: The Digital Twin (Weeks 6-7)
│   │   ├── 03-module-3/     # Module 3: The AI-Robot Brain (Weeks 8-10)
│   │   ├── 04-module-2/     # Module 4: Vision-Language-Action (Weeks 11-13)
│   │   └── capstone/        # Capstone project content
│   ├── src/
│   │   ├── components/      # Custom Docusaurus components
│   │   ├── pages/           # Additional pages beyond docs
│   │   └── css/             # Custom styling
│   ├── docusaurus.config.js # Docusaurus configuration
│   ├── sidebars.js          # Navigation sidebar configuration
│   └── package.json         # Node.js dependencies
├── backend/
│   ├── src/
│   │   ├── models/          # Data models for backend services
│   │   ├── services/        # Business logic services
│   │   ├── api/             # API endpoints
│   │   └── main.py          # FastAPI application entry point
│   ├── tests/               # Backend tests
│   └── requirements.txt     # Python dependencies
└── specs/                   # Specification and plan documents
```

## Frontend Setup (Docusaurus)

The frontend is built using Docusaurus, a modern static website generator for documentation.

### Installation

```bash
cd frontend
npm install
```

### Local Development

```bash
cd frontend
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
cd frontend
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Backend Setup (FastAPI)

The backend is built using FastAPI, a modern, fast web framework for building APIs with Python 3.7+ based on standard Python type hints.

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Running the Server

```bash
cd backend
python -m src.main
```

Or using uvicorn directly:

```bash
cd backend
uvicorn src.main:app --reload
```

## Features

- **Docusaurus-based textbook**: Responsive, searchable documentation with modern UI
- **FastAPI backend**: RESTful API with automatic documentation (Swagger UI/ReDoc)
- **Authentication**: User registration and login system
- **Content Management**: Module and content unit management
- **RAG Chatbot**: Retrieval-Augmented Generation chatbot for interactive learning
- **Progress Tracking**: Student progress and completion tracking
- **Multilingual Support**: Support for Urdu translation (bonus feature)

## API Documentation

Once the backend server is running, API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Technologies Used

- **Frontend**: Docusaurus, React, Markdown
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL (via Neon Serverless)
- **Vector Store**: Qdrant Cloud
- **AI Services**: OpenAI API
- **Authentication**: Better-Auth.com
- **Deployment**: GitHub Pages (frontend), Cloud platform (backend)