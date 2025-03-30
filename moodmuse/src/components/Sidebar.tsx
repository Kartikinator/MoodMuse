import React from 'react';
import styled from 'styled-components';
import { useMode } from '../hooks/useMode';

// Add Theme interface for styled-components
interface Theme {
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textPrimary: string;
    textSecondary: string;
    accentPrimary: string;
    accentSecondary: string;
    accentTertiary: string;
    [key: string]: string;
  };
  shadows: {
    card: string;
    [key: string]: string;
  };
  transitions: {
    standard: string;
    [key: string]: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    [key: string]: string;
  };
}

const SidebarContainer = styled.aside<{ theme: Theme }>`
  width: 280px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.accentPrimary}, ${({ theme }) => theme.colors.accentSecondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 0.75rem;
  }
`;

const LogoIcon = styled.div<{ theme: Theme }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.accentPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModeTabs = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.5rem;
  }
`;

interface ModeButtonProps {
  active: boolean;
  theme: Theme;
}

const ModeButton = styled.button<ModeButtonProps>`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.standard};
  background-color: ${({ active, theme }) => active ? theme.colors.accentPrimary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.textPrimary : theme.colors.textSecondary};
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.accentPrimary : theme.colors.bgTertiary};
  }
  
  svg {
    margin-right: 0.75rem;
  }
`;

const Footer = styled.div<{ theme: Theme }>`
  margin-top: auto;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const Sidebar: React.FC = () => {
  const { mode, setMode } = useMode();
  
  return (
    <SidebarContainer>
      <Logo>
        <LogoIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="white"/>
          </svg>
        </LogoIcon>
        <h1>MoodMuse</h1>
      </Logo>
      
      <ModeTabs>
        <h2>Mode</h2>
        <ModeButton 
          active={mode === 'support'} 
          onClick={() => setMode('support')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
          </svg>
          Support Mode
        </ModeButton>
        <ModeButton 
          active={mode === 'therapy'} 
          onClick={() => setMode('therapy')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
          </svg>
          Therapy Mode
        </ModeButton>
      </ModeTabs>
      
      <Footer>
        <p>© 2025 MoodMuse</p>
        <p>Powered by AI</p>
      </Footer>
    </SidebarContainer>
  );
};

export default Sidebar; 