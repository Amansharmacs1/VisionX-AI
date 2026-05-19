import cv2
import time
from src.config import CAMERA_INDEX, FRAME_WIDTH, FRAME_HEIGHT, FACE_PROCESS_EVERY_N_FRAMES, OBJECT_PROCESS_EVERY_N_FRAMES, GESTURE_COOLDOWN
from src.camera import VideoCaptureManager
from src.speech import SpeechManager
from src.face_detection import FaceDetector
from src.object_detection import ObjectDetector
from src.gesture_control import GestureController
from src.ui import UIManager

def main():
    print("Starting VisionX-AI...")
    
    # Initialize Managers
    camera = VideoCaptureManager(src=CAMERA_INDEX, width=FRAME_WIDTH, height=FRAME_HEIGHT)
    speech = SpeechManager()
    face_detector = FaceDetector()
    object_detector = ObjectDetector()
    gesture_controller = GestureController()
    ui = UIManager()

    # System State
    current_mode = "Input"
    sound_on = True
    frame_count = 0
    last_faces = []
    last_objects = []

    last_gesture_time = 0

    speech.speak("Vision X AI system initialized. Sound is on.")

    try:
        while True:
            ret, frame = camera.read()
            if not ret or frame is None:
                continue

            frame_count += 1
            
            # --- 1. Gesture Detection ---
            gesture, annotated_frame = gesture_controller.process_frame(frame)
            
            if gesture:
                now = time.time()
                if now - last_gesture_time > GESTURE_COOLDOWN:
                    last_gesture_time = now
                    
                    if gesture == "Closed Fist":
                        sound_on = not sound_on
                        speech.set_sound(sound_on)
                        state_str = "ON" if sound_on else "OFF"
                        speech.speak(f"Sound is {state_str}", force=True)
                    
                    elif gesture == "Two Fingers":
                        current_mode = "Output" if current_mode == "Input" else "Input"
                        speech.speak(f"Mode changed to {current_mode}", force=True)
                    
                    elif gesture == "Index Finger":
                        current_time = time.strftime("%I:%M %p")
                        speech.speak(f"The time is {current_time}", force=True)

            # --- 2. Face Detection (Every N Frames to save CPU) ---
            if frame_count % FACE_PROCESS_EVERY_N_FRAMES == 0:
                last_faces = face_detector.process_frame(annotated_frame)
                
                # Speak out face detections
                for face in last_faces:
                    name = face["name"]
                    dist = face["distance"]
                    direction = face["direction"]
                    
                    if name == "Unknown":
                        speech.speak(f"Unknown person ahead")
                    else:
                        speech.speak(f"{name} is {dist.lower()} on your {direction.lower()}")

            # --- 3. Object Detection (Every M Frames) ---
            if frame_count % OBJECT_PROCESS_EVERY_N_FRAMES == 0:
                last_objects = object_detector.process_frame(annotated_frame)
                
                # Speak out object detections if near
                for obj in last_objects:
                    name = obj["name"]
                    dist = obj["distance"]
                    direction = obj["direction"]
                    
                    if dist == "Near":
                        speech.speak(f"Watch out, {name.lower()} is near on your {direction.lower()}")
                    elif dist == "Medium":
                        speech.speak(f"{name} is {dist.lower()} on your {direction.lower()}")

            # --- 4. UI Rendering ---
            final_frame = ui.draw_overlay(annotated_frame, last_faces, last_objects, current_mode, sound_on)

            # Display
            cv2.imshow('VisionX-AI Output', final_frame)

            # Exit condition
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        print("Cleaning up resources...")
        camera.release()
        speech.stop()
        cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
