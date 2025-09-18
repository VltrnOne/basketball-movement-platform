import os
import shutil
import json
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import cv2
import mediapipe as mp
from datetime import datetime

app = FastAPI(
    title="Basketball Movement Intelligence API",
    description="Real-time and post-session analytics for basketball performance with pose estimation",
    version="2.0.0"
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

# Define directories
UPLOAD_DIRECTORY = "./uploads"
ANALYSIS_DIRECTORY = "./analysis_results"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
os.makedirs(ANALYSIS_DIRECTORY, exist_ok=True)

# Initialize MediaPipe Pose solution
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    min_detection_confidence=0.5, 
    min_tracking_confidence=0.5,
    model_complexity=1
)

# Pydantic models
class HealthResponse(BaseModel):
    status: str
    message: str

class VideoUploadResponse(BaseModel):
    video_id: str
    status: str
    message: str
    filename: str
    safe_filename: str
    file_size: int

class PoseLandmark(BaseModel):
    x: float
    y: float
    z: float
    visibility: float

class BasketballMetrics(BaseModel):
    # Core Movement Metrics
    total_distance_covered: float  # Total distance in feet
    average_speed: float          # Average speed in mph
    max_speed: float              # Maximum speed in mph
    high_intensity_sprints: int   # Number of sprints > 15 mph
    
    # Trajectory Analysis
    court_coverage_percentage: float  # Percentage of court area covered
    movement_efficiency: float        # Direct vs. total distance ratio
    
    # Court Zone Distribution
    court_zone_distribution: dict     # Time spent in each zone
    paint_time_percentage: float      # Time in paint area
    three_point_time_percentage: float # Time in 3-point area
    
    # Performance Indicators
    acceleration_events: int          # Number of rapid speed changes
    direction_changes: int            # Number of significant direction changes

class VideoAnalysis(BaseModel):
    video_id: str
    status: str
    total_frames: int
    processed_frames: int
    pose_landmarks: List[Optional[List[PoseLandmark]]]
    basketball_metrics: BasketballMetrics
    analysis_metadata: dict

def analyze_video_for_pose(video_path: str, video_id: str):
    """
    Analyzes a video file to extract pose landmarks for each frame using MediaPipe.
    Calculates basketball metrics from pose data.
    """
    try:
        cap = cv2.VideoCapture(video_path)
        all_frames_landmarks = []
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        frame_count = 0
        processed_frames = 0
        
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break
            
            frame_count += 1
            
            # Convert the BGR image to RGB
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            
            # Process the image and find pose
            results = pose.process(image)
            
            # Extract landmarks if a pose is detected
            if results.pose_landmarks:
                frame_landmarks = []
                for landmark in results.pose_landmarks.landmark:
                    frame_landmarks.append(PoseLandmark(
                        x=landmark.x,
                        y=landmark.y,
                        z=landmark.z,
                        visibility=landmark.visibility
                    ))
                all_frames_landmarks.append(frame_landmarks)
                processed_frames += 1
            else:
                all_frames_landmarks.append(None)  # Add null if no pose detected
        
        cap.release()
        
        # Calculate basketball metrics from pose data
        basketball_metrics = calculate_basketball_metrics_from_pose(
            all_frames_landmarks, width, height, fps
        )
        
        # Create analysis result
        analysis_result = VideoAnalysis(
            video_id=video_id,
            status="completed",
            total_frames=total_frames,
            processed_frames=processed_frames,
            pose_landmarks=all_frames_landmarks,
            basketball_metrics=basketball_metrics,
            analysis_metadata={
                "model_version": "mediapipe_pose",
                "analysis_duration": total_frames / fps if fps > 0 else 0,
                "court_dimensions": {"width": width, "height": height},
                "fps": fps,
                "pose_detection_rate": (processed_frames / total_frames) * 100 if total_frames > 0 else 0
            }
        )
        
        # Save analysis results
        analysis_file = os.path.join(ANALYSIS_DIRECTORY, f"{video_id}_analysis.json")
        try:
            with open(analysis_file, 'w') as f:
                json.dump(analysis_result.dict(), f, indent=2, default=str)
            print(f"Analysis saved to: {analysis_file}")
        except Exception as e:
            print(f"Error saving analysis file: {e}")
            # Create a minimal analysis file if the full one fails
            minimal_analysis = {
                "video_id": video_id,
                "status": "completed",
                "total_frames": total_frames,
                "processed_frames": processed_frames,
                "pose_landmarks": [],
                "basketball_metrics": basketball_metrics.dict(),
                "analysis_metadata": analysis_result.analysis_metadata
            }
            with open(analysis_file, 'w') as f:
                json.dump(minimal_analysis, f, indent=2, default=str)
        
        return analysis_result
        
    except Exception as e:
        print(f"Error analyzing video: {e}")
        return None

