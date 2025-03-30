import { useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Sidebar from './components/Sidebar'
import MoodDetector from './components/MoodDetector'
import Player from './components/Player'
import { ModeProvider } from './hooks/useMode'
import { theme } from './styles/theme'

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
`

function App() {
  const [currentMood, setCurrentMood] = useState<string>('neutral');

  return (
    <ThemeProvider theme={theme}>
      <ModeProvider>
        <AppContainer>
          <Sidebar />
          <MainContent>
            <MoodDetector onMoodDetected={setCurrentMood} />
            <Player currentMood={currentMood} />
          </MainContent>
        </AppContainer>
      </ModeProvider>
    </ThemeProvider>
  )
}

export default App 