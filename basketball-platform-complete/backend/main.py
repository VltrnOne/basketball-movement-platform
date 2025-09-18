from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
from supabase_client import supabase_client
from auth import get_current_user, get_current_user_profile
import uvicorn

app = FastAPI(
    title="Basketball Movement Intelligence API",
    description="Real-time and post-session analytics for basketball performance",
    version="1.0.0"
)

# CORS middleware
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://datdatit.com",
    "https://www.datdatit.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase = supabase_client.get_client()

# Pydantic models
class HealthResponse(BaseModel):
    status: str
    message: str

class VideoUploadResponse(BaseModel):
    video_id: str
    status: str
    message: str

class PlayerStats(BaseModel):
    player_id: str
    minutes_played: float
    distance_covered: float
    acceleration_bursts: int
    jump_count: int
    fatigue_score: float

class PenaltyDetection(BaseModel):
    timestamp: float
    penalty_type: str
    confidence: float
    player_id: str
    description: str

# Routes
@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(
        status="healthy",
        message="Basketball Movement Intelligence API is running"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="API is operational"
    )

@app.post("/upload-video", response_model=VideoUploadResponse)
async def upload_video(user = Depends(get_current_user)):
    # TODO: Implement video upload logic with Supabase storage
    return VideoUploadResponse(
        video_id="temp_id_123",
        status="pending",
        message="Video upload endpoint - implementation pending"
    )

@app.get("/player-stats/{player_id}", response_model=PlayerStats)
async def get_player_stats(player_id: str, user = Depends(get_current_user)):
    # TODO: Implement player stats retrieval from Supabase
    return PlayerStats(
        player_id=player_id,
        minutes_played=0.0,
        distance_covered=0.0,
        acceleration_bursts=0,
        jump_count=0,
        fatigue_score=0.0
    )

@app.get("/penalties/{session_id}", response_model=List[PenaltyDetection])
async def get_penalties(session_id: str, user = Depends(get_current_user)):
    # TODO: Implement penalty detection retrieval from Supabase
    return []

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
