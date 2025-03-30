import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';

// Add this type definition if NodeJS namespace is not available
type Timeout = ReturnType<typeof setTimeout>;

interface MoodDetectorProps {
  onMoodDetected: (mood: string) => void;
}

// Define the emotion types
type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised';

interface EmotionStats {
  happy: number;
  sad: number;
  angry: number;
  neutral: number;
  surprised: number;
}

const MoodDetectorContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const CameraContainer = styled.div<{ isVisible: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ isVisible }) => isVisible ? '350px' : '0'};
  overflow: hidden;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: height 0.3s ease;
  margin-bottom: ${({ isVisible }) => isVisible ? '1rem' : '0'};
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

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatsButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.bgTertiary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.bgSecondary};
  }
`;

const StatsContainer = styled.div<{ isVisible: boolean }>`
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: 16px;
  padding: ${({ isVisible }) => isVisible ? '1.5rem' : '0'};
  margin-top: 1rem;
  height: ${({ isVisible }) => isVisible ? 'auto' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${({ isVisible }) => isVisible ? '1' : '0'};
`;

const StatBar = styled.div`
  margin-bottom: 1rem;
  
  .label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    .emotion {
      font-weight: 500;
    }
    
    .percentage {
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
  
  .bar {
    height: 8px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.bgTertiary};
    border-radius: 4px;
    overflow: hidden;
    
    .fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
  }
`;

// Mock function to simulate emotion recognition API
// In a real app, this would call your pretrained model
const mockDetectEmotion = (): Promise<EmotionType> => {
  const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'neutral', 'surprised'];
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
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [emotionStats, setEmotionStats] = useState<EmotionStats>({
    happy: 10,
    sad: 15,
    angry: 5,
    neutral: 60,
    surprised: 10
  });

  const startDetection = useCallback(() => {
    setIsActive(true);
    if (!isCameraVisible) {
      setIsCameraVisible(true);
    }
  }, [isCameraVisible]);

  const stopDetection = useCallback(() => {
    setIsActive(false);
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraVisible(prev => !prev);
  }, []);

  const toggleStats = useCallback(() => {
    setIsStatsVisible(prev => !prev);
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
    let detectionInterval: Timeout;
    
    if (isActive && webcamRef.current) {
      detectionInterval = setInterval(async () => {
        // Using mock for demo
        const emotion = await mockDetectEmotion();
        setCurrentEmotion(emotion);
        onMoodDetected(emotion);
        
        // Update stats
        setEmotionStats(prev => {
          // In a real app, you would accumulate real data over time
          // This is just a simulation that slightly adjusts values
          const newStats = { ...prev };
          const emotionToIncrease = emotion;
          const emotionToDecrease = Object.keys(newStats).filter(e => e !== emotion)[
            Math.floor(Math.random() * 4)
          ] as EmotionType;
          
          if (newStats[emotionToIncrease] < 95) newStats[emotionToIncrease] += 2;
          if (newStats[emotionToDecrease] > 5) newStats[emotionToDecrease] -= 2;
          
          return newStats;
        });
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
        <CameraContainer isVisible={true}>
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
        <CameraContainer isVisible={true}>
          <OverlayContainer>
            <div>
              <h2>Requesting camera access...</h2>
            </div>
          </OverlayContainer>
        </CameraContainer>
      </MoodDetectorContainer>
    );
  }

  const getMoodColor = (mood: EmotionType): string => {
    switch (mood) {
      case 'happy': return 'var(--happy)';
      case 'sad': return 'var(--sad)';
      case 'angry': return 'var(--angry)';
      case 'surprised': return 'var(--surprised)';
      default: return 'var(--neutral)';
    }
  };

  return (
    <MoodDetectorContainer>
      <ButtonsContainer>
        {!isActive ? (
          <Button onClick={startDetection}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
            </svg>
            Start Detection
          </Button>
        ) : (
          <Button onClick={stopDetection}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
              <path d="M10 4H6V20H10V4Z" fill="currentColor" />
              <path d="M18 4H14V20H18V4Z" fill="currentColor" />
            </svg>
            Pause Detection
          </Button>
        )}
        
        <Button onClick={toggleCamera}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M15 8V16H5V8H15ZM16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5V7C17 6.45 16.55 6 16 6Z" fill="currentColor" />
          </svg>
          {isCameraVisible ? 'Hide Camera' : 'Show Camera'}
        </Button>
        
        <StatsButton onClick={toggleStats}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor" />
          </svg>
          {isStatsVisible ? 'Hide Statistics' : 'Show Statistics'}
        </StatsButton>
      </ButtonsContainer>
      
      <CameraContainer isVisible={isCameraVisible}>
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
      
      <StatsContainer isVisible={isStatsVisible}>
        <h3 style={{ marginBottom: '1rem' }}>Your Emotion Stats</h3>
        {Object.entries(emotionStats).map(([emotion, percentage]) => (
          <StatBar key={emotion}>
            <div className="label">
              <span className="emotion">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
              <span className="percentage">{percentage}%</span>
            </div>
            <div className="bar">
              <div 
                className="fill" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: getMoodColor(emotion as EmotionType)
                }} 
              />
            </div>
          </StatBar>
        ))}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Data collected from your recent sessions
        </p>
      </StatsContainer>
    </MoodDetectorContainer>
  );
};

export default MoodDetector; 