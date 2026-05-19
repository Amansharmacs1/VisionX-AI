# VisionX-AI Python Libraries

This document outlines the core Python libraries used to build the VisionX-AI Backend, along with their specific use cases in the project.

### Core AI & Vision Libraries

*   **`opencv-python` (`cv2`)**
    *   **Use Case:** The backbone of the visual system. Used for accessing the iPhone/Mac webcam, manipulating video frames (resizing, converting colors), drawing the futuristic UI overlay (bounding boxes, text, translucent gesture panels), and displaying the final video window on screen.
*   **`mediapipe`**
    *   **Use Case:** Google's state-of-the-art framework for cross-platform, customizable ML solutions. In this project, it is used exclusively for **Hand Tracking & Gesture Recognition**. It detects 21 3D landmarks on the hand, allowing us to calculate distances between fingers to recognize specific gestures like a "Fist" or pointing with an "Index Finger".
*   **`face_recognition`** (Powered by `dlib`)
    *   **Use Case:** Provides an extremely simple but highly accurate API for face detection and recognition. We use it to detect human faces in the frame, extract their unique "facial encodings", and compare them against the photos in the `known_faces/` directory to recognize people by name.
*   **`ultralytics` (YOLOv8)**
    *   **Use Case:** Runs the **YOLO (You Only Look Once)** AI model (`yolov8n.pt`). This is used for real-time **General Object Detection**, giving the system the ability to "see" and locate 80 different common objects in the environment (e.g., chairs, laptops, bottles, cars).
*   **`numpy`**
    *   **Use Case:** The foundational library for mathematical and array operations in Python. Since all images (from OpenCV) are essentially just massive arrays of numbers, Numpy is used heavily behind the scenes to crop images, calculate Euclidean distances (for gestures and face comparisons), and ensure the memory layouts are compatible across all the different C++ libraries.

### Background / System Libraries (Built-in)

*   **`threading` & `queue`**
    *   **Use Case:** Crucial for system performance. Used to run the camera capture and the macOS text-to-speech (`say`) engine in separate background processes. This ensures the main video feed never lags or freezes while the computer is busy speaking.
*   **`subprocess`**
    *   **Use Case:** Used to trigger terminal commands from within Python. Specifically, it executes the native macOS `say` command to provide fast, human-like voice feedback to the user.
*   **`time`**
    *   **Use Case:** Used for measuring FPS (Frames Per Second) and implementing "cooldowns" so that the gesture controller and audio system don't trigger the exact same actions 30 times a second.
*   **`os`**
    *   **Use Case:** Handles file system operations, such as iterating through the `known_faces/` folder to automatically load new photos into the system.
