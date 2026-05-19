import os

# Camera Settings
# Usually 0 is the built-in Mac webcam, 1 is the Continuity Camera (iPhone)
CAMERA_INDEX = int(os.getenv("CAMERA_INDEX", 1))
FRAME_WIDTH = 1280
FRAME_HEIGHT = 720
FPS_TARGET = 30

# UI Settings
UI_FONT = 2 # cv2.FONT_HERSHEY_COMPLEX
UI_TEXT_COLOR = (255, 255, 255)
UI_ACCENT_COLOR = (255, 200, 0)

# Face Detection Settings
FACE_PROCESS_EVERY_N_FRAMES = 5
KNOWN_FACES_DIR = "known_faces"
TOLERANCE = 0.5  # lower is more strict for face_recognition

# Zones for Direction
# We divide the horizontal resolution into 5 zones
ZONES = ["Far Left", "Left", "Front", "Right", "Far Right"]

# Distance Settings
# Area of bounding box triggers near/medium/far
# These are heuristic values and may need tuning based on resolution
DIST_NEAR_THRESHOLD = 50000 
DIST_FAR_THRESHOLD = 15000

# Cooldowns (in seconds)
SPEECH_COOLDOWN_SAME_PHRASE = 5.0
GESTURE_HOLD_FRAMES = 15 # Number of continuous frames a gesture must be held to trigger
GESTURE_COOLDOWN = 2.0 # Seconds before same gesture action can be triggered again

# YOLO Object Detection Settings
YOLO_MODEL_PATH = "yolov8n.pt"
OBJECT_PROCESS_EVERY_N_FRAMES = 10
