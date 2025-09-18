# Basketball Movement Intelligence Platform Plan

## 1. Product Vision
Create an open-source, extensible platform that delivers real-time and post-session analytics for basketball performance. The system should help players and coaches improve technique, identify penalties and fouls, monitor fatigue to prevent injuries, and keep rich statistics. The architecture must support both live streams and uploaded videos, and provide a clear path to expand coverage to additional sports.

## 2. Target Users & Use Cases
- **Players**: Technique feedback, fatigue alerts, personal stat dashboards.
- **Coaches & Trainers**: Live game insights, penalty detection, workload monitoring, comparative analytics across athletes.
- **Team Analysts**: Aggregate metrics across games, video tagging, export to scouting reports.
- **Leagues & Referees**: Rule enforcement support, audit trails of penalties.

Key scenarios:
1. Real-time sideline capture from mobile device providing fatigue alerts and foul detection notifications.
2. Post-game video upload producing annotated timelines of penalties, per-player movement metrics, and injury risk indicators.
3. Cross-game trend reports that surface conditioning needs and highlight improvement opportunities.

## 3. Functional Requirements
### Live Analysis
- Web or mobile capture using WebRTC (browser) or RTMP (camera rigs).
- Sub-second pose tracking for all visible players.
- Immediate alerts for likely penalties (travelling, double-dribble, defensive three seconds) with confidence scores.
- Player load and fatigue estimations updated every possession.

### Uploaded Video Analysis
- Support MP4/MOV uploads up to 2 hours.
- Automated player detection, team classification (colors/jerseys), and tracking across the video timeline.
- Generation of annotated clips for penalties and key plays.
- Export JSON/CSV summaries and highlight reels.

### Shared Features
- Athlete and team profiles, configurable thresholds for fatigue/penalty alerts.
- Stat dashboards: minutes played, distance covered, acceleration bursts, jump counts, shot charts (if ball detection available).
- Collaboration tools: tag plays, add coaching notes, share with athletes.

## 4. Non-Functional Requirements
- <200ms incremental latency for live alerts.
- Configurable accuracy thresholds for pose estimation (precision/recall targets >90%).
- Scalable to handle 10 simultaneous games with GPU-backed processing workers.
- Privacy & security: secure video storage, access control via role-based auth.
- Observability: tracing for video processing stages, health checks for worker nodes.

