declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

// Declare module paths to help TypeScript find components
declare module './components/Sidebar';
declare module './components/MoodDetector';
declare module './components/Player';
declare module './components/Header';
declare module './hooks/useMode';
declare module './styles/theme'; 