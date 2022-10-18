/****************************************************************************
  FileName      [ Row.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu ]
  Synopsis      [ This file generates the Row. ]
  Copyright     [ 2022 10 ]
****************************************************************************/

import "./css/Row.css";
import React from 'react';

const Row = ({ guess, rowIdx }) => {

    const content = () => {
        if (guess != undefined)
          return(
            guess.map((s, i) => <div className={'Row-wordbox filled' + s.color} 
            id={rowIdx + "-" + i}>{s.char}</div>)
          );
        
        else{
            let arr = [0, 1, 2, 3, 4];
            return(
              arr.map((i) => <div className='Row-wordbox filled' 
              id={rowIdx + "-" + i}></div>)
            );
        }
    }

    return (
        <div className='Row-container'>
            {/* TODO 3: Row Implementation -- Row */}
            
            {/* ↓ Default row, you should modify it. ↓ */}
            <div className='Row-wrapper'>
                {content()}
            </div>
            {/* ↑ Default row, you should modify it. ↑ */}
        </div>
    )
}

export default Row;