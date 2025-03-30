# MoodMuse 🎶

**Music that listens before you speak.**

MoodMuse is a real-time, emotion-aware music player that uses facial expression detection to play music tailored to your mood. It helps support mental wellness by creating emotionally intelligent soundscapes—whether you're calm, stressed, sad, or energized.

---

## 🧠 Why We Built This

In everyday life, people often experience emotional states that go unrecognized—especially in moments of stress, anxiety, or fatigue. MoodMuse is built to passively support mental health through adaptive music, turning real-time facial emotion data into calming, energizing, or comforting music without any user input.

---

## 🎯 Features

- Real-time **facial emotion recognition** via webcam  
- Adaptive music playback based on current emotional state  
- **Smooth audio crossfading** using Pygame mixer  
- Multithreaded backend: one thread for emotion detection, another for music playback  
- Emotion smoothing via temporal averaging (using `deque`)  
- Console-based simulation with UI-integration planned  

---

## 🖥️ Frontend Preview

> _The frontend is currently under construction and will be merged with the backend soon._

You can still preview the current UI dashboard and camera status features with mockups or screenshots below:

![Dashboard Screenshot](images/frontend_1.png)
![Live Camera Feed with Emotion Labels](images/frontend_2.png)

_(Add your actual screenshots to `images/` folder and replace the filenames above.)_

---

## 🏗️ Architecture Overview

- **Backend**
  - Python-based system using PyTorch + Hugging Face for emotion classification
  - `CurrentState.py`: manages temporal emotion smoothing using a 180-frame sliding window
  - `MoodMuse.py`: manages music mixing, crossfading, emotion-to-track mapping, and audio transitions
  - `emotion_detector.py`: captures webcam video, detects face, classifies emotion, and queues updates

- **Multithreading**
  - `Thread 1`: Runs `face analyzer` loop with OpenCV + Hugging Face
  - `Thread 2`: Runs `music mixer` to update playback on emotion change

- **Frontend**
  - React-based interface (currently separate from backend) displays:
    - Webcam feed
    - Detected emotion state
    - Current music track
    - Manual override controls (coming soon)

---

## 🛠️ Setup Instructions

> Note: You’ll need music files categorized by emotion in `music_files/<emotion>/`.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/moodmuse.git
   cd moodmuse
   ```

2. Create your music directory:
   ```
   moodmuse/music_files/happy/
   moodmuse/music_files/sad/
   moodmuse/music_files/neutral/
   ...
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the system:
   ```bash
   python emotion_detector.py
   ```

5. A webcam window will appear. Make facial expressions to see the emotion update and music playback adjust accordingly.

---

## 🧪 Example Use Cases

- **Baby crying** → Calm lullaby starts playing to soothe the child  
- **Patient becomes anxious in therapy** → Gentle ambient track fades in to regulate atmosphere  
- **Student focused but stressed** → Lo-fi beats fade in to boost calm and concentration  

---

## ⚙️ Current Limitations

- Frontend and backend are currently **decoupled**; integration is a top priority  
- Requires **pre-downloaded MP3s** organized by emotion—Spotify support is planned  
- Crossfade occasionally produces glitches on low-performance systems  

---

## 🚧 Roadmap

- [ ] Combine frontend + backend into a single app  
- [ ] Add Spotify API for real-time playlist streaming  
- [ ] Refactor frontend for responsive, mobile-friendly use  
- [ ] Expand to voice-tone and activity-based inputs  
- [ ] Integrate into smart speaker environments  
- [ ] Explore mental wellness app partnerships  

---

## 📄 License

MIT License

---

## 🙌 Team MoodMuse

Built with care by music lovers, mental health advocates, and engineers.  
_“Because your music should feel you.”_

Kartikeya Gullapalli, 
Lakshyajeet Domyan, 
Abdullah Sharif, 
Jayanth Damodaran

---

