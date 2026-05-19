import cv2
import time
import os
import threading
import numpy as np
import win32com.client
from ultralytics import YOLO

# ================= SETTINGS =================
CONFIDENCE    = 0.45
FRAME_WIDTH   = 416
FRAME_HEIGHT  = 320
VOICE_DELAY   = 3
MAX_RETRY     = 30
FACE_FOLDER   = os.path.join(os.path.dirname(os.path.abspath(__file__)), "known_faces")
FACE_CONF     = 75       # LBPH confidence threshold (lower = stricter match)

# ================= STATE =================
last_spoken  = {}
is_speaking  = False
speak_lock   = threading.Lock()

detect_results  = []
detect_obstacle = False
detect_stairs   = False
detect_hole     = ""
detect_path     = ""
detect_faces    = []       # list of {"name": ..., "side": ..., "side_text": ...}
detect_lock     = threading.Lock()
detecting       = False

frame_count = 0
bad_frames  = 0

# ================= RENAME MAP =================
RENAME = {
    "cell phone":   "phone",
    "backpack":     "bag",
    "dining table": "table",
}

# ================= IMPORTANT CLASSES (COCO) =================
IMPORTANT = {
    "person", "chair", "bottle", "cell phone", "backpack",
    "laptop", "cup", "dining table", "bed", "tv",
    "car", "motorcycle", "bicycle", "bus", "truck",
    "bench", "refrigerator", "toilet", "sink",
    "potted plant", "door", "book", "keyboard", "mouse",
}

# ================= WINDOWS TTS =================
speaker = win32com.client.Dispatch("SAPI.SpVoice")

def speak(msg):
    global is_speaking
    if is_speaking:
        return
    now = time.time()
    expired = [k for k, v in last_spoken.items() if now - v > VOICE_DELAY * 2]
    for k in expired:
        del last_spoken[k]
    if msg in last_spoken and now - last_spoken[msg] < VOICE_DELAY:
        return
    with speak_lock:
        if is_speaking:
            return
        is_speaking = True
        last_spoken[msg] = now
    def run():
        global is_speaking
        try:
            speaker.Speak(msg)
        finally:
            is_speaking = False
    threading.Thread(target=run, daemon=True).start()

# ================= FACE RECOGNITION SETUP =================
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

face_recognizer = None
face_labels = {}     # {label_id: "Name"}
face_enabled = False

def load_known_faces():
    """Load face images from known_faces/ folder and train LBPH recognizer.
    Each image should be named like: Aman.jpg, Rohit_1.jpg, Mom.png etc.
    The name before _ or . is used as the person's name."""
    global face_recognizer, face_labels, face_enabled

    if not os.path.isdir(FACE_FOLDER):
        print(f"[FACE] Folder not found: {FACE_FOLDER}")
        print("[FACE] Face recognition disabled")
        return

    images = []
    labels = []
    name_to_id = {}
    next_id = 0

    valid_ext = {".jpg", ".jpeg", ".png", ".bmp"}

    for fname in os.listdir(FACE_FOLDER):
        ext = os.path.splitext(fname)[1].lower()
        if ext not in valid_ext:
            continue

        # extract name: "Aman_1.jpg" -> "Aman", "Mom.png" -> "Mom"
        base = os.path.splitext(fname)[0]
        name = base.split("_")[0].strip()
        if not name:
            continue

        img_path = os.path.join(FACE_FOLDER, fname)
        img = cv2.imread(img_path)
        if img is None:
            continue

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # detect face in the image
        faces = face_cascade.detectMultiScale(gray, 1.3, 5, minSize=(30, 30))
        if len(faces) == 0:
            # try with entire image as face
            face_roi = cv2.resize(gray, (100, 100))
        else:
            x, y, fw, fh = faces[0]
            face_roi = cv2.resize(gray[y:y+fh, x:x+fw], (100, 100))

        # assign label id
        if name not in name_to_id:
            name_to_id[name] = next_id
            face_labels[next_id] = name
            next_id += 1

        images.append(face_roi)
        labels.append(name_to_id[name])
        print(f"[FACE] Loaded: {fname} -> {name}")

    if len(images) < 1:
        print("[FACE] No face images found in known_faces/")
        print("[FACE] Face recognition disabled")
        return

    face_recognizer = cv2.face.LBPHFaceRecognizer_create()
    face_recognizer.train(images, np.array(labels))
    face_enabled = True
    print(f"[FACE] Trained on {len(images)} images, {len(face_labels)} people")

