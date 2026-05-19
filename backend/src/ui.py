import cv2
import time
from .config import UI_FONT, UI_TEXT_COLOR, UI_ACCENT_COLOR

class UIManager:
    def __init__(self):
        self.fps_start_time = time.time()
        self.fps_frames = 0
        self.fps = 0

    def draw_overlay(self, frame, faces, objects, current_mode, sound_on):
        """
        Draws the futuristic UI overlay.
        """
        # Calculate FPS
        self.fps_frames += 1
        now = time.time()
        if now - self.fps_start_time > 1.0:
            self.fps = self.fps_frames
            self.fps_frames = 0
            self.fps_start_time = now

        # Draw Face Boxes & Info
        for face in faces:
            top, right, bottom, left = face['box']
            name = face['name']
            dist = face['distance']
            dir = face['direction']

            # Determine color based on known/unknown
            color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)

            # Draw futuristic cornered bounding box
            self._draw_corner_box(frame, left, top, right, bottom, color)
            
            # Draw label background
            cv2.rectangle(frame, (left, top - 35), (right, top), color, cv2.FILLED)
            cv2.putText(frame, f"{name} | {dist} | {dir}", (left + 5, top - 10), 
                        UI_FONT, 0.5, (0, 0, 0), 1)

        # Draw Object Boxes
        for obj in objects:
            top, right, bottom, left = obj['box']
            name = obj['name']
            dist = obj['distance']
            dir = obj['direction']
            color = (255, 165, 0) # Orange color for general objects

            self._draw_corner_box(frame, left, top, right, bottom, color)
            cv2.rectangle(frame, (left, top - 35), (right, top), color, cv2.FILLED)
            cv2.putText(frame, f"{name} | {dist} | {dir}", (left + 5, top - 10), 
                        UI_FONT, 0.5, (0, 0, 0), 1)

        # Draw Top Bar (Status)
        cv2.rectangle(frame, (0, 0), (frame.shape[1], 40), (0, 0, 0), cv2.FILLED)
        
        # System Title
        cv2.putText(frame, "VisionX-AI", (10, 25), UI_FONT, 0.7, UI_ACCENT_COLOR, 2)
        
        # Mode Status
        mode_text = f"MODE: {current_mode}"
        cv2.putText(frame, mode_text, (200, 25), UI_FONT, 0.6, UI_TEXT_COLOR, 1)

        # Sound Status
        sound_text = "SOUND: ON" if sound_on else "SOUND: OFF"
        sound_color = (0, 255, 0) if sound_on else (0, 0, 255)
        cv2.putText(frame, sound_text, (400, 25), UI_FONT, 0.6, sound_color, 1)

        # Clock
        current_time = time.strftime("%I:%M %p")
        cv2.putText(frame, current_time, (frame.shape[1] - 150, 25), UI_FONT, 0.6, UI_TEXT_COLOR, 1)

        # FPS Counter
        cv2.putText(frame, f"FPS: {self.fps}", (frame.shape[1] - 300, 25), UI_FONT, 0.6, UI_TEXT_COLOR, 1)

        # Draw Gesture Guide Panel
        self._draw_gesture_guide(frame)

        return frame

    def _draw_gesture_guide(self, frame):
        """Draws a translucent panel showing available gestures and their actions."""
        h, w, _ = frame.shape
        panel_w = 280
        panel_h = 130
        margin = 20
        x1, y1 = w - panel_w - margin, h - panel_h - margin
        x2, y2 = w - margin, h - margin

        # Draw translucent background
        overlay = frame.copy()
        cv2.rectangle(overlay, (x1, y1), (x2, y2), (0, 0, 0), cv2.FILLED)
        cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)
        cv2.rectangle(frame, (x1, y1), (x2, y2), UI_ACCENT_COLOR, 1)

        # Draw Header
        cv2.putText(frame, "GESTURE GUIDE", (x1 + 10, y1 + 25), UI_FONT, 0.5, UI_ACCENT_COLOR, 1)
        
        # Draw Gesture Entries
        cv2.putText(frame, "FIST: Toggle Sound", (x1 + 10, y1 + 55), UI_FONT, 0.5, UI_TEXT_COLOR, 1)
        cv2.putText(frame, "TWO FINGERS: Change Mode", (x1 + 10, y1 + 85), UI_FONT, 0.5, UI_TEXT_COLOR, 1)
        cv2.putText(frame, "INDEX FINGER: Tell Time", (x1 + 10, y1 + 115), UI_FONT, 0.5, UI_TEXT_COLOR, 1)

    def _draw_corner_box(self, img, x1, y1, x2, y2, color, thickness=2, l=30):
        """Draws corners of a bounding box for a futuristic look."""
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 1)
        
        # Top Left
        cv2.line(img, (x1, y1), (x1 + l, y1), color, thickness)
        cv2.line(img, (x1, y1), (x1, y1 + l), color, thickness)
        # Top Right
        cv2.line(img, (x2, y1), (x2 - l, y1), color, thickness)
        cv2.line(img, (x2, y1), (x2, y1 + l), color, thickness)
        # Bottom Left
        cv2.line(img, (x1, y2), (x1 + l, y2), color, thickness)
        cv2.line(img, (x1, y2), (x1, y2 - l), color, thickness)
        # Bottom Right
        cv2.line(img, (x2, y2), (x2 - l, y2), color, thickness)
        cv2.line(img, (x2, y2), (x2, y2 - l), color, thickness)
