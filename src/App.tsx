import React from 'react';
import './App.css'
import { SnackBarProvider, useSnackbar } from './Snackbar';



function App() {
  return (
    <SnackBarProvider >
      <Toolbar />
    </SnackBarProvider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const setSnack  = useSnackbar()
  return (
    <button onClick={() => setSnack(Math.random() <0.5?<ExampleComponent />:'Chim', 2000)} >
      Une div n'importe ou dans app
    </button>
  );
}

function ExampleComponent() {
  return <div>
    <p>
      coucou example
    </p>
    <input type="text" placeholder="jean charles" />
  </div>
}


export default App