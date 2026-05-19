# VisionX-AI Backend

VisionX-AI is an AI-powered smart glasses assistant system for visually impaired individuals. It uses a Mac and an iPhone camera (via Continuity Camera, DroidCam, or EpocCam) to detect known/unknown people, identify obstacles, provide smart audio navigation, and read hand gestures for control.

## Requirements
- Python 3.9+
- macOS (for `say` command text-to-speech)
- iPhone camera (Continuity Camera recommended)
- CMake (Required for `face_recognition` / `dlib` installation)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   # You may need to install cmake first if not already installed (e.g. brew install cmake)
   pip install -r requirements.txt
   ```

2. **Add Known Faces:**
   - Drop images of known people in the `known_faces/` folder.
   - Name the file as the person's name (e.g., `Aman.jpg`, `Sarah.png`).
   - The system will learn these faces on startup.

3. **Configure Camera:**
   - The default camera index is set to `1` (usually the iPhone via Continuity Camera). 
   - If you want to use the default Mac webcam, you can change `CAMERA_INDEX` in `src/config.py` to `0`.

## Running the Application

Execute the main script from the `backend/` directory:
```bash
python main.py
```

## Features

- **Real-Time Face Recognition:** Detects known and unknown people, displaying name, direction, and estimated distance.
- **Smart Direction & Distance:** Divides the screen into zones (Far Left, Left, Front, Right, Far Right) and estimates object distance (Near, Medium, Far) to give appropriate warnings like "Aman is on your left" or "Warning obstacle ahead".
- **Gesture Control System:**
  - ✊ **Closed Fist:** Toggle Sound ON/OFF
  - ✌️ **Two Fingers:** Toggle Input/Output Mode
  - ☝️ **Hold Index Finger:** Tell Current Time
- **Human-Like Audio Feedback:** Uses the native macOS `say` command with a queue system to ensure speech does not overlap and uses cooldowns to avoid spam.
- **Futuristic UI Overlay:** Shows live output with face boxes, distances, gestures, clock, and FPS on the Mac screen.

## Troubleshooting

- **No Camera Output?** Check `src/config.py` and adjust the `CAMERA_INDEX`. Use a webcam tester to find your camera index.
- **`dlib` Installation Failure?** Make sure you have `cmake` installed (`brew install cmake`).
- **Laggy Feed?** Ensure you are in a well-lit environment. The system drops frames automatically to maintain responsiveness, but lighting helps the iPhone camera provide a faster baseline framerate.
- **Speech Overlap?** The queue system should prevent this. Ensure your Mac's default voice is configured correctly in System Settings > Accessibility > Spoken Content.