def recognize_faces(gray, w):
    """Detect and recognize faces in grayscale frame.
    Returns list of {"name": ..., "side": ..., "side_text": ...}"""
    if not face_enabled or face_recognizer is None:
        return []

    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.2, minNeighbors=5, minSize=(35, 35)
    )

    found = []
    for (x, y, fw, fh) in faces:
        face_roi = cv2.resize(gray[y:y+fh, x:x+fw], (100, 100))
        label_id, confidence = face_recognizer.predict(face_roi)

        cx = x + fw // 2
        if cx < w * 0.33:
            side, side_text = "left", "on your left"
        elif cx < w * 0.66:
            side, side_text = "front", "directly ahead"
        else:
            side, side_text = "right", "on your right"

        if confidence < FACE_CONF:
            name = face_labels.get(label_id, "Unknown person")
        else:
            name = "Unknown person"

        found.append({
            "name": name, "side": side, "side_text": side_text,
            "x": x, "y": y, "w": fw, "h": fh
        })

    return found

# ================= STAIR DETECTION =================
def check_stairs(gray, w, h):
    """Detect stairs: 4+ wide, evenly-spaced horizontal edges in lower frame."""
    floor = gray[h // 3:, :]
    # Add blur to reduce noise from floor textures (tiles, carpets)
    floor = cv2.GaussianBlur(floor, (5, 5), 0)
    # Increase Canny thresholds to ignore weak edges
    edges = cv2.Canny(floor, 60, 150)
    # Stricter Hough parameters: longer lines, more votes needed
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180,
                            threshold=80, minLineLength=int(w * 0.40), maxLineGap=10)
    if lines is None:
        return False

    h_lines = []
    for line in lines:
        x1, y1, x2, y2 = line[0]
        length = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        angle  = abs(np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi)
        # Stricter horizontal angle (within 10 degrees) and length
        if (angle < 10 or angle > 170) and length > w * 0.35:
            h_lines.append(min(y1, y2))

    if len(h_lines) < 4:
        return False

    h_lines = sorted(set(h_lines))
    merged = [h_lines[0]]
    for y in h_lines[1:]:
        if y - merged[-1] > 10:  # Increase merge distance to avoid duplicate nearby lines
            merged.append(y)
    if len(merged) < 4:
        return False

    gaps = [merged[i] - merged[i-1] for i in range(1, len(merged))]
    if not gaps:
        return False
    avg = sum(gaps) / len(gaps)
    # Gaps shouldn't be too small or too large
    if avg < 15 or avg > 80:
        return False
    # Must have very consistent gaps
    consistent = sum(1 for g in gaps if abs(g - avg) < avg * 0.40)
    return consistent >= 3

# ================= HOLE / PIT DETECTION =================
def check_hole(gray, w, h):
    """Detect holes/pits: extremely dark compact blobs on the floor region."""
    floor = gray[int(h * 0.55):, :]
    fh, fw = floor.shape

    # Very strong blur to remove all texture
    blurred = cv2.GaussianBlur(floor, (15, 15), 0)
    
    # EXTREMELY strict threshold (25). Normal shadows are > 40. 
    # Only pitch-black drops (like a real hole) will trigger this.
    _, dark_mask = cv2.threshold(blurred, 25, 255, cv2.THRESH_BINARY_INV)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    dark_mask = cv2.morphologyEx(dark_mask, cv2.MORPH_OPEN, kernel)
    dark_mask = cv2.morphologyEx(dark_mask, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(dark_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    floor_area = fh * fw
    for cnt in contours:
        area = cv2.contourArea(cnt)
        ratio = area / floor_area
        
        # Must be a larger dark area (at least 8% of floor, max 40%)
        if ratio < 0.08 or ratio > 0.40:
            continue
            
        x, y, bw, bh = cv2.boundingRect(cnt)
        aspect = bw / max(bh, 1)
        
        # Holes are generally somewhat circular/square-ish, not long strips
        if aspect > 3.0 or aspect < 0.33:
            continue
            
        cx = x + bw // 2
        # Must be directly in the path (central 40% of the screen)
        if cx < fw * 0.30 or cx > fw * 0.70:
            continue
            
        # Check solidity to ensure it's a solid blob, not a jagged shadow like legs
        hull = cv2.convexHull(cnt)
        hull_area = cv2.contourArea(hull)
        if hull_area > 0:
            solidity = float(area) / hull_area
            if solidity < 0.6: # Must be a solid shape
                continue

        if ratio > 0.20:
            return "pit"
        else:
            return "hole"
    return ""

# ================= PATH GUIDANCE =================
def check_path(gray, w, h, has_obstacle):
    """Analyze lower frame for path guidance."""
    lower = gray[h // 2:, :]

    left_zone   = lower[:, :w // 3]
    center_zone = lower[:, w // 3:2 * w // 3]
    right_zone  = lower[:, 2 * w // 3:]

    left_dark   = (left_zone   < 75).mean()
    center_dark = (center_zone < 75).mean()
    right_dark  = (right_zone  < 75).mean()

    if left_dark > 0.45 and right_dark > 0.45 and center_dark < 0.35:
        return "narrow"
    if center_dark > 0.50:
        if left_dark < right_dark:
            return "move_left"
        else:
            return "move_right"
    if center_dark < 0.20 and not has_obstacle:
        return "safe"
    return ""

# ================= BACKGROUND DETECTION =================
def run_detection(frame, w, h, do_faces):
    global detecting, detect_results, detect_obstacle
    global detect_stairs, detect_hole, detect_path, detect_faces

    objs = []
    has_obstacle = False

    # YOLO detection
    results = model(frame, verbose=False)
    for r in results:
        for box in r.boxes:
            conf = float(box.conf[0])
            if conf < CONFIDENCE:
                continue
            cls   = int(box.cls[0])
            label = model.names[cls]
            if label not in IMPORTANT:
                continue
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            bw = x2 - x1
            bh = y2 - y1
            if bw < 35 or bh < 35:
                continue

            area = bw * bh
            cx   = (x1 + x2) // 2

            if cx < w * 0.33:
                side, side_text = "left",  "on your left"
            elif cx < w * 0.66:
                side, side_text = "front", "directly ahead"
            else:
                side, side_text = "right", "on your right"

            name        = RENAME.get(label, label)
            is_obstacle = (side == "front" and area > 15000 and bw > w * 0.30)
            if is_obstacle:
                has_obstacle = True

            objs.append({
                "name": name, "side": side, "side_text": side_text,
                "is_obstacle": is_obstacle,
                "x1": x1, "y1": y1, "x2": x2, "y2": y2,
            })

    # grayscale for vision checks
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # very close blocking object
    cr = gray[h // 3:h, w // 3:2 * w // 3]
    if cr.size > 0 and (cr < 90).mean() > 0.60:
        has_obstacle = True

    # stair / hole / path
    stairs_found = check_stairs(gray, w, h)
    hole_type    = check_hole(gray, w, h)
    path_status  = check_path(gray, w, h, has_obstacle)

    # face recognition (only on selected frames to save CPU)
    faces_found = []
    if do_faces:
        faces_found = recognize_faces(gray, w)

    with detect_lock:
        detect_results  = objs
        detect_obstacle = has_obstacle
        detect_stairs   = stairs_found
        detect_hole     = hole_type
        detect_path     = path_status
        if do_faces:
            detect_faces = faces_found

    detecting = False

# ================= CAMERA =================
ip  = input("Enter Phone IP: ").strip()
url = f"http://{ip}:8080/video"

cap = cv2.VideoCapture(url)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

if not cap.isOpened():
    print("Camera not connected")
    exit()

# ================= MODEL =================
model = YOLO("yolov8n.pt")

# ================= LOAD KNOWN FACES =================
load_known_faces()

# ================= MAIN LOOP =================
while True:
    ret, frame = cap.read()

    if not ret:
        bad_frames += 1
        if bad_frames >= MAX_RETRY:
            print("Too many bad frames")
            break
        continue

    bad_frames = 0
    frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))
    h, w, _ = frame.shape
    frame_count += 1

    # launch detection in background every 3 frames
    # face recognition every 6th frame (heavier, less frequent)
    if frame_count % 3 == 0 and not detecting:
        detecting = True
        do_faces = (frame_count % 6 == 0)
        threading.Thread(
            target=run_detection,
            args=(frame.copy(), w, h, do_faces),
            daemon=True
        ).start()

    # grab latest results
    with detect_lock:
        current_objs     = list(detect_results)
        current_obstacle = detect_obstacle
        current_stairs   = detect_stairs
        current_hole     = detect_hole
        current_path     = detect_path
        current_faces    = list(detect_faces)

    # ================= DRAW BOXES =================
    for obj in current_objs:
        x1, y1, x2, y2 = obj["x1"], obj["y1"], obj["x2"], obj["y2"]
        color = (0, 0, 255) if obj["is_obstacle"] else (0, 255, 0)
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        cv2.putText(frame, obj["name"], (x1, max(y1 - 5, 10)),
                    cv2.FONT_HERSHEY_DUPLEX, 0.55, color, 2)

    # draw recognized faces
    for face in current_faces:
        fx, fy, fw2, fh2 = face["x"], face["y"], face["w"], face["h"]
        color = (255, 200, 0) if face["name"] != "Unknown person" else (180, 180, 180)
        cv2.rectangle(frame, (fx, fy), (fx + fw2, fy + fh2), color, 2)
        cv2.putText(frame, face["name"], (fx, max(fy - 5, 10)),
                    cv2.FONT_HERSHEY_DUPLEX, 0.5, color, 2)

    # draw stair/hole/path status
    if current_stairs:
        cv2.putText(frame, "STAIRS", (10, 30),
                    cv2.FONT_HERSHEY_DUPLEX, 0.7, (0, 165, 255), 2)
    if current_hole:
        cv2.putText(frame, current_hole.upper(), (10, 55),
                    cv2.FONT_HERSHEY_DUPLEX, 0.7, (0, 0, 255), 2)
    if current_path:
        cv2.putText(frame, current_path.upper(), (10, h - 15),
                    cv2.FONT_HERSHEY_DUPLEX, 0.5, (255, 200, 0), 2)

    # ================= SPEECH PRIORITY =================
    # Priority:
    #   1. Stairs / Hole / Pit             (CRITICAL)
    #   2. Very close / named obstacle     (HIGH)
    #   3. Known face                      (HIGH)
    #   4. Path direction guidance          (MEDIUM)
    #   5. Object / unknown person          (MEDIUM)
    #   6. Safe path / Path clear          (LOW)

    spoken_msg = None

    # Evaluate path direction to append to warnings
    path_dir = ""
    if current_path == "move_left":
        path_dir = ", move left"
    elif current_path == "move_right":
        path_dir = ", move right"
    elif current_path == "narrow":
        path_dir = ", narrow path"

    # P1: Stairs
    if current_stairs:
        spoken_msg = "Stairs ahead, be careful"

    # P1: Hole / Pit
    elif current_hole == "hole":
        spoken_msg = f"Hole ahead{path_dir if path_dir else ', be careful'}"
    elif current_hole == "pit":
        spoken_msg = f"Pit ahead{path_dir if path_dir else ', be careful'}"

    # P2: Named obstacle
    elif current_obstacle:
        front_obs = [o for o in current_objs if o["is_obstacle"]]
        if front_obs:
            obj = front_obs[0]
            spoken_msg = f"{obj['name']} {obj['side_text']}{path_dir if path_dir else ', be careful'}"
        else:
            # check for ANY front object even if not flagged as obstacle
            front_any = [o for o in current_objs if o["side"] == "front"]
            if front_any:
                obj = front_any[0]
                spoken_msg = f"{obj['name']} directly ahead{path_dir if path_dir else ', be careful'}"
            elif current_objs:
                # no front object but something detected nearby
                obj = current_objs[0]
                spoken_msg = f"{obj['name']} {obj['side_text']}{path_dir if path_dir else ', be careful'}"
            else:
                spoken_msg = f"Obstacle ahead{path_dir if path_dir else ', be careful'}"

    # P3: Known face (replaces generic "person" announcement)
    elif current_faces:
        priority = {"front": 0, "left": 1, "right": 2}
        best_face = sorted(current_faces, key=lambda f: priority.get(f["side"], 3))[0]
        spoken_msg = f"{best_face['name']} {best_face['side_text']}{path_dir if path_dir else ''}"

    # P4: Path blocked (but no object/obstacle detected above)
    elif current_path in ["move_left", "move_right", "narrow"]:
        if current_path == "move_left":
            spoken_msg = "Move left"
        elif current_path == "move_right":
            spoken_msg = "Move right"
        else:
            spoken_msg = "Narrow path ahead"

    # P5: Object detected (skip "person" if face was recognized)
    elif current_objs:
        # filter out "person" if we have face results for this frame
        objs_to_announce = current_objs
        if current_faces:
            objs_to_announce = [o for o in current_objs if o["name"] != "person"]
        if objs_to_announce:
            priority = {"front": 0, "left": 1, "right": 2}
            best = sorted(objs_to_announce, key=lambda o: priority.get(o["side"], 3))[0]
            spoken_msg = f"{best['name']} {best['side_text']}{path_dir if path_dir else ''}"
        elif current_faces:
            best_face = sorted(current_faces, key=lambda f: priority.get(f["side"], 3))[0]
            spoken_msg = f"{best_face['name']} {best_face['side_text']}{path_dir if path_dir else ''}"

    # P6: Safe / Clear
    elif current_path == "safe":
        spoken_msg = "Safe path"
    else:
        spoken_msg = "Path clear"

    if spoken_msg:
        speak(spoken_msg)

    # ================= CLOCK OVERLAY =================
    cv2.putText(frame, time.strftime("%H:%M:%S"),
                (w - 120, 25), cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 2)

    cv2.imshow("AI Smart Glasses", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()