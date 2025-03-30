import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Howl } from 'howler';
import { useMode } from '../hooks/useMode';

interface PlayerProps {
  currentMood: string;
}

const PlayerContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const NowPlaying = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  .artwork {
    width: 160px;
    height: 160px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.bgTertiary};
    overflow: hidden;
    margin-right: 2rem;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .info {
    flex: 1;
    
    h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .artist {
      font-size: 1.2rem;
      color: ${({ theme }) => theme.colors.textSecondary};
      margin-bottom: 1rem;
    }
    
    .mood-tag {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 100px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-right: 0.5rem;
      background-color: ${({ theme }) => theme.colors.bgTertiary};
    }
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .left-controls, .right-controls {
    display: flex;
    align-items: center;
  }
  
  .play-pause {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.accentPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1.5rem;
    transition: ${({ theme }) => theme.transitions.standard};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.accentSecondary};
      transform: scale(1.05);
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
  
  .control-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.bgTertiary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5rem;
    transition: ${({ theme }) => theme.transitions.standard};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.accentPrimary};
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  .volume-slider {
    display: flex;
    align-items: center;
    width: 150px;
    margin-left: 1rem;
    
    input {
      width: 100%;
      height: 4px;
      background-color: ${({ theme }) => theme.colors.bgTertiary};
      border-radius: 2px;
      appearance: none;
      outline: none;
      
      &::-webkit-slider-thumb {
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.accentPrimary};
        cursor: pointer;
      }
    }
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;

const ProgressContainer = styled.div`
  margin: 2rem 0;
  
  .progress-bar {
    width: 100%;
    height: 6px;
    background-color: ${({ theme }) => theme.colors.bgTertiary};
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
    
    .progress {
      height: 100%;
      background-color: ${({ theme }) => theme.colors.accentPrimary};
      border-radius: 3px;
      transition: width 0.2s ease;
    }
  }
  
  .time-display {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

// Mock music library based on moods
const musicLibrary = {
  support: {
    happy: {
      title: "Good Vibes",
      artist: "Happy Artist",
      artwork: "https://source.unsplash.com/random/400x400/?colorful",
      src: "" // In a real app, this would be a URL to a music file
    },
    sad: {
      title: "Melancholy Moments",
      artist: "Sad Artist",
      artwork: "https://source.unsplash.com/random/400x400/?rain",
      src: ""
    },
    angry: {
      title: "Rage On",
      artist: "Angry Artist",
      artwork: "https://source.unsplash.com/random/400x400/?fire",
      src: ""
    },
    neutral: {
      title: "Calm Waters",
      artist: "Neutral Artist",
      artwork: "https://source.unsplash.com/random/400x400/?water",
      src: ""
    },
    surprised: {
      title: "Unexpected Turns",
      artist: "Surprised Artist",
      artwork: "https://source.unsplash.com/random/400x400/?lightning",
      src: ""
    }
  },
  therapy: {
    happy: {
      title: "Grounded Reality",
      artist: "Balance Artist",
      artwork: "https://source.unsplash.com/random/400x400/?forest",
      src: ""
    },
    sad: {
      title: "Uplifting Spirit",
      artist: "Cheerful Artist",
      artwork: "https://source.unsplash.com/random/400x400/?sunrise",
      src: ""
    },
    angry: {
      title: "Peaceful Moments",
      artist: "Calm Artist",
      artwork: "https://source.unsplash.com/random/400x400/?ocean",
      src: ""
    },
    neutral: {
      title: "Emotional Journey",
      artist: "Expressive Artist",
      artwork: "https://source.unsplash.com/random/400x400/?mountain",
      src: ""
    },
    surprised: {
      title: "Steady Rhythms",
      artist: "Consistent Artist",
      artwork: "https://source.unsplash.com/random/400x400/?desert",
      src: ""
    }
  }
};

const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' + sec : sec}`;
};

