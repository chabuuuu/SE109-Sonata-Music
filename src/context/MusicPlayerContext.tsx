'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

// Interface cho track music
interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverImage?: string;
}

// Interface cho player state
interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: Track[];
  currentIndex: number;
  isLooping: boolean;
  isShuffled: boolean;
}

// Interface cho player actions
interface MusicPlayerContextType {
  // State
  playerState: PlayerState;
  
  // Controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stop: () => void;
  
  // Track navigation
  playTrack: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
  
  // Volume and time
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  
  // Playlist management
  setPlaylist: (tracks: Track[]) => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: string) => void;
  
  // Player modes
  toggleLoop: () => void;
  toggleShuffle: () => void;
  
  // Audio element ref (for direct access if needed)
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

// Initial state
const initialPlayerState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  playlist: [],
  currentIndex: -1,
  isLooping: false,
  isShuffled: false,
};

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Play current track
  const play = () => {
    if (audioRef.current && playerState.currentTrack) {
      audioRef.current.play();
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  // Pause current track
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Stop playback
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayerState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        currentTime: 0 
      }));
    }
  };

  // Play specific track
  const playTrack = (track: Track) => {
    setPlayerState(prev => {
      const newIndex = prev.playlist.findIndex(t => t.id === track.id);
      return {
        ...prev,
        currentTrack: track,
        currentIndex: newIndex >= 0 ? newIndex : prev.currentIndex,
        currentTime: 0,
      };
    });

    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      audioRef.current.play();
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  // Play next track
  const playNext = () => {
    if (playerState.playlist.length === 0) return;

    let nextIndex: number;
    
    if (playerState.isShuffled) {
      // Random next track
      nextIndex = Math.floor(Math.random() * playerState.playlist.length);
    } else {
      // Sequential next track
      nextIndex = (playerState.currentIndex + 1) % playerState.playlist.length;
    }

    const nextTrack = playerState.playlist[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  // Play previous track
  const playPrevious = () => {
    if (playerState.playlist.length === 0) return;

    let prevIndex: number;
    
    if (playerState.isShuffled) {
      // Random previous track
      prevIndex = Math.floor(Math.random() * playerState.playlist.length);
    } else {
      // Sequential previous track
      prevIndex = playerState.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = playerState.playlist.length - 1;
      }
    }

    const prevTrack = playerState.playlist[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack);
    }
  };

  // Set volume (0-1)
  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  // Seek to specific time
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayerState(prev => ({ ...prev, currentTime: time }));
    }
  };

  // Set playlist
  const setPlaylist = (tracks: Track[]) => {
    setPlayerState(prev => ({ 
      ...prev, 
      playlist: tracks,
      currentIndex: tracks.length > 0 ? 0 : -1 
    }));
  };

  // Add track to playlist
  const addToPlaylist = (track: Track) => {
    setPlayerState(prev => ({
      ...prev,
      playlist: [...prev.playlist, track]
    }));
  };

  // Remove track from playlist
  const removeFromPlaylist = (trackId: string) => {
    setPlayerState(prev => {
      const newPlaylist = prev.playlist.filter(track => track.id !== trackId);
      const removedIndex = prev.playlist.findIndex(track => track.id === trackId);
      
      let newCurrentIndex = prev.currentIndex;
      if (removedIndex <= prev.currentIndex && prev.currentIndex > 0) {
        newCurrentIndex = prev.currentIndex - 1;
      }

      return {
        ...prev,
        playlist: newPlaylist,
        currentIndex: newCurrentIndex >= newPlaylist.length ? newPlaylist.length - 1 : newCurrentIndex
      };
    });
  };

  // Toggle loop mode
  const toggleLoop = () => {
    setPlayerState(prev => ({ ...prev, isLooping: !prev.isLooping }));
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    setPlayerState(prev => ({ ...prev, isShuffled: !prev.isShuffled }));
  };

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
        duration: audioRef.current?.duration || 0,
      }));
    }
  };

  const handleEnded = () => {
    if (playerState.isLooping) {
      // Replay current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      // Play next track
      playNext();
    }
  };

  const contextValue: MusicPlayerContextType = {
    playerState,
    play,
    pause,
    togglePlay,
    stop,
    playTrack,
    playNext,
    playPrevious,
    setVolume,
    seekTo,
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    toggleLoop,
    toggleShuffle,
    audioRef,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        preload="metadata"
      />
    </MusicPlayerContext.Provider>
  );
}

// Custom hook để sử dụng MusicPlayerContext
export function useMusicPlayer(): MusicPlayerContextType {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}

// Export types for external use
export type { Track, PlayerState, MusicPlayerContextType }; 