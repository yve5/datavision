import React, { Component } from 'react';
import './App.css';
import Chart from './Chart/Chart';

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: [12, 5, 6, 6, 9, 10],
      width: 700,
      height: 500,
    }
  }
  
  render() {
    return (
      <div className="App">
        <Chart data={this.state.data}></Chart>
      </div>
      );
    }
  }
  
  export default App;