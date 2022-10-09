import React from 'react'

function Footer(props){

  if (props.length - props.left != 0) 
    var button = <button onClick={props.clean}>Clear completed</button> ;

  if (props.length > 0){
    return(
      <footer className='todo-app__footer' id='todo-footer'>
        <div className='todo-app_total'> {props.left} left</div>
        <ul className='todo-app__view-buttons'>
          <li><button onClick={props.filter} id="all">All</button></li>
          <li><button onClick={props.filter} id="active">Active</button></li>
          <li><button onClick={props.filter} id="completed">Completed</button></li>
        </ul>
        <div className='todo-app__clean'>
        {button}
        </div>
      </footer>);
  }
}

export default Footer;