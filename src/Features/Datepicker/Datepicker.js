import React, { Component } from 'react';
import { HOUR_RANGE_START, HOUR_RANGE_END, SEC_MIN_RANGE_START, SEC_MIN_RANGE_END } from '../../config/constants';

class Datepicker extends Component {
  constructor(props) {
    super(props);

    let initialDate = new Date(this.props.time);

    this.state = {
      hours: initialDate.getHours(),
      minutes: initialDate.getMinutes(),
      seconds: initialDate.getSeconds(),
    }

    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.handleSecondsChange = this.handleSecondsChange.bind(this);
  }

  handleHoursChange(event) {
    this.setState({ hours: event.target.value });

    let update = new Date(this.props.time);
    update.setHours(event.target.value);
    this.props.onTimeChange(update.toString());
  }

  handleMinutesChange(event) {
    this.setState({ minutes: event.target.value });

    let update = new Date(this.props.time);
    update.setMinutes(event.target.value);
    this.props.onTimeChange(update.toString());
  }

  handleSecondsChange(event) {
    this.setState({ seconds: event.target.value });

    let update = new Date(this.props.time);
    update.setSeconds(event.target.value);
    this.props.onTimeChange(update.toString());
  }
  
  render() {
    let hours = [];
    for (let i=HOUR_RANGE_START; i<HOUR_RANGE_END; i++) {
      hours.push(<option value={i} key={'ho-' + i}>{ ('0' + i).slice(-2) }</option>);
    }

    let secsMins = [];
    for (let i=SEC_MIN_RANGE_START; i<SEC_MIN_RANGE_END; i++) {
      secsMins.push(<option value={i} key={'sm-' + i}>{ ('0' + i).slice(-2) }</option>);
    }

    return (
      <div className="Datepicker">
        <select value={this.state.hours} onChange={this.handleHoursChange}>{hours}</select>
        <select value={this.state.minutes} onChange={this.handleMinutesChange}>{secsMins}</select>
        <select value={this.state.seconds} onChange={this.handleSecondsChange}>{secsMins}</select>
      </div>
    );
  }
}

export default Datepicker;