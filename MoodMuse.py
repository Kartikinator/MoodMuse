import pygame
import random
import time
import os
from pathlib import Path

class MoodMuse:
    """
    MoodMuse: A system that plays music based on detected emotions
    with smooth crossfading between different emotional states.
    """
    
    def __init__(self, debug=False):
        """
        Initialize the MoodMuse system
        
        Args:
            debug (bool): Enable debug output if True
        """
        self.debug = debug
        
        # Initialize pygame mixer with specific settings
        pygame.mixer.pre_init(44100, -16, 2, 2048)
        pygame.mixer.init()
        
        # Set up mixer channels - we need at least 2 for crossfading
        pygame.mixer.set_num_channels(8)  # Reserve more channels than needed
        
        # Create directories for music files
        self._create_directories()
        
        # Setup emotion songs dictionary
        self._setup_song_dictionary()
        
        # Initialize state
        self.current_state = {
            "emotion": None,
            "song_path": None,
            "current_channel": 0  # Track which channel is currently playing
        }
        
        if self.debug:
            print("MoodMuse initialized")
    
    def _create_directories(self):
        """Create the directory structure for music files"""
        self.music_dir = Path("music_files")
        self.music_dir.mkdir(exist_ok=True)
        
        # Create subdirectories for each emotion
        self.emotions = ["angry", "fear", "neutral", "sad", "disgust", "happy", "surprise"]
        for emotion in self.emotions:
            emotion_dir = self.music_dir / emotion
            emotion_dir.mkdir(exist_ok=True)
    
    def _setup_song_dictionary(self):
        """Set up the dictionary of emotion songs with file paths"""
        self.emotion_songs = {
            "angry": [
                "music_files/angry/Given Up.mp3",
                "music_files/angry/Killing in the Name.mp3",
                "music_files/angry/Limp Bizkit - Break Stuff (Official Music Video).mp3"
            ],
            "fear": [
                "music_files/fear\Hans Zimmer - Time (Official Audio).mp3",
                "music_files/fear/John Carpenter - HALLOWEEN Theme.mp3",
                "music_files/fear/Psycho  Main Theme  Bernard Herrmann.mp3"
            ],
            "neutral": [
                "music_files/neutral/Simon & Garfunkel - The Sounds of Silence (Audio).mp3",
                "music_files/neutral/Green Day - Boulevard of Broken Dreams (Official Audio).mp3",
                "music_files/neutral/@coldplay - Fix You (Lyrics).mp3"
            ],
            "sad": [
                "music_files/sad/song1.mp3",
                "music_files/sad/song2.mp3",
                "music_files/sad/song3.mp3"
            ],
            "disgust": [
                "music_files/disgust/song1.mp3",
                "music_files/disgust/song2.mp3",
                "music_files/disgust/song3.mp3"
            ],
            "happy": [
                "music_files/happy/song1.mp3",
                "music_files/happy/song2.mp3",
                "music_files/happy/song3.mp3"
            ],
            "surprise": [
                "music_files/surprise/song1.mp3",
                "music_files/surprise/song2.mp3",
                "music_files/surprise/song3.mp3"
            ]
        }
    
    def check_music_files(self):
        """
        Check if music files exist and print a warning if they don't
        
        Returns:
            bool: True if at least one file was found, False otherwise
        """
        missing_files = False
        available_files = False
        
        if self.debug:
            print("\nChecking music files...")
        
        for emotion, song_list in self.emotion_songs.items():
            emotion_files_exist = False
            for song_path in song_list:
                if os.path.exists(song_path):
                    emotion_files_exist = True
                    available_files = True
                    if self.debug:
                        print(f"Found: {song_path}")
                else:
                    missing_files = True
                    if self.debug:
                        print(f"Missing: {song_path}")
            
            if not emotion_files_exist and self.debug:
                print(f"Warning: No songs available for '{emotion}' emotion.")
        
        if missing_files and self.debug:
            print("\nSome music files are missing. Add MP3 files to the appropriate directories or update paths.")
        
        if not available_files and self.debug:
            print("\nWARNING: No music files were found! The program may not work correctly.")
            print("Please add MP3 files to the music_files directory or update the paths in the code.")
        
        return available_files
    
    def true_crossfade(self, old_song_path, new_song_path, duration=3.0):
        """
        Perform a true crossfade between two songs by playing both simultaneously
        and adjusting their volumes
        
        Args:
            old_song_path (str): Path to the current song
            new_song_path (str): Path to the new song
            duration (float): Duration of the crossfade in seconds
        """
        try:
            # If there's no old song, just play the new one
            if not old_song_path or not os.path.exists(old_song_path):
                if self.debug:
                    print(f"No previous song, playing: {os.path.basename(new_song_path)}")
                
                # Load and play on channel 0
                new_sound = pygame.mixer.Sound(new_song_path)
                channel0 = pygame.mixer.Channel(0)
                channel0.play(new_sound, loops=-1)
                channel0.set_volume(1.0)
                
                self.current_state["current_channel"] = 0
                return

            # Get next channel (alternating between 0 and 1)
            new_channel_num = 1 if self.current_state["current_channel"] == 0 else 0
            old_channel_num = self.current_state["current_channel"]
            
            # Get channel objects
            new_channel = pygame.mixer.Channel(new_channel_num)
            old_channel = pygame.mixer.Channel(old_channel_num)
            
            if self.debug:
                print(f"Crossfading to: {os.path.basename(new_song_path)}")
                print(f"Channels: {old_channel_num} → {new_channel_num}")
            
            try:
                # Load the new song
                new_sound = pygame.mixer.Sound(new_song_path)
                
                # Start playing new song at volume 0
                new_channel.play(new_sound, loops=-1)
                new_channel.set_volume(0.0)
                
                # Perform the crossfade
                steps = 30
                step_time = duration / steps
                for i in range(steps + 1):
                    # Calculate volumes: old decreases, new increases
                    old_volume = 1.0 - (i / steps)
                    new_volume = i / steps
                    
                    # Set the volumes
                    old_channel.set_volume(old_volume)
                    new_channel.set_volume(new_volume)
                    
                    # Wait for next step
                    time.sleep(step_time)
                
                # Ensure final volumes are correct
                old_channel.set_volume(0.0)
                new_channel.set_volume(1.0)
                
                # Stop the old channel
                old_channel.stop()
                
                # Update current channel
                self.current_state["current_channel"] = new_channel_num
                
            except Exception as e:
                if self.debug:
                    print(f"Error during crossfade sound loading: {e}")
                raise
                
        except Exception as e:
            if self.debug:
                print(f"Error during crossfade: {e}")
            
            # Recovery attempt - play new song directly
            try:
                for channel_num in range(2):
                    channel = pygame.mixer.Channel(channel_num)
                    channel.stop()
                
                new_sound = pygame.mixer.Sound(new_song_path)
                channel0 = pygame.mixer.Channel(0)
                channel0.play(new_sound, loops=-1)
                channel0.set_volume(1.0)
                
                self.current_state["current_channel"] = 0
                if self.debug:
                    print(f"Recovery successful - playing: {os.path.basename(new_song_path)}")
                
            except Exception as e2:
                if self.debug:
                    print(f"Failed to recover from crossfade error: {e2}")
                    print(f"Song path that failed: {new_song_path}")
                    print(f"Does file exist? {os.path.exists(new_song_path)}")
    
    def set_emotion(self, new_emotion):
        """
        Set the music based on detected emotion - main method to be called programmatically
        
        Args:
            new_emotion (str): The newly detected emotion
        
        Returns:
            bool: True if the music changed, False otherwise
        """
        # Convert input to lowercase for consistency
        new_emotion = new_emotion.lower()
        
        if self.debug:
            print(f"\nAttempting to set emotion: {new_emotion}")
            print(f"Available emotions: {list(self.emotion_songs.keys())}")
            print(f"Current state: {self.current_state}")
        
        # Validate the emotion input
        if new_emotion not in self.emotion_songs:
            if self.debug:
                print(f"Error: '{new_emotion}' is not a valid emotion. Valid emotions are: {', '.join(self.emotion_songs.keys())}")
            return False
        
        # If this is the same emotion as current, do nothing
        if new_emotion == self.current_state["emotion"]:
            if self.debug:
                print(f"Emotion '{new_emotion}' is already playing. Continuing current song.")
            return False
        
        # Select a random song from the new emotion's list
        available_songs = [song for song in self.emotion_songs[new_emotion] if os.path.exists(song)]
        
        if self.debug:
            print(f"Available songs for {new_emotion}: {available_songs}")
            print(f"All songs for {new_emotion}: {self.emotion_songs[new_emotion]}")
        
        if not available_songs:
            if self.debug:
                print(f"Error: No available songs found for '{new_emotion}' emotion.")
                print(f"Current directory: {os.getcwd()}")
                print(f"Music directory: {self.music_dir}")
                print(f"Does music directory exist? {os.path.exists(self.music_dir)}")
            return False
        
        new_song_path = random.choice(available_songs)
        
        if self.debug:
            print(f"Selected song: {new_song_path}")
            print(f"Does song file exist? {os.path.exists(new_song_path)}")
        
        # Print information about the transition
        previous_emotion = "none" if self.current_state["emotion"] is None else self.current_state["emotion"]
        if self.debug:
            print(f"\nEmotion change detected: {previous_emotion} -> {new_emotion}")
            print(f"Selecting a new song for '{new_emotion}' emotion...")
        
        # Perform true crossfade between songs
        self.true_crossfade(self.current_state["song_path"], new_song_path)
        
        # Update the current state
        self.current_state["emotion"] = new_emotion
        self.current_state["song_path"] = new_song_path
        
        if self.debug:
            print(f"Now playing: A {new_emotion} song\n")
        return True
    
    def shutdown(self):
        """Stop all playback and clean up resources"""
        # Stop all channels
        for i in range(8):
            channel = pygame.mixer.Channel(i)
            channel.stop()
        pygame.mixer.quit()
        if self.debug:
            print("MoodMuse system shut down.")
    
    def get_current_emotion(self):
        """
        Get the currently playing emotion
        
        Returns:
            str or None: The current emotion, or None if no music is playing
        """
        return self.current_state["emotion"]
    
    def is_valid_emotion(self, emotion):
        """
        Check if an emotion is valid
        
        Args:
            emotion (str): The emotion to check
            
        Returns:
            bool: True if the emotion is valid, False otherwise
        """
        return emotion.lower() in self.emotion_songs