## 5. High-Level Architecture
1. **Capture & Ingestion Layer**
   - Live: WebRTC stream from client to ingest server (e.g., [LiveKit](https://github.com/livekit/livekit) or [Jellyfin WebRTC ingest](https://github.com/jellyfin/jellyfin)).
   - Uploads: Signed URL to object storage (Supabase Storage, MinIO, or S3-compatible bucket).
2. **API Gateway & Orchestration**
   - REST/gRPC APIs built with FastAPI or Node (NestJS) for session management, job creation, auth (Supabase Auth or Keycloak).
   - Queue jobs (Redis Streams, RabbitMQ, or Apache Kafka) for video frames/segments awaiting analysis.
3. **Computer Vision & Analytics Workers**
   - Containerized Python services (FastAPI + Celery / Prefect) running on GPU nodes.
   - Pipeline: detection → pose estimation → tracking → event classification → metric aggregation.
4. **Data Storage & Analytics**
   - Timeseries metrics in TimescaleDB (Postgres extension) or InfluxDB.
   - Metadata, user data, and annotations in Postgres (Supabase provides managed Postgres + auth + storage).
   - Long-term feature store (Feast) for model training.
5. **Frontend Experience**
   - React + TypeScript (existing Vite app), Tailwind UI, component library (Shadcn UI).
   - Real-time dashboards via WebSockets/GraphQL subscriptions, video player with overlays (Mux Player, hls.js).
6. **Model Training & Continuous Improvement**
   - Pipeline using PyTorch Lightning + Weights & Biases (open-source tier) or MLflow for experiment tracking.
   - Automated retraining triggered by new labeled data, evaluation harness against validation set.

## 6. Detailed Computer Vision Pipeline
1. **Player & Ball Detection**
   - Base models: [YOLOv8](https://github.com/ultralytics/ultralytics) or [Detectron2](https://github.com/facebookresearch/detectron2) fine-tuned on basketball datasets.
   - For court-line detection: [CourtNet](https://github.com/alexnaepflin/CourtNet) or custom UNet models.
2. **Pose Estimation**
   - [MMPose](https://github.com/open-mmlab/mmpose) or [MediaPipe Pose](https://github.com/google/mediapipe) for skeleton keypoints.
   - Consider [OpenPifPaf](https://github.com/openpifpaf/openpifpaf) for multi-person scenes.
3. **Multi-Object Tracking**
   - [ByteTrack](https://github.com/ifzhang/ByteTrack), [DeepSort](https://github.com/nwojke/deep_sort), or [Norfair](https://github.com/tryolabs/norfair) for robust ID persistence.
4. **Action & Penalty Classification**
   - Temporal CNNs/Transformers (e.g., [TAPAS](https://github.com/EPFL-VILAB/TAPAS)) on pose sequences to detect fouls/violations.
   - Sequence labeling frameworks like [TensorFlow Addons CRF](https://github.com/tensorflow/addons).
5. **Fatigue & Injury Risk Modeling**
   - Features: heart rate (if available), player load (sum of accelerations), jump frequency, deceleration counts.
   - Models: Gradient boosting (XGBoost), Temporal RNNs, or [tslearn](https://github.com/tslearn-team/tslearn) for time-series clustering.
6. **Statistics & Insights Layer**
   - Derive per-possession metrics, shot charts via homography mapping of player/ball coordinates to court coordinates.
   - Use Supabase Edge Functions for on-demand analytics summarization.

## 7. Data Strategy
- **Initial Datasets**: NCAA/NBA open games, SportsVU (where permitted), augmented with synthetic data via Unity or [NCAA Basketball Dataset](https://github.com/daniel-s-ingram/Basketball-Dataset).
- **Labeling Tools**: [CVAT](https://github.com/opencv/cvat) or [Label Studio](https://github.com/HumanSignal/label-studio) for keypoint and penalty annotations.
- **Data Governance**: Versioned datasets stored in DVC or Git LFS. Maintain metadata catalog (e.g., Pachyderm or LakeFS).

## 8. Platform Components
| Layer | Suggested Open-Source Tools |
| --- | --- |
| Frontend | Vite + React + TypeScript, Tailwind CSS, Shadcn UI |
| Realtime Comms | LiveKit, WebRTC, Socket.IO |
| API/Auth | FastAPI, Supabase Auth, Hasura GraphQL Engine |
| Storage | Supabase/Postgres, TimescaleDB, MinIO |
| Queueing | Redis Streams, NATS, Kafka |
| CV Models | Ultralytics YOLOv8, MMPose, ByteTrack, PyTorch Lightning |
| Monitoring | Prometheus, Grafana, OpenTelemetry |
| CI/CD | GitHub Actions, Dagster/Prefect for ML pipelines |

## 9. Roadmap
1. **Phase 0 – Foundations (Month 1)**
   - Set up repo structure: frontend (React), backend (FastAPI), ML services (Python).
   - Integrate Supabase for auth, storage, and Postgres. Establish CI/CD.
2. **Phase 1 – MVP (Months 2-3)**
   - Implement video upload, asynchronous processing pipeline, player detection + pose estimation.
   - Deliver basic stats: minutes, distance, speed zones. Provide downloadable reports.
3. **Phase 2 – Live Analytics (Months 4-5)**
   - Add WebRTC ingest, low-latency inference pipeline with GPU acceleration.
   - Implement real-time dashboards and alerting for fatigue thresholds.
4. **Phase 3 – Advanced Insights (Months 6-7)**
   - Train penalty detection models, integrate rule-specific logic.
   - Add personalized fatigue models using historical workload data.
5. **Phase 4 – Multi-Sport Expansion (Months 8+)**
   - Abstract sport-specific modules (court dimensions, rule sets).
   - Add support for soccer and volleyball by swapping detection models and analytics templates.

## 10. Risk Mitigation & Considerations
- **Model Accuracy**: Continuous evaluation, human-in-the-loop review workflow, and fallback manual tagging.
- **Latency Constraints**: GPU auto-scaling, model quantization (ONNX Runtime, TensorRT) for live inference.
- **Privacy & Compliance**: Consent management, anonymization when sharing footage, compliance with league rules.
- **Device Constraints**: Provide lightweight edge inference option (MediaPipe) for scenarios without cloud connectivity.

## 11. Success Metrics
- Pose tracking accuracy (PCK@0.5) per player.
- Average latency of alerts (<500ms for live, <2x video duration for upload processing).
- Number of correctly identified penalties vs. official calls.
- Reduction in athlete soft-tissue injuries after fatigue alert adoption.
- User engagement: weekly active coaches, number of annotated clips shared.

## 12. Next Steps
1. Validate requirements with target coaches/teams and prioritize initial penalty set.
2. Stand up Supabase project, scaffold backend API, and prototype video upload workflow.
3. Build proof-of-concept pipeline using open-source models (YOLOv8 + MMPose + ByteTrack) on sample game footage.
4. Iterate on UI wireframes for dashboards, overlays, and alert notifications.
5. Establish labeling pipeline and model evaluation harness to support ongoing improvements.
