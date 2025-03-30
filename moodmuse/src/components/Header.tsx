import React, { useState } from 'react';
import styled from 'styled-components';

// Adding Theme type for styled-components
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

// Styled components with proper type information for theme
const HeaderContainer = styled.header<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1.25rem 2rem;
  width: 100%;
`;

const SearchBar = styled.div<{ theme: Theme }>`
  position: relative;
  width: 300px;
  margin-right: auto;
  margin-left: 2rem;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background-color: ${({ theme }) => theme.colors.bgTertiary};
    border: none;
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 0.9rem;
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textSecondary};
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accentPrimary};
    }
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const NavItems = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled.a<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ProfileButton = styled.button<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.bgTertiary};
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.accentPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
  }
  
  .name {
    font-weight: 500;
  }
  
  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean; theme: Theme }>`
  position: absolute;
  top: 70px;
  right: 2rem;
  width: 250px;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 0.75rem;
  z-index: 100;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'all' : 'none')};
  transition: all 0.2s ease;
`;

const MenuItem = styled.a<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.bgTertiary};
  }
  
  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Divider = styled.div<{ theme: Theme }>`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgTertiary};
  margin: 0.5rem 0;
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <HeaderContainer>
      <SearchBar>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" />
        </svg>
        <input type="text" placeholder="Search for songs, artists..." />
      </SearchBar>

      <NavItems>
        <NavLink href="#">Discover</NavLink>
        <NavLink href="#">Library</NavLink>
        <NavLink href="#">Playlists</NavLink>
        
        <ProfileButton onClick={toggleMenu}>
          <div className="avatar">JD</div>
          <span className="name">John Doe</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
          </svg>
        </ProfileButton>
      </NavItems>

      <DropdownMenu isOpen={isMenuOpen}>
        <MenuItem href="#">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
          </svg>
          Profile
        </MenuItem>
        <MenuItem href="#">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.26 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.74 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor" />
          </svg>
          Settings
        </MenuItem>
        <MenuItem href="#">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19.5C7.86 19.5 4.5 16.14 4.5 12C4.5 7.86 7.86 4.5 12 4.5C16.14 4.5 19.5 7.86 19.5 12C19.5 16.14 16.14 19.5 12 19.5ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor" />
          </svg>
          Activity
        </MenuItem>
        <Divider />
        <MenuItem href="#">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor" />
          </svg>
          Premium
        </MenuItem>
        <MenuItem href="#">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor" />
          </svg>
          Sign Out
        </MenuItem>
      </DropdownMenu>
    </HeaderContainer>
  );
};

export default Header; 