import React, { useState, useRef } from 'react';
import { Mic, Square, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

export const AudioRecorder = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const duration = (Date.now() - startTimeRef.current) / 1000;
        onAudioReady(audioBlob, duration);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setRecordingTime(0);
    }
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }
    
    // Create audio element to get duration
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    audio.onloadedmetadata = () => {
      onAudioReady(file, audio.duration);
    };
    
    audio.onerror = () => {
      toast.error('Error loading audio file');
    };
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
          >
            <Square className="h-4 w-4" />
            <span>Stop Recording</span>
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            <Mic className="h-4 w-4" />
            <span>Start Recording</span>
          </button>
        )}
        
        <label className="flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80">
          <Upload className="h-4 w-4" />
          <span>Upload Audio</span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      
      {isRecording && (
        <div className="flex items-center gap-2 text-sm font-medium text-destructive">
          <span className="animate-pulse">●</span>
          <span>Recording: {formatTime(recordingTime)}</span>
        </div>
      )}
    </div>
  );
};
