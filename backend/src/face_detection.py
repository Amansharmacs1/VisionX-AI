import os
import cv2
import numpy as np
import face_recognition
from .config import KNOWN_FACES_DIR, TOLERANCE, ZONES, DIST_NEAR_THRESHOLD, DIST_FAR_THRESHOLD

class FaceDetector:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        self._load_known_faces()

    def _load_known_faces(self):
        if not os.path.exists(KNOWN_FACES_DIR):
            os.makedirs(KNOWN_FACES_DIR)
            print(f"Created '{KNOWN_FACES_DIR}' directory. Drop images here to recognize them.")
            return

        print("Loading known faces...")
        for filename in os.listdir(KNOWN_FACES_DIR):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(KNOWN_FACES_DIR, filename)
                name = os.path.splitext(filename)[0]
                
                image = cv2.imread(filepath)
                if image is None:
                    print(f"Warning: Failed to load {filename}")
                    continue
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                image = np.ascontiguousarray(image, dtype=np.uint8)
                
                encodings = face_recognition.face_encodings(image)
                if encodings:
                    self.known_face_encodings.append(encodings[0])
                    self.known_face_names.append(name)
                    print(f"Loaded face: {name}")
                else:
                    print(f"Warning: No face found in {filename}")
        print("Finished loading faces.")

    def process_frame(self, frame, scale_factor=0.25):
        """
        Process a single frame for face detection and recognition.
        Returns a list of dicts with face details.
        """
        small_frame = cv2.resize(frame, (0, 0), fx=scale_factor, fy=scale_factor)
        # Convert BGR to RGB for face_recognition
        rgb_small_frame = np.ascontiguousarray(small_frame[:, :, ::-1])

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        results = []
        frame_height, frame_width, _ = frame.shape

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            # Scale coordinates back up
            top = int(top / scale_factor)
            right = int(right / scale_factor)
            bottom = int(bottom / scale_factor)
            left = int(left / scale_factor)

            # Recognition
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=TOLERANCE)
            name = "Unknown"
            
            if True in matches:
                # Find best match
                face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = self.known_face_names[best_match_index]

            # Calculate Distance based on Area
            box_area = (right - left) * (bottom - top)
            if box_area > DIST_NEAR_THRESHOLD:
                distance = "Near"
            elif box_area < DIST_FAR_THRESHOLD:
                distance = "Far"
            else:
                distance = "Medium"

            # Calculate Direction based on center X coordinate
            center_x = (left + right) // 2
            zone_width = frame_width / len(ZONES)
            zone_idx = min(int(center_x / zone_width), len(ZONES) - 1)
            direction = ZONES[zone_idx]

            results.append({
                "name": name,
                "box": (top, right, bottom, left),
                "distance": distance,
                "direction": direction,
                "area": box_area
            })

        return results
