import React, { Component } from 'react';
import './App.scss';
import Chart from './Features/Chart/Chart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Chart></Chart>
      </div>
    );
  }
}

export default App;