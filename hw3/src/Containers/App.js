import './styles.css';
import React, {Component} from 'react';
import Item from '../Components/Item';
import Header from '../Components/Header';
import Input from '../Components/Input'
import Footer from '../Components/Footer'


class TODO extends Component {

    constructor(){
        super();
        this.state = {todos: [], checked: [], filter: [], left: 0}
    }

    addTODO = (e) => {
        if (e.key === 'Enter') {
            var tmp = e.target.value;
            this.setState(state => ({ todos: [...state.todos, tmp], 
                checked: [...state.checked, 0], 
                filter: [...state.filter, 1], left: state.left + 1}));
            e.target.value = "";
          }
    };

    changeStatus = (e) => {
        var index = e.target.id;
        var tmp = this.state.checked;

        if (e.target.checked == true){
          tmp[index] = 1;
          this.setState( (state) => ({ checked: tmp, left: state.left - 1}));
        }

        else {
          tmp[index] = 0;
          this.setState( (state) => ({ checked: tmp, left: state.left + 1}));
        } 
    };

    remove = (e) => {
        var index = e.target.id;
        var tmp1 = this.state.todos, tmp2 = this.state.checked,
            tmp3 = this.state.filter;
        var cnt = this.state.left;

        if(this.state.checked[index] == 0) cnt --;

        tmp1.splice(index, 1); tmp2.splice(index, 1); 
        tmp3.splice(index, 1);
    
        this.setState( () => 
        ({ todos: tmp1, checked: tmp2, filter: tmp3, left: cnt}));
    };

    filter = (e) => {
        var type = e.target.id;
        var tmp = this.state.filter;

        if (type == "all")
            tmp.forEach((e, i) => {tmp[i] = 1});
        
        else if (type == "active")
            tmp.forEach((e, i) =>
            {tmp[i] = (this.state.checked[i] == 0)? 1 : 0;});
        else          
            tmp.forEach((e, i) =>
            {tmp[i] = (this.state.checked[i] == 1)? 1 : 0;});
        
        this.setState( () => ({ filter: tmp}));
    }

    print = (e, i) => {
        if (this.state.filter[i] == 1)
          return(<Item detail={this.state.todos[i]} 
            id={i} key={i} checked={e}
            onChange={this.changeStatus} onClick={this.remove}/>);
    }

    clean = () => {
        var tmp1 = this.state.todos, tmp2 = this.state.checked,
            tmp3 = this.state.filter;

        for (let i = 0; i < tmp1.length; i++){

          if(tmp2[i] == 1){
            tmp1.splice(i, 1); tmp2.splice(i, 1); 
            tmp3.splice(i, 1);
            i --;
          }
        }

        this.setState( () => 
        ({ todos: tmp1, checked: tmp2, filter: tmp3 }));
    }

    render(){
        return (
            <div id="root" className='todo-app__root'>
              <Header />
              <section className='todo-app__main'>
                <Input onKeyDown={this.addTODO}/>

                <ul className='todo-app__list' id='todo-list'>
                  {this.state.checked.map(this.print)}
                </ul>

              </section>
              <Footer length={this.state.todos.length} 
              left={this.state.left} filter={this.filter}
              clean={this.clean} />
            </div>
          );
    }
}

export default TODO;