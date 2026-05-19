import cv2
import numpy as np
from ultralytics import YOLO
from .config import ZONES, DIST_NEAR_THRESHOLD, DIST_FAR_THRESHOLD, YOLO_MODEL_PATH

class ObjectDetector:
    def __init__(self):
        print(f"Loading YOLO model from {YOLO_MODEL_PATH}...")
        try:
            self.model = YOLO(YOLO_MODEL_PATH)
            print("YOLO model loaded successfully.")
        except Exception as e:
            print(f"Failed to load YOLO model: {e}")
            self.model = None

    def process_frame(self, frame):
        """
        Process a single frame for general object detection.
        Returns a list of dicts with object details.
        """
        results_list = []
        if self.model is None:
            return results_list

        # Run inference
        # Conf=0.5 to avoid spammy detections
        results = self.model(frame, verbose=False, conf=0.5)
        
        frame_height, frame_width, _ = frame.shape

        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Bounding box coordinates
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                
                # Class name
                cls_id = int(box.cls[0])
                name = self.model.names[cls_id]
                
                # Skip 'person' class because FaceDetector handles people better
                if name.lower() == 'person':
                    continue

                # Calculate Distance based on Area
                box_area = (x2 - x1) * (y2 - y1)
                if box_area > DIST_NEAR_THRESHOLD:
                    distance = "Near"
                elif box_area < DIST_FAR_THRESHOLD:
                    distance = "Far"
                else:
                    distance = "Medium"

                # Calculate Direction based on center X coordinate
                center_x = (x1 + x2) // 2
                zone_width = frame_width / len(ZONES)
                zone_idx = min(int(center_x / zone_width), len(ZONES) - 1)
                direction = ZONES[zone_idx]

                results_list.append({
                    "name": name.capitalize(),
                    "box": (y1, x2, y2, x1), # top, right, bottom, left format to match face detector
                    "distance": distance,
                    "direction": direction,
                    "area": box_area
                })

        return results_list
