import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioData, setAudioData] = useState([]);
  const [showRedIcon, setShowRedIcon] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [duration, setDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); // Add state for total duration
  const mediaRecorderRef = useRef(null);
  const startTimeRef = useRef(0);

  const startRecording = () => {
    // TODO: check if it was not already started
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.addEventListener('start', handleRecordingStart);
        mediaRecorder.start();

        setRecording(true);
        setShowRedIcon(true);
        setShowUploadButton(false);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };

  const endRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setRecording(false);
    setShowRedIcon(false);
    setShowUploadButton(true);
    setTotalDuration(duration); 
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioData(prevAudioData => [...prevAudioData, event.data]);
    }
  };

  const handleRecordingStart = () => {
    startTimeRef.current = Date.now();
    const timerInterval = setInterval(() => {
      const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDuration(currentTime);
    }, 1000);

    mediaRecorderRef.current.addEventListener('stop', () => {
      clearInterval(timerInterval);
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} sec`;
    } else {
      return `${minutes} min ${remainingSeconds} sec`;
    }
  };

  const uploadAudio = () => {
    if (audioData.length === 0) {
      console.error('No audio data available.');
      return;
    }

    const formData = new FormData();
    audioData.forEach((data, index) => {
      formData.append('audio_file', data, `recording_${index}.mp3`);
    });

    fetch('http://127.0.0.1:8000/upload/', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        console.log('Upload success:', response);
      })
      .catch(error => {
        console.error('Upload error:', error);
      });
  };

  return (
    <div className="voice-recorder-container">
      <div className="button-container">
        <button onClick={startRecording} disabled={recording} className="custom-button-start">
          Start Recording
        </button>
        <button onClick={endRecording} disabled={!recording} className="custom-button-end">
          End Recording
        </button>
        {showUploadButton && (
          <button onClick={uploadAudio} disabled={recording} className="custom-button-upload">
            Upload Audio
          </button>
        )}
      </div>
      {showRedIcon && (
        <div className="icon-red"></div>
      )}
      {recording && (
        <div className="recording-duration">
          Recording Duration: {formatTime(duration)}
        </div>
      )}
      {!recording && totalDuration > 0 && (
        <div className="total-duration">
          Your Latest Record: {formatTime(totalDuration)}
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