const Player: React.FC<PlayerProps> = ({ currentMood }) => {
  const { mode } = useMode();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState(musicLibrary[mode][currentMood]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(180); // Mock duration
  const [currentTime, setCurrentTime] = useState(0);
  
  // Reference for audio object (would be a real Howl instance in production)
  const soundRef = useRef<Howl | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Effect to change song when mood or mode changes
  useEffect(() => {
    const newTrack = musicLibrary[mode][currentMood];
    setCurrentTrack(newTrack);
    
    // Reset player
    if (soundRef.current) {
      // soundRef.current.stop();
    }
    
    setCurrentTime(0);
    setProgress(0);
    
    // In a real app, you would create a new Howl instance with the track src
    // soundRef.current = new Howl({
    //   src: [newTrack.src],
    //   html5: true,
    //   volume: volume,
    // });
    
    // If already playing, auto-play the new track
    if (isPlaying) {
      // soundRef.current.play();
      startProgressTracking();
    }
  }, [currentMood, mode]);
  
  // Effect to handle volume changes
  useEffect(() => {
    if (soundRef.current) {
      // soundRef.current.volume(volume);
    }
  }, [volume]);
  
  const togglePlayback = () => {
    if (isPlaying) {
      // soundRef.current?.pause();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    } else {
      // soundRef.current?.play();
      startProgressTracking();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    // Mock progress tracking
    progressInterval.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
          setIsPlaying(false);
          return 0;
        }
        
        const newTime = prev + 1;
        setProgress((newTime / duration) * 100);
        return newTime;
      });
    }, 1000);
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    const newTime = pos * duration;
    setCurrentTime(newTime);
    setProgress(pos * 100);
    
    // In a real app, you would seek to this position
    // soundRef.current?.seek(newTime);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  // Functions to get color based on mood
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'var(--happy)';
      case 'sad': return 'var(--sad)';
      case 'angry': return 'var(--angry)';
      case 'surprised': return 'var(--surprised)';
      default: return 'var(--neutral)';
    }
  };
  
  const getModeText = (mode: string) => {
    return mode === 'support' ? 'Matching' : 'Counterbalancing';
  };
  
  return (
    <PlayerContainer>
      <NowPlaying>
        <div className="artwork">
          <img src={currentTrack.artwork} alt={currentTrack.title} />
        </div>
        <div className="info">
          <h2>{currentTrack.title}</h2>
          <div className="artist">{currentTrack.artist}</div>
          <div>
            <span className="mood-tag" style={{ backgroundColor: getMoodColor(currentMood) }}>
              {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
            </span>
            <span className="mood-tag">
              {getModeText(mode)} Mode
            </span>
          </div>
        </div>
      </NowPlaying>
      
      <ProgressContainer>
        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </ProgressContainer>
      
      <Controls>
        <div className="left-controls">
          <button className="control-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19C6.55228 19 7 18.5523 7 18V6Z" fill="white"/>
              <path d="M19 12L9 5V19L19 12Z" fill="white"/>
            </svg>
          </button>
          
          <button className="play-pause" onClick={togglePlayback}>
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4H6V20H10V4Z" fill="white"/>
                <path d="M18 4H14V20H18V4Z" fill="white"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="white"/>
              </svg>
            )}
          </button>
          
          <button className="control-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 6C17 5.44772 17.4477 5 18 5C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19C17.4477 19 17 18.5523 17 18V6Z" fill="white"/>
              <path d="M5 12L15 5V19L5 12Z" fill="white"/>
            </svg>
          </button>
        </div>
        
        <div className="right-controls">
          <button className="control-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.51454 15.1998C7.46638 16.3525 5 14.865 5 12.4949V5.5051C5 3.13502 7.46638 1.64751 9.51454 2.80017L16.0636 6.29507C18.0771 7.4296 18.0771 10.5704 16.0636 11.7049L9.51454 15.1998Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18.75 6C19.1642 6 19.5 6.33579 19.5 6.75V17.25C19.5 17.6642 19.1642 18 18.75 18C18.3358 18 18 17.6642 18 17.25V6.75C18 6.33579 18.3358 6 18.75 6Z" fill="white"/>
            </svg>
          </button>
          
          <div className="volume-slider">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4265 4.42432C11.7322 4.68689 11.8491 5.07983 11.7439 5.44215L9.74385 12.4421C9.66091 12.7258 9.46622 12.9652 9.20128 13.1012C8.93633 13.2373 8.62449 13.2571 8.3422 13.1553L4.76443 11.8659C4.42276 11.7425 4.1741 11.4395 4.11241 11.0776C4.05072 10.7158 4.18435 10.3458 4.46154 10.104L10.4615 5.10402C10.7456 4.85684 11.1208 4.7775 11.4265 4.42432ZM7.87732 11.1282L9.44166 5.74834L5.02638 9.51942L7.87732 11.1282Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9582 7.54321C14.2951 7.2063 14.8216 7.2063 15.1585 7.54321C16.5469 8.93156 17.3635 10.9095 17.3635 13.0012C17.3635 15.0929 16.5469 17.0709 15.1585 18.4593C14.8216 18.7962 14.2951 18.7962 13.9582 18.4593C13.6213 18.1224 13.6213 17.5959 13.9582 17.2589C15.063 16.154 15.6918 14.6159 15.6918 13.0012C15.6918 11.3866 15.063 9.84854 13.9582 8.74366C13.6213 8.40675 13.6213 7.88023 13.9582 7.54331V7.54321Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1762 4.32521C17.5131 3.98831 18.0396 3.98831 18.3765 4.32521C19.786 5.7347 20.9227 7.43345 21.7012 9.31991C22.4797 11.2063 22.8828 13.2424 22.8828 15.3012C22.8828 17.36 22.4797 19.3961 21.7012 21.2826C20.9227 23.169 19.786 24.8678 18.3765 26.2773C18.0396 26.6142 17.5131 26.6142 17.1762 26.2773C16.8393 25.9404 16.8393 25.4139 17.1762 25.077C18.4022 23.851 19.3914 22.3737 20.0839 20.7358C20.7764 19.0978 21.2111 17.3306 21.2111 15.5422C21.2111 13.7539 20.7764 11.9866 20.0839 10.3487C19.3914 8.71077 18.4022 7.23342 17.1762 6.00744C16.8393 5.67054 16.8393 5.14401 17.1762 4.80711V4.32521Z" fill="white"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </Controls>
    </PlayerContainer>
  );
};

export default Player; 