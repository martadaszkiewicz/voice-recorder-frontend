import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioData, setAudioData] = useState([]);
  const mediaRecorderRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.start();

        setRecording(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioData(prevAudioData => [...prevAudioData, event.data]);
    }
  };

  const uploadAudio = () => {
    if (audioData.length === 0) {
      console.error('No audio data available.');
      return;
    }

    const formData = new FormData();
    audioData.forEach((data, index) => {
      formData.append('audio_file', data, `recording.mp3`);
    });

    fetch('http://127.0.0.1:8000/upload/', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        // Handle API response
        console.log('Upload success:', response);
      })
      .catch(error => {
        console.error('Upload error:', error);
      });
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <button onClick={uploadAudio} disabled={recording}>
        Upload Audio
      </button>
    </div>
  );
};

export default VoiceRecorder;
