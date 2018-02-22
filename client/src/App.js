import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';

import Header from './components/Header/Header';
import Schedule from './components/Scedule/Shedule';

class App extends Component {
   // state = {rooms: []}

    constructor(props) {
        super(props);
        this.state = {
            openPopup: false,
            rooms: []
        };
    }

    componentDidMount() {
        fetch('/rooms')
            .then(res => res.json())
            .then(rooms => {
                return this.setState({ rooms })
            });
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <div className="l-window">
                    <div className="main">
                        <Schedule data={this.state.rooms}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
