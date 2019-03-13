import React, { Component } from 'react';
import './Datepicker.css';

class Datepicker extends Component {
  render() {
    let hours = [];
    for (let i=0; i<24; i++) {
      hours.push(<option value={i} key={'ho-' + i}>{ ('0' + i).slice(-2) }</option>);
    }

    let secondsMinutes = [];
    for (let i=0; i<60; i++) {
      secondsMinutes.push(<option value={i} key={'sm-' + i}>{ ('0' + i).slice(-2) }</option>);
    }

    return (
      <div className="Datepicker">
        <select>{hours}</select>
        <select>{secondsMinutes}</select>
        <select>{secondsMinutes}</select>
      </div>
    );
  }
}

export default Datepicker;