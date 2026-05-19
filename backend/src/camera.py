import cv2
import threading
import time

class VideoCaptureManager:
    """
    Reads frames from the camera in a dedicated background thread.
    This prevents buffer accumulation and ensures the main thread always gets the most recent frame,
    reducing lag significantly.
    """
    def __init__(self, src=0, width=1280, height=720):
        self.src = src
        self.cap = cv2.VideoCapture(self.src)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
        
        self.ret, self.frame = self.cap.read()
        self.running = True
        self.lock = threading.Lock()
        
        # Start thread
        self.thread = threading.Thread(target=self._update, daemon=True)
        self.thread.start()
        
    def _update(self):
        while self.running:
            ret, frame = self.cap.read()
            with self.lock:
                self.ret = ret
                self.frame = frame
            # Tiny sleep to yield thread and prevent 100% CPU on this core
            time.sleep(0.01)

    def read(self):
        with self.lock:
            if self.frame is not None:
                return self.ret, self.frame.copy()
            return self.ret, None

    def release(self):
        self.running = False
        self.thread.join(timeout=1.0)
        self.cap.release()
