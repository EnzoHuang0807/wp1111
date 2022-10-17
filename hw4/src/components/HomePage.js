/****************************************************************************
  FileName      [ HomePage.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu ]
  Synopsis      [ This file generates the Home page.  ]
  Copyright     [ 2022 10 ]
****************************************************************************/

import './css/HomePage.css';
import React, { useState } from 'react';

const HomePage = ({ startGameOnClick, mineNumOnChange, boardSizeOnChange, mineNum, boardSize /* -- something more... -- */ }) => {
  const [showPanel, setShowPanel] = useState(false);      // A boolean variable. If true, the controlPanel will show.
  const [error, setError] = useState(false);              // A boolean variable. If true, means that the numbers of mines and the board size are invalid to build a game.

  {/* Advanced TODO: Implementation of Difficult Adjustment
                     Some functions may be added here! */}

  const setPanel = () => {
    if (showPanel)
      setShowPanel(false);
    else {
      setShowPanel(true);
      mineNumOnChange(10);
      boardSizeOnChange(8);
    }
  }

  const errorStyle = {
    color: (boardSize * boardSize < mineNum) ? '#880000' : 'transparent',
  } 
  
  const numStyle = {
    color: (boardSize * boardSize < mineNum) ? '#880000' : '#0f0f4b',
  } 

  const controlPanel = 
  <div className='controlWrapper'>

    <div className='error' style={errorStyle} >ERROR: Mines number and board size are invalid !</div>

    <div className='controlPanel'>

      <div className='controlCol'>
        <p className='controlTitle'>Mines Number</p>
        <input className='inputSlider' type='range' min='3' 
        max = '100' defaultValue='10' onInput={(event) => {mineNumOnChange(event.target.value)}}></input>
        <p className='controlNum' style={numStyle} >{mineNum}</p>
      </div>

      <div className='controlCol'>
        <p className='controlTitle'>Board Size (n x n)</p>
        <input className='inputSlider' type='range' min ='3' 
          max='15' defaultValue ='8' onInput={(event) => {boardSizeOnChange(event.target.value)}}></input>
          <p className='controlNum' style={numStyle} >{boardSize}</p>
      </div>

    </div>
  </div>;
 

  return (
    <div className='HomeWrapper'>
      <p className='title'>MineSweeper</p>
      {/* Basic TODO:  Implemen start button */}
      <button className='btn' onClick={startGameOnClick}>Start Game</button>

      {/* Advanced TODO: Implementation of Difficult Adjustment
                Useful Hint: <input type = 'range' min = '...' max = '...' defaultValue = '...'> 
                Useful Hint: Error color: '#880000', default text color: '#0f0f4b', invisible color: 'transparent' 
                Reminder: The defaultValue of 'mineNum' is 10, and the defaultValue of 'boardSize' is 8. */}

      <div className='controlContainer'>
        <button className='btn' onClick={setPanel}>Difficulty Adjustment</button>
        { showPanel ? controlPanel : <></>}
      </div>
    </div>
  );

}
export default HomePage;   