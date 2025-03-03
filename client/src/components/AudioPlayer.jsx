import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

export const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const value = parseFloat(e.target.value);
    audio.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };
  
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };
  
  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };
  
  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.currentTime + 10, duration);
  };
  
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-secondary"
        />
        <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={skipBackward} className="rounded-full p-1 hover:bg-secondary" aria-label="Skip backward 10 seconds">
            <SkipBack className="h-4 w-4" />
          </button>
          <button onClick={togglePlay} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button onClick={skipForward} className="rounded-full p-1 hover:bg-secondary" aria-label="Skip forward 10 seconds">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="rounded-full p-1 hover:bg-secondary" aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="h-2 w-20 cursor-pointer appearance-none rounded-full bg-secondary"
          />
        </div>
      </div>
    </div>
  );
};