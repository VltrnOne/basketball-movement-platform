import os
from typing import Optional

class Settings:
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://qijavtpkszgpaqeohrwt.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sbp_539599b21db43f4644894d6d7d7906f422e00a30")
    
    # Database Configuration (optional, for direct access)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    # JWT Configuration
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-jwt-secret-key")
    
    # Redis Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # CORS Configuration
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 2 * 1024 * 1024 * 1024  # 2GB
    ALLOWED_VIDEO_TYPES: list = ["video/mp4", "video/mov", "video/avi", "video/mkv"]
    
    # Video Processing Configuration
    VIDEO_PROCESSING_TIMEOUT: int = 3600  # 1 hour
    FRAME_RATE: int = 30
    
    # Basketball Court Configuration
    COURT_LENGTH: float = 28.0  # meters
    COURT_WIDTH: float = 15.0   # meters

settings = Settings()
