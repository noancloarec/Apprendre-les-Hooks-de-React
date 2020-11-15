import React, { useState } from 'react';
import './App.css';
import Clock from './Clock';

function App() {
  const [showClock, setShowClock] = useState(true)
  return (
    <div>
      {
        showClock &&
        <Clock />
      }
      <button
        onClick={() => setShowClock(!showClock)}>
        {showClock ? 'Cacher' : 'Afficher'} l'horloge
      </button>
    </div>
  );
}

export default App;
