import cv2
from transformers import pipeline
import torch
from PIL import Image
import numpy as np
from CurrentState import CurrentStateUpdate
from MoodMuse import MoodMuse

# Initialize the emotion recognition pipeline using the specified model.
print("Loading model...")
emotion_classifier = pipeline(
    "image-classification",
    model="dima806/facial_emotions_image_detection",
    device=0 if torch.cuda.is_available() else -1
)
print("Model loaded successfully!")

current_state = CurrentStateUpdate()
mood_muse = MoodMuse(debug=True)  # Enable debug mode

# Check if music files exist
if not mood_muse.check_music_files():
    print("WARNING: No music files found. Please add music files to the music_files directory.")
    print("The program will continue but no music will play.")

# Load OpenCV's Haar Cascade for face detection.
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# Open a connection to the primary webcam.
cap = cv2.VideoCapture(0)

# Define emotion labels mapping
emotion_labels = {
    "angry": "Angry",
    "disgust": "Disgust",
    "fear": "Fear",
    "happy": "Happy",
    "sad": "Sad",
    "surprise": "Surprise",
    "neutral": "Neutral"
}

def process_face(face_img):
    """Process a single face image and return emotion prediction"""
    try:
        # Convert BGR to RGB
        face_rgb = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
        # Convert to PIL Image
        pil_image = Image.fromarray(face_rgb)
        # Get prediction
        results = emotion_classifier(pil_image)
        print(f"Raw model output: {results}")  # Debug print
        if results and len(results) > 0:
            print(f"Detected emotion: {results[0]}")  # Debug print
            return results[0]  # Return just the first result
        return None
    except Exception as e:
        print(f"Error in process_face: {str(e)}")  # Debug print
        return None

def display_emotion(frame, x, y, w, h, emotion, confidence):
    """Display emotion and confidence on the frame"""
    try:
        # Draw rectangle around face
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        # Prepare text
        text = f"{emotion}: {confidence:.2f}"
        print(f"Displaying text: {text}")  # Debug print
        
        # Get text size to position it properly
        (text_width, text_height), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.9, 2)
        
        # Draw background rectangle for text
        cv2.rectangle(frame, (x, y - text_height - 10), (x + text_width, y), (0, 255, 0), -1)
        
        # Draw text
        cv2.putText(frame, text, (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
    except Exception as e:
        print(f"Error displaying emotion: {str(e)}")

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert frame to grayscale for face detection.
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            try:
                # Crop the detected face from the frame.
                face_img = frame[y:y+h, x:x+w]
                
                # Get emotion prediction from the model.
                result = process_face(face_img)
                
                if result:
                    # Extract emotion and confidence
                    emotion = result['label'].lower()
                    confidence = result['score']
                    
                    print(f"Processing emotion: {emotion} with confidence: {confidence}")  # Debug print
                    
                    # Map the emotion label for display
                    display_emotion_text = emotion_labels.get(emotion, emotion)
                    print(f"Mapped emotion: {display_emotion_text}")  # Debug print

                    # Measure emotion freq (use lowercase emotion)
                    true_emotion = current_state.update_state(emotion)
                    print(f"True emotion: {true_emotion}")  # Debug print

                    # Update music (use lowercase emotion)
                    if mood_muse.is_valid_emotion(true_emotion):
                        mood_muse.set_emotion(true_emotion)
                    
                    # Display emotion and confidence (use mapped emotion for display)
                    display_emotion(frame, x, y, w, h, display_emotion_text, confidence)
                else:
                    print("No emotion detected, showing neutral")  # Debug print
                    display_emotion(frame, x, y, w, h, "Neutral", 0.0)
                    
            except Exception as e:
                print(f"Error in main loop: {str(e)}")  # Debug print
                display_emotion(frame, x, y, w, h, "Neutral", 0.0)

        # Display the annotated frame.
        cv2.imshow("Live Face Emotion Recognition", frame)

        # Press 'q' to quit the video loop.
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    # Clean up
    cap.release()
    cv2.destroyAllWindows()
    mood_muse.shutdown()  # Properly shut down MoodMuse



