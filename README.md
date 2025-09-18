# Basketball Movement Intelligence Platform

A comprehensive platform for real-time and post-session analytics of basketball performance, featuring player tracking, penalty detection, fatigue monitoring, and detailed statistics.

## 🏀 Features

- **Real-time Analysis**: Live video streaming with instant pose tracking and penalty detection
- **Video Upload**: Process recorded games with automated player detection and analytics
- **Player Statistics**: Detailed performance metrics including distance, speed, jumps, and fatigue
- **Penalty Detection**: AI-powered detection of traveling, double dribble, and other violations
- **Fatigue Monitoring**: Real-time alerts for player fatigue and injury prevention
- **Team Management**: Multi-player tracking with team and individual statistics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL 12+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up your database:
   ```bash
   # Update DATABASE_URL in database.py with your PostgreSQL credentials
   # Then run the application
   python main.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## 🏗️ Architecture

### Backend (FastAPI)
- **API Layer**: RESTful endpoints for video upload, stats retrieval, and real-time data
- **Database**: PostgreSQL with SQLAlchemy ORM for data persistence
- **Computer Vision**: YOLOv8 for player detection, MMPose for pose estimation
- **Queue System**: Redis/Celery for asynchronous video processing

### Frontend (React + TypeScript)
- **Dashboard**: Overview of sessions, players, and key metrics
- **Video Upload**: Drag-and-drop interface for video analysis
- **Live Analysis**: Real-time streaming with overlay statistics
- **Player Stats**: Detailed performance analytics and trends

## 📊 Data Models

- **Users**: Coaches, players, and analysts with role-based access
- **Players**: Individual athlete profiles with physical attributes
- **Teams**: Team management with player assignments
- **Sessions**: Game/practice sessions with video and metadata
- **PlayerStats**: Time-series performance data
- **Penalties**: Detected violations with confidence scores

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://basketball_user:password@localhost:5432/basketball_db
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
REDIS_URL=redis://localhost:6379
```

### Database Setup

1. Install PostgreSQL and create the database:
   ```sql
   CREATE DATABASE basketball_db;
   CREATE USER basketball_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE basketball_db TO basketball_user;
   ```

2. Run the application to create tables automatically

## 🎯 Roadmap

### Phase 1 - MVP (Current)
- [x] Basic project structure
- [x] Database models and API endpoints
- [x] Frontend dashboard and navigation
- [x] Video upload interface
- [x] Player statistics display
- [x] Live analysis mockup

### Phase 2 - Core Features
- [ ] Video processing pipeline
- [ ] Player detection and tracking
- [ ] Pose estimation integration
- [ ] Penalty detection algorithms
- [ ] Real-time WebRTC streaming

### Phase 3 - Advanced Analytics
- [ ] Fatigue modeling
- [ ] Injury risk assessment
- [ ] Team performance analytics
- [ ] Export and reporting features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [YOLOv8](https://github.com/ultralytics/ultralytics) for object detection
- [MMPose](https://github.com/open-mmlab/mmpose) for pose estimation
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend
