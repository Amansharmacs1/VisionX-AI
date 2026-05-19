import cv2
import time
from datetime import datetime
import mediapipe as mp
import pyttsx3
import threading

# ================= SETTINGS =================
audio_enabled = True
mode = "Input"

last_gesture_time = 0
GESTURE_DELAY = 2

last_speech_time = 0
SPEECH_DELAY = 1.0

FACE_INTERVAL = 3
frame_count = 0

detected_faces = []
palm_start_time = None

face_present = False
no_face_frames = 0

# ================= VOICE =================
engine = pyttsx3.init()
engine.setProperty("rate", 175)
engine.setProperty("volume", 1.0)

voice_lock = threading.Lock()

def voice_worker(msg):
    with voice_lock:
        engine.say(msg)
        engine.runAndWait()

def speak(msg):
    global last_speech_time

    if not audio_enabled:
        return

    now = time.time()

    if now - last_speech_time < SPEECH_DELAY:
        return

    threading.Thread(
        target=voice_worker,
        args=(msg,),
        daemon=True
    ).start()

    last_speech_time = now

# ================= CAMERA =================
ip = input("Enter Phone IP: ")
url = f"http://{ip}:8080/video"

cap = cv2.VideoCapture(url)

if not cap.isOpened():
    print("Camera not connected")
    exit()

# ================= HAND DETECTOR =================
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

mp_draw = mp.solutions.drawing_utils

# ================= FACE DETECTOR =================
mp_face = mp.solutions.face_detection
face_detector = mp_face.FaceDetection(
    model_selection=1,
    min_detection_confidence=0.88
)

# ================= HELPERS =================
def count_fingers(hand_landmarks):
    tips = [8, 12, 16, 20]
    fingers = 0

    for tip in tips:
        if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[tip - 2].y:
            fingers += 1

    return fingers

# ================= MAIN LOOP =================
while True:

    ret, frame = cap.read()

    if not ret:
        continue

    frame = cv2.flip(frame, 1)

    h, w, _ = frame.shape
    frame_count += 1

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    now = time.time()

    # ================= HAND GESTURE =================
    hand_result = hands.process(rgb)

    if hand_result.multi_hand_landmarks:

        hand_landmarks = hand_result.multi_hand_landmarks[0]

        mp_draw.draw_landmarks(
            frame,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS
        )

        fingers = count_fingers(hand_landmarks)

        if now - last_gesture_time > GESTURE_DELAY:

            # FIST = SOUND TOGGLE
            if fingers == 0:
                audio_enabled = not audio_enabled
                last_gesture_time = now

                if audio_enabled:
                    speak("Sound on")

            # TWO FINGERS = MODE CHANGE
            elif fingers == 2:
                mode = "Output" if mode == "Input" else "Input"
                speak(mode + " mode")
                last_gesture_time = now

        # OPEN PALM = TIME
        if fingers >= 3:
            if palm_start_time is None:
                palm_start_time = now

            elif now - palm_start_time > 1:
                current_time = datetime.now().strftime("%I:%M %p")
                speak(current_time)
                palm_start_time = None

        else:
            palm_start_time = None

    else:
        palm_start_time = None

    # ================= FACE DETECTION =================
    if frame_count % FACE_INTERVAL == 0:

        detected_faces = []

        result = face_detector.process(rgb)

        count = 0

        if result.detections:

            for detection in result.detections:

                score = detection.score[0]

                if score < 0.88:
                    continue

                box = detection.location_data.relative_bounding_box

                x = int(box.xmin * w)
                y = int(box.ymin * h)
                bw = int(box.width * w)
                bh = int(box.height * h)

                # strict filtering
                if bw < 120 or bh < 120:
                    continue

                if x < 20 or y < 20:
                    continue

                if x + bw > w - 20 or y + bh > h - 20:
                    continue

                ratio = bw / bh

                if ratio < 0.65 or ratio > 1.35:
                    continue

                count += 1

                center = x + bw // 2

                if center < w * 0.3:
                    direction = "LEFT"
                elif center < w * 0.7:
                    direction = "FRONT"
                else:
                    direction = "RIGHT"

                if bw > 230:
                    distance = "NEAR"
                elif bw > 160:
                    distance = "MEDIUM"
                else:
                    distance = "FAR"

                detected_faces.append(
                    (direction, distance, x, y, bw, bh)
                )

        # Smart voice trigger
        if count > 0:
            no_face_frames = 0

            if not face_present:
                speak("Person detected")
                face_present = True

        else:
            no_face_frames += 1

            if no_face_frames > 4:
                face_present = False

    # ================= DRAW =================
    for direction, distance, x, y, bw, bh in detected_faces:

        cv2.rectangle(
            frame,
            (x, y),
            (x + bw, y + bh),
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            "PERSON",
            (x, y - 40),
            cv2.FONT_HERSHEY_DUPLEX,
            0.8,
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            direction,
            (x, y - 15),
            cv2.FONT_HERSHEY_DUPLEX,
            0.65,
            (255, 255, 255),
            2
        )

        cv2.putText(
            frame,
            distance,
            (x, y + bh + 22),
            cv2.FONT_HERSHEY_DUPLEX,
            0.65,
            (0, 255, 255),
            2
        )

    # Clock only
    cv2.putText(
        frame,
        datetime.now().strftime("%H:%M:%S"),
        (w - 145, 35),
        cv2.FONT_HERSHEY_DUPLEX,
        0.7,
        (255, 255, 255),
        2
    )

    cv2.imshow("AI Smart Glasses", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()