# Example 1: Basic usage with direct emotion setting
def basic_example():
    # Create the MoodMuse system with debug output enabled
    mood_system = MoodMuse(debug=True)
    
    # Check if music files exist
    if not mood_system.check_music_files():
        print("No music files found. Please add some music files and try again.")
        return
    
    print("\nPlaying 'happy' emotion...")
    mood_system.set_emotion("happy")
    time.sleep(10)  # Listen to happy music for 10 seconds
    
    print("\nChanging to 'sad' emotion...")
    mood_system.set_emotion("sad")
    time.sleep(10)  # Listen to sad music for 10 seconds
    
    print("\nShutting down...")
    mood_system.shutdown()


# Example 2: Integration with a simple emotion detection simulator
def emotion_detection_simulator():
    # Create the MoodMuse system with debug output enabled
    mood_system = MoodMuse(debug=True)
    
    # Check if music files exist
    mood_system.check_music_files()
    
    print("Context-Aware MoodMuse System Started")
    print("=====================================")
    print("This system will play music based on detected emotions.")
    
    # List of available emotions for reference
    print(f"Available emotions: {', '.join(mood_system.emotion_songs.keys())}")
    print("Type 'exit' to quit")
    
    try:
        while True:
            # Get emotion input from user (simulating emotion detection)
            user_input = input("\nEnter detected emotion: ").strip().lower()
            
            if user_input == "exit":
                print("Exiting MoodMuse System. Goodbye!")
                mood_system.shutdown()
                break
            
            # Process the emotion
            mood_system.set_emotion(user_input)
    except KeyboardInterrupt:
        print("\nExiting MoodMuse System. Goodbye!")
        mood_system.shutdown()
    except Exception as e:
        print(f"An error occurred: {e}")
        mood_system.shutdown()


if __name__ == "__main__":
    # Choose which example to run
    # Uncomment the one you want to use
    
    # Example 1: Basic programmatic usage
    # basic_example()
    
    # Example 2: Interactive simulator (similar to original)
    emotion_detection_simulator()