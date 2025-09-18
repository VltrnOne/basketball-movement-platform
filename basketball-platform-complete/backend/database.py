from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
import os

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://basketball_user:YourSuperStrongPassword@localhost:5432/basketball_db"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String)  # player, coach, analyst, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    sessions = relationship("Session", back_populates="user")
    players = relationship("Player", back_populates="user")

class Player(Base):
    __tablename__ = "players"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String, index=True)
    jersey_number = Column(Integer)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"))
    position = Column(String)
    height = Column(Float)  # in cm
    weight = Column(Float)  # in kg
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="players")
    team = relationship("Team", back_populates="players")
    stats = relationship("PlayerStats", back_populates="player")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    color_primary = Column(String)
    color_secondary = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    players = relationship("Player", back_populates="team")
    sessions = relationship("Session", back_populates="team")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"))
    name = Column(String)
    session_type = Column(String)  # live, uploaded
    video_url = Column(String)
    status = Column(String)  # processing, completed, failed
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime)
    duration = Column(Float)  # in seconds
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    team = relationship("Team", back_populates="sessions")
    player_stats = relationship("PlayerStats", back_populates="session")
    penalties = relationship("Penalty", back_populates="session")

class PlayerStats(Base):
    __tablename__ = "player_stats"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id"))
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    minutes_played = Column(Float)
    distance_covered = Column(Float)  # in meters
    acceleration_bursts = Column(Integer)
    jump_count = Column(Integer)
    fatigue_score = Column(Float)
    heart_rate = Column(Float)  # if available
    speed_max = Column(Float)
    speed_avg = Column(Float)
    
    # Relationships
    player = relationship("Player", back_populates="stats")
    session = relationship("Session", back_populates="player_stats")

class Penalty(Base):
    __tablename__ = "penalties"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"))
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id"))
    penalty_type = Column(String)  # travelling, double_dribble, defensive_three_seconds, etc.
    timestamp = Column(DateTime)
    confidence = Column(Float)
    description = Column(Text)
    video_timestamp = Column(Float)  # timestamp in video
    
    # Relationships
    session = relationship("Session", back_populates="penalties")
    player = relationship("Player")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
