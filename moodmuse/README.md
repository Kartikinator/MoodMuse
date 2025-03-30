# MoodMuse

MoodMuse is an AI-powered music website that uses facial emotion recognition to match music to your mood in real-time.

## Features

- **Real-time Emotion Detection**: Uses your webcam to detect your current emotional state (happy, sad, angry, neutral, surprised)
- **Adaptive Music Selection**: Automatically changes music to match your current mood
- **Two Modes**:
  - **Support Mode**: Plays music that matches and enhances your current emotional state
  - **Therapy Mode**: Plays music designed to balance and counteract extreme emotional states

## Tech Stack

- ReactJS
- TypeScript
- Vite
- Styled Components
- Howler.js (for audio playback)
- react-webcam (for camera integration)

## Getting Started

### Prerequisites

- Node.js (v14.0 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/moodmuse.git
cd moodmuse
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Important Note on Emotion Recognition

The current implementation uses a mock function to simulate emotion detection. In a production environment, you would need to:

1. Connect this application to your pretrained emotion recognition model
2. Modify the `MoodDetector` component to send camera frames to your model
3. Replace the mock detection function with actual API calls to your model

## License

MIT 