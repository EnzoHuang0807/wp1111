import './App.css';
import React, {useState, useEffect} from 'react';
import { guess, startGame, restart } from './axios'

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [number, setNumber] = useState('');
  const [status, setStatus] = useState('');

  const handleStart = async () => {
    await startGame();
    setHasStarted(true);
  }

  const handleGuess = async () => {
    const response = await guess(number);
    console.log(response);
    if (response === "Equal") setHasWon(true);
    else{
      setStatus(response);
      setNumber('');
    }
  }

  const handleRestart = async () => {
    await restart();
    setHasWon(false);
    setStatus('');
    setNumber('');
  }

  const startMenu =
    <div>
      <button onClick={handleStart}> start game </button>
    </div>

  const gameMode =
    <>
      <p>Guess a number between 1 to 100</p>
      <input onKeyUp={(e) => {setNumber(e.target.value)}}></input>
      <button onClick={handleGuess} disabled={!number}>guess!</button>
      <p>{status}</p>
    </>
  
  const winningMode = 
    <>
      <p>You won! the number was {number}.</p>
      <button onClick={handleRestart}>restart</button>
    </>;
  
  return (
    <div className="App">
      {hasStarted ? hasWon ? winningMode : gameMode : startMenu}
    </div>
  );
}

export default App;
