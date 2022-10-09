import React from 'react'

function Item (props){
  if (props.checked == 1)
    var style = {textDecoration: "line-through", opacity: "0.5"};
  else 
    var style = {};
  
  return( 
    <li className='todo-app__item'>
      <div className='todo-app__checkbox'>

        <input type="checkbox" id={props.id} 
        onChange={props.onChange} checked={props.checked}></input>
        <label htmlFor={props.id}></label>

      </div>
  
        <h1 className='todo-app__item-detail' style={style}>{props.detail}</h1>
        <img src="./x.png" className='todo-app__item-x' 
        onClick={props.onClick} id={props.id}></img>

      </li>);
}

export default Item;