import React from 'react'

export default ({onKeyDown}) => {
    return <input className='todo-app__input' 
            placeholder='What needs to be done?' onKeyDown={onKeyDown}>
           </input>;
}