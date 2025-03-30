import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';

interface MoodDetectorProps {
  onMoodDetected: (mood: string) => void;
}

const MoodDetectorContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const StyledWebcam = styled(Webcam)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  z-index: 10;
`;

const StatusIndicator = styled.div<{ active: boolean; emotion?: string }>`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.bgTertiary};
  border-left: 4px solid ${({ theme, emotion, active }) => 
    !active ? theme.colors.textSecondary : 
    emotion === 'happy' ? theme.colors.happy :
    emotion === 'sad' ? theme.colors.sad :
    emotion === 'angry' ? theme.colors.angry :
    emotion === 'surprised' ? theme.colors.surprised :
    theme.colors.neutral
  };
  border-radius: 4px;
  z-index: 5;
  
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ active, theme }) => active ? theme.colors.success : theme.colors.textSecondary};
    margin-right: 8px;
    animation: ${({ active }) => active ? 'pulse 1.5s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.accentPrimary};
  color: white;
  border-radius: 8px;
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accentSecondary};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.bgTertiary};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

// Mock function to simulate emotion recognition API
// In a real app, this would call your pretrained model
const mockDetectEmotion = (): Promise<string> => {
  const emotions = ['happy', 'sad', 'angry', 'neutral', 'surprised'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomEmotion);
    }, 1000);
  });
};

const MoodDetector: React.FC<MoodDetectorProps> = ({ onMoodDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');

  const startDetection = useCallback(() => {
    setIsActive(true);
  }, []);

  const stopDetection = useCallback(() => {
    setIsActive(false);
  }, []);

  // Effect to check camera permissions
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  // Effect to run emotion detection when active
  useEffect(() => {
    let detectionInterval: NodeJS.Timeout;
    
    if (isActive && webcamRef.current) {
      detectionInterval = setInterval(async () => {
        // In a real app, you would pass the webcam frame to your model
        // const imageSrc = webcamRef.current?.getScreenshot();
        // if (imageSrc) {
        //   const emotion = await yourModelFunction(imageSrc);
        //   setCurrentEmotion(emotion);
        //   onMoodDetected(emotion);
        // }
        
        // Using mock for demo
        const emotion = await mockDetectEmotion();
        setCurrentEmotion(emotion);
        onMoodDetected(emotion);
      }, 3000);
    }
    
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isActive, onMoodDetected]);

  if (hasPermission === false) {
    return (
      <MoodDetectorContainer>
        <CameraContainer>
          <OverlayContainer>
            <div>
              <h2>Camera access denied</h2>
              <p>Please enable camera access to use this feature</p>
            </div>
          </OverlayContainer>
        </CameraContainer>
      </MoodDetectorContainer>
    );
  }

  if (hasPermission === null) {
    return (
      <MoodDetectorContainer>
        <CameraContainer>
          <OverlayContainer>
            <div>
              <h2>Requesting camera access...</h2>
            </div>
          </OverlayContainer>
        </CameraContainer>
      </MoodDetectorContainer>
    );
  }

  return (
    <MoodDetectorContainer>
      <CameraContainer>
        <StyledWebcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user"
          }}
        />
        <StatusIndicator active={isActive} emotion={currentEmotion}>
          <div className="dot" />
          {isActive ? 'Detecting: ' + currentEmotion : 'Detection paused'}
        </StatusIndicator>
      </CameraContainer>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        {!isActive ? (
          <Button onClick={startDetection}>Start Detection</Button>
        ) : (
          <Button onClick={stopDetection}>Pause Detection</Button>
        )}
      </div>
    </MoodDetectorContainer>
  );
};

export default MoodDetector; 