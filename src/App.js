import React, { useState, useEffect } from 'react';
import { API_URL } from './API_CONFIG';

function App() {
  const [record, setRecord] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(res => setRecord(res))
      .catch(error => console.error(error));
  }, []);



  return (
    <div>
      {record.length > 0 ? (
        record.map(rec => (
          <div key={rec.id}>
            <h3>{rec.id}</h3>
            <h3>{rec.audio_file}</h3>
          </div>
        ))
      ) : (
        <h3>Loading...</h3>
      )}
      <h2>Test dockera</h2>
    </div>
  );
}

export default App;
