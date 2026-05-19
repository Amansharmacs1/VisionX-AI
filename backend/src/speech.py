import os
import threading
import queue
import time
from .config import SPEECH_COOLDOWN_SAME_PHRASE

class SpeechManager:
    """
    Manages text-to-speech using macOS 'say' in a background thread.
    Utilizes a queue to avoid blocking the main UI thread and prevents overlapping speech.
    Includes a cooldown mechanism to avoid spamming the same phrase.
    """
    def __init__(self):
        self.q = queue.Queue()
        self.cooldowns = {}
        self.sound_on = True
        self.running = True
        
        self.thread = threading.Thread(target=self._worker, daemon=True)
        self.thread.start()

    def set_sound(self, state: bool):
        self.sound_on = state

    def speak(self, text: str, force=False):
        if not self.sound_on and not force:
            return

        now = time.time()
        # Check cooldown to avoid spamming the exact same phrase
        last_spoken = self.cooldowns.get(text, 0)
        if now - last_spoken > SPEECH_COOLDOWN_SAME_PHRASE or force:
            self.cooldowns[text] = now
            # Only put in queue if it's reasonably empty to avoid long delays
            if self.q.qsize() < 2:
                self.q.put(text)

    def _worker(self):
        while self.running:
            try:
                # Block for up to 0.5s waiting for text
                text = self.q.get(timeout=0.5)
                if text:
                    # Clean the text for bash execution to prevent errors/injection
                    clean_text = text.replace("'", "").replace('"', "")
                    # Execute macOS say command synchronously inside this background thread
                    os.system(f"say '{clean_text}'")
                self.q.task_done()
            except queue.Empty:
                continue
            except Exception as e:
                print(f"Speech error: {e}")

    def stop(self):
        self.running = False
        # Clear the queue
        while not self.q.empty():
            try:
                self.q.get_nowait()
                self.q.task_done()
            except queue.Empty:
                break