def calculate_basketball_metrics_from_pose(pose_landmarks: List[Optional[List[PoseLandmark]]], 
                                         court_width: float, court_height: float, fps: float) -> BasketballMetrics:
    """
    Calculate basketball metrics from pose landmark data
    """
    if not pose_landmarks or len(pose_landmarks) < 2:
        return BasketballMetrics(
            total_distance_covered=0.0,
            average_speed=0.0,
            max_speed=0.0,
            high_intensity_sprints=0,
            court_coverage_percentage=0.0,
            movement_efficiency=0.0,
            court_zone_distribution={"paint": 0, "mid_range": 0, "three_point": 0, "baseline": 0},
            paint_time_percentage=0.0,
            three_point_time_percentage=0.0,
            acceleration_events=0,
            direction_changes=0
        )
    
    # Court Calibration Constants (NBA regulation court)
    REAL_COURT_LENGTH = 94.0  # feet
    REAL_COURT_WIDTH = 50.0   # feet
    PIXELS_PER_FOOT_X = court_width / REAL_COURT_LENGTH
    PIXELS_PER_FOOT_Y = court_height / REAL_COURT_WIDTH
    
    # Extract hip center positions (landmarks 23 and 24 are hips)
    hip_positions = []
    for frame_landmarks in pose_landmarks:
        if frame_landmarks and len(frame_landmarks) > 24:
            # Use average of left and right hip for center of mass
            left_hip = frame_landmarks[23]
            right_hip = frame_landmarks[24]
            if left_hip.visibility > 0.5 and right_hip.visibility > 0.5:
                center_x = (left_hip.x + right_hip.x) / 2
                center_y = (left_hip.y + right_hip.y) / 2
                hip_positions.append((center_x, center_y))
            else:
                hip_positions.append(None)
        else:
            hip_positions.append(None)
    
    # Filter out None positions
    valid_positions = [pos for pos in hip_positions if pos is not None]
    
    if len(valid_positions) < 2:
        return BasketballMetrics(
            total_distance_covered=0.0,
            average_speed=0.0,
            max_speed=0.0,
            high_intensity_sprints=0,
            court_coverage_percentage=0.0,
            movement_efficiency=0.0,
            court_zone_distribution={"paint": 0, "mid_range": 0, "three_point": 0, "baseline": 0},
            paint_time_percentage=0.0,
            three_point_time_percentage=0.0,
            acceleration_events=0,
            direction_changes=0
        )
    
    # Calculate distances and speeds in real-world units
    distances = []
    speeds = []
    direction_changes = 0
    
    for i in range(1, len(valid_positions)):
        prev = valid_positions[i-1]
        curr = valid_positions[i]
        
        # Convert pixel distances to real-world feet
        pixel_distance = ((curr[0] - prev[0])**2 + (curr[1] - prev[1])**2)**0.5
        real_distance = pixel_distance / ((PIXELS_PER_FOOT_X + PIXELS_PER_FOOT_Y) / 2)
        distances.append(real_distance)
        
        # Calculate speed in mph
        time_diff = 1.0 / fps if fps > 0 else 0.033  # seconds per frame
        speed_fps = real_distance / time_diff  # feet per second
        speed_mph = speed_fps * 0.681818  # Convert to mph
        speeds.append(speed_mph)
        
        # Detect direction changes
        if i > 1:
            prev_prev = valid_positions[i-2]
            # Calculate direction vectors
            dir1_x = prev[0] - prev_prev[0]
            dir1_y = prev[1] - prev_prev[1]
            dir2_x = curr[0] - prev[0]
            dir2_y = curr[1] - prev[1]
            
            # Calculate angle between directions
            if (dir1_x != 0 or dir1_y != 0) and (dir2_x != 0 or dir2_y != 0):
                dot_product = dir1_x * dir2_x + dir1_y * dir2_y
                mag1 = (dir1_x**2 + dir1_y**2)**0.5
                mag2 = (dir2_x**2 + dir2_y**2)**0.5
                if mag1 > 0 and mag2 > 0:
                    cos_angle = dot_product / (mag1 * mag2)
                    cos_angle = max(-1, min(1, cos_angle))
                    import math
                    angle = math.acos(cos_angle)
                    if angle > math.pi / 3:  # 60 degrees threshold
                        direction_changes += 1
    
    # Calculate core metrics
    total_distance = sum(distances)
    avg_speed = sum(speeds) / len(speeds) if speeds else 0
    max_speed = max(speeds) if speeds else 0
    
    # Calculate high-intensity sprints (> 15 mph)
    high_intensity_sprints = sum(1 for speed in speeds if speed > 15.0)
    
    # Calculate acceleration events
    acceleration_threshold = 3.0  # mph/s
    acceleration_events = 0
    for i in range(1, len(speeds)):
        time_diff = 1.0 / fps if fps > 0 else 0.033
        if time_diff > 0:
            acceleration = abs(speeds[i] - speeds[i-1]) / time_diff
            if acceleration > acceleration_threshold:
                acceleration_events += 1
    
    # Calculate court zone distribution
    zone_counts = {"paint": 0, "mid_range": 0, "three_point": 0, "baseline": 0}
    paint_time = 0
    three_point_time = 0
    
    for pos in valid_positions:
        x, y = pos[0] * court_width, pos[1] * court_height  # Convert to pixel coordinates
        
        # Convert to real court coordinates
        real_x = x / PIXELS_PER_FOOT_X
        real_y = y / PIXELS_PER_FOOT_Y
        
        # Define court zones based on NBA dimensions
        if real_x < 19:  # Left side
            if real_y < 8 or real_y > 42:
                zone_counts["baseline"] += 1
            elif 8 <= real_y <= 42:
                zone_counts["paint"] += 1
                paint_time += 1
            else:
                zone_counts["three_point"] += 1
                three_point_time += 1
        elif real_x < 75:  # Center court
            if 8 <= real_y <= 42:
                zone_counts["paint"] += 1
                paint_time += 1
            else:
                zone_counts["mid_range"] += 1
        else:  # Right side
            if real_y < 8 or real_y > 42:
                zone_counts["baseline"] += 1
            elif 8 <= real_y <= 42:
                zone_counts["paint"] += 1
                paint_time += 1
            else:
                zone_counts["three_point"] += 1
                three_point_time += 1
    
    # Convert to percentages
    total_points = len(valid_positions)
    zone_distribution = {zone: (count / total_points) * 100 for zone, count in zone_counts.items()}
    paint_time_percentage = (paint_time / total_points) * 100
    three_point_time_percentage = (three_point_time / total_points) * 100
    
    # Calculate court coverage percentage
    grid_size = 10
    covered_cells = set()
    for pos in valid_positions:
        x, y = pos[0] * court_width, pos[1] * court_height
        grid_x = int((x / court_width) * grid_size)
        grid_y = int((y / court_height) * grid_size)
        covered_cells.add((grid_x, grid_y))
    
    court_coverage_percentage = (len(covered_cells) / (grid_size * grid_size)) * 100
    
    # Calculate movement efficiency
    if len(valid_positions) > 1:
        start = valid_positions[0]
        end = valid_positions[-1]
        start_real_x = start[0] * court_width / PIXELS_PER_FOOT_X
        start_real_y = start[1] * court_height / PIXELS_PER_FOOT_Y
        end_real_x = end[0] * court_width / PIXELS_PER_FOOT_X
        end_real_y = end[1] * court_height / PIXELS_PER_FOOT_Y
        straight_line_distance = ((end_real_x - start_real_x)**2 + (end_real_y - start_real_y)**2)**0.5
        movement_efficiency = (straight_line_distance / total_distance) * 100 if total_distance > 0 else 0
    else:
        movement_efficiency = 0
    
    return BasketballMetrics(
        total_distance_covered=round(total_distance, 2),
        average_speed=round(avg_speed, 2),
        max_speed=round(max_speed, 2),
        high_intensity_sprints=high_intensity_sprints,
        court_coverage_percentage=round(court_coverage_percentage, 1),
        movement_efficiency=round(movement_efficiency, 1),
        court_zone_distribution=zone_distribution,
        paint_time_percentage=round(paint_time_percentage, 1),
        three_point_time_percentage=round(three_point_time_percentage, 1),
        acceleration_events=acceleration_events,
        direction_changes=direction_changes
    )

