import cv2
import mediapipe as mp
import numpy as np
from .config import GESTURE_HOLD_FRAMES

class GestureController:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        self.mp_draw = mp.solutions.drawing_utils
        
        self.gesture_history = []
        self.current_held_gesture = None
        self.hold_count = 0

    def process_frame(self, frame):
        """
        Detects hand gestures. Returns (gesture_name, annotated_frame)
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb_frame = np.ascontiguousarray(rgb_frame)
        results = self.hands.process(rgb_frame)
        
        gesture = None

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                self.mp_draw.draw_landmarks(frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)
                gesture = self._recognize_gesture(hand_landmarks)
                break # Only process one hand
                
        # Temporal smoothing / Hold detection
        if gesture:
            if gesture == self.current_held_gesture:
                self.hold_count += 1
            else:
                self.current_held_gesture = gesture
                self.hold_count = 1
        else:
            self.current_held_gesture = None
            self.hold_count = 0

        # Trigger gesture only if held for enough frames
        triggered_gesture = None
        if self.hold_count == GESTURE_HOLD_FRAMES:
            triggered_gesture = self.current_held_gesture

        return triggered_gesture, frame

    def _recognize_gesture(self, landmarks):
        """
        Simple heuristic-based gesture recognition using y-coordinates.
        0 is wrist. 4 is thumb tip. 8 is index tip. 12 is middle. 16 is ring. 20 is pinky.
        """
        tips = [8, 12, 16, 20]
        mcp = [5, 9, 13, 17]
        
        # Check if fingers are folded (tip y > mcp y means folded down)
        # Note: y goes down in image coordinates
        fingers_up = []
        for t, m in zip(tips, mcp):
            if landmarks.landmark[t].y < landmarks.landmark[m].y:
                fingers_up.append(True)
            else:
                fingers_up.append(False)
                
        # Closed Fist: All 4 fingers down
        if not any(fingers_up):
            return "Closed Fist"
            
        # Two Fingers: Index and Middle up, Ring and Pinky down
        if fingers_up == [True, True, False, False]:
            return "Two Fingers"
            
        # Hold Index Finger: Only index finger up
        if fingers_up == [True, False, False, False]:
            return "Index Finger"
            
        return None
