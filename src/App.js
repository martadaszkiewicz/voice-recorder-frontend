
import VoiceRecorder from './components/recorder' 
import React, { useState, useRef } from 'react';
function App() {
  return (
    <div>
      <div class="header">
        <h1>Voice Recorder
          <span>Record Your Description</span>
        </h1>
      </div>
      <div className="voice-recorder-container">
        <VoiceRecorder />
      </div>

    </div>
  )
}

export default App;