# Routes
@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(
        status="healthy",
        message="Basketball Movement Intelligence API with Pose Estimation is running"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="API is operational"
    )

@app.post("/videos/upload", response_model=VideoUploadResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload a video file for pose analysis
    """
    try:
        # Generate unique video ID
        video_id = str(uuid.uuid4())
        
        # Create filename with video ID
        file_extension = os.path.splitext(file.filename)[1]
        safe_filename = f"{video_id}{file_extension}"
        file_path = os.path.join(UPLOAD_DIRECTORY, safe_filename)
        
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Start background pose analysis
        background_tasks.add_task(analyze_video_for_pose, file_path, video_id)
        
        return VideoUploadResponse(
            video_id=video_id,
            status="uploaded",
            message=f"Video uploaded successfully. Pose analysis started.",
            filename=file.filename,
            safe_filename=safe_filename,
            file_size=file_size
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading video: {str(e)}"
        )

@app.get("/videos/{video_id}/analysis", response_model=VideoAnalysis)
async def get_video_analysis(video_id: str):
    """
    Get pose analysis results for a video
    """
    try:
        analysis_file = os.path.join(ANALYSIS_DIRECTORY, f"{video_id}_analysis.json")
        
        if not os.path.exists(analysis_file):
            raise HTTPException(
                status_code=404,
                detail="Analysis not found. Video may still be processing."
            )
        
        with open(analysis_file, 'r') as f:
            analysis_data = json.load(f)
        
        return VideoAnalysis(**analysis_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving analysis: {str(e)}"
        )

@app.get("/videos/{video_id}/status")
async def get_video_status(video_id: str):
    """
    Get the processing status of a video
    """
    analysis_file = os.path.join(ANALYSIS_DIRECTORY, f"{video_id}_analysis.json")
    
    if os.path.exists(analysis_file):
        return {"status": "completed", "message": "Pose analysis finished"}
    else:
        return {"status": "processing", "message": "Pose analysis in progress"}

@app.get("/analysis/{pose_data_filename}")
def get_analysis_data(pose_data_filename: str):
    """
    Get raw pose data for a specific video
    """
    file_path = os.path.join(ANALYSIS_DIRECTORY, pose_data_filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Analysis data not found.")

@app.get("/uploads/{video_filename}")
def get_video_file(video_filename: str):
    """
    Serve uploaded video files
    """
    file_path = os.path.join(UPLOAD_DIRECTORY, video_filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="video/mp4")
    raise HTTPException(status_code=404, detail="Video file not found.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)