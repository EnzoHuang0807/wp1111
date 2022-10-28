/****************************************************************************
  FileName      [ Keyboard.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu ]
  Synopsis      [ This file generates the Keyboard. ]
  Copyright     [ 2022 10 ]
****************************************************************************/

import './css/Keyboard.css';
import config from '../data/config.json';
import React, { useEffect, useState } from 'react';
import { IoBackspaceOutline } from 'react-icons/io5';

const Keyboard = ({ usedChars }) => {
    const [firstRowLetters, setFirstRowLetters] = useState(null);       // firstRowLetters must be a 10-character array.
    const [secondRowLetters, setSecondRowLetters] = useState(null);     // secondRowLetters must be a 9-character array.
    const [thirdRowLetters, setThirdRowLetters] = useState(null);

    useEffect(() => {
        // TODO 1-2: slice `config.letters` into three parts.
        setFirstRowLetters(config.letters.slice(0, 10));
        setSecondRowLetters(config.letters.slice(10, 19));
        setThirdRowLetters(config.letters.slice(19, 29));
    }, [])
    

    const genKeyboard = (id, letters) => {
      return(
        <div id={id} key={id} className='Keyboard-row'>
                {letters && letters.map((letter) => {
                    const color = usedChars[letter.char];
                    return (
                        letter.char === 'Enter' ?
                            <div key={'char_' + letter.char} className='Keyboard-char-enter' >{letter.char}</div>
                            :
                            letter.char === 'Backspace' ?
                                <div  key={'char_' + letter.char} className='Keyboard-char-backspace'><IoBackspaceOutline /></div>
                                :
                                <div id = {'char_' + letter.char} key={'char_' + letter.char} className={'Keyboard-char ' + color}>{letter.char}</div>
                    )
                })}
            </div>
      )
    }

    return (
        <div className='Keyboard-container'>
            {/* TODO 1-2: show `firstRowLetters` and `secondRowLetters` */}
            {/* TODO 5: add color to each `Keyboard-char`. */}

            {genKeyboard("KBrow_1", firstRowLetters)}
            {genKeyboard("KBrow_2", secondRowLetters)}
            {genKeyboard("KBrow_3", thirdRowLetters)}
            
        </div>
    )
}

export default Keyboard;