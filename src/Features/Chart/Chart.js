import React, { Component } from 'react';
import './Chart.scss';
import Bar from '../Bar/Bar';
import metrics from '../../config/metrics.json';
import { SMALLEST_PERCENTAGE } from '../../config/constants';


import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [
        { 'value': 'files', 'description': 'number of files' },
        { 'value': 'inodes', 'description': 'number of inodes' },
        { 'value': 'recv', 'description': 'network > bytes received (bytes)' },
        { 'value': 'send', 'description': 'network > bytes sended (bytes)' },
        { 'value': 'used', 'description': 'memory usage > used (bytes)' },
        { 'value': 'buff', 'description': 'memory usage > buff (bytes)' },
        { 'value': 'cach', 'description': 'memory usage > cach (bytes)' },
        { 'value': 'free', 'description': 'memory usage > free (bytes)' },
        { 'value': 'usr', 'description': 'total cpu usage > usr (percentage)' },
        { 'value': 'sys', 'description': 'total cpu usage > sys (percentage)' },
        { 'value': 'idl', 'description': 'total cpu usage > idl (percentage)' },
        { 'value': 'wai', 'description': 'total cpu usage > wai (percentage)' },
        { 'value': 'hiq', 'description': 'total cpu usage > hiq (percentage)' },
        { 'value': 'siq', 'description': 'total cpu usage > siq (percentage)' },
        { 'value': 'read', 'description': 'read bytes on disk' },
        { 'value': 'writ', 'description': 'write bytes on disk' },
        { 'value': '1m', 'description': 'load average > for last minute (percentage)' },
        { 'value': '5m', 'description': 'load average > for last 5 minutes (percentage)' },
        { 'value': '15m', 'description': 'load average > for last 15 minutes (percentage)' },
      ],
      family: 'files',
      records: [],
      start: new Date(2019, 2, 16, 10, 0, 0),
      end: new Date(2019, 2, 16, 13, 0, 0),
      min: {},
      max: {},
      average: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleRecords = this.handleRecords.bind(this);
    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
  }

  componentDidMount() {
    this.handleRecords();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.family !== this.state.family 
        || prevState.start !== this.state.start 
        || prevState.end !== this.state.end) {
      this.handleRecords();
    }
  }

  handleChange(event) {
    this.setState({ family: event.target.value });
  }

  onStartTimeChange(newDate) {
    this.setState({ start: new Date(newDate) });
  }

  onEndTimeChange(newDate) {
    this.setState({ end: new Date(newDate) });
  }

  handleRecords() {
    let results = [];
    let start = new Date(this.state.start);
    let end = new Date(this.state.end);
    let family = this.state.family;

    metrics.forEach(element => {
      if (element.time) {
        element.width = 70;
      
        let pieces = element.time.split(' ');
        pieces = pieces[1].split(':');
        
        let eltDate = new Date(2019, 2, 16, pieces[0], pieces[1], pieces[2]);
        
        if (eltDate >= start && eltDate <= end) {
          results.push(element);
        }
      }
    });
    
    // Smallest, largest, average
    let smallestElement = {};
    let largestElement = {};
    let realAverage = null;

    if (results.length) {
      let smallest;
      let largest;
      let barAverage;
      let count;

      smallest = largest = results[0][family];
      smallestElement = largestElement = results[0];
      barAverage = 0;
      count = 0;
      
      results.forEach(result => {
        // In case of missing records
        if (typeof result[family] !== 'undefined') {
          if (smallest > result[family]) {
            smallest = result[family];
            smallestElement = result;
          }
          
          if (largest < result[family]) {
            largest = result[family];
            largestElement = result;
          }

          barAverage += result[family];
          count++;
        }
      });

      // Average calculation
      realAverage = barAverage.toFixed(3) / count;
      realAverage = realAverage.toFixed(3);

      if (smallest !== largest) {
        barAverage = (100 - SMALLEST_PERCENTAGE) * (realAverage - smallest);
        barAverage /= (largest - smallest);
        barAverage = (barAverage + SMALLEST_PERCENTAGE) * 100 / 100;
        barAverage = Math.round(barAverage);
      }

      // Width calculation
      results.forEach(result => {
        result.width = 0;

        if (smallest !== largest) {
          result.width = (100 - SMALLEST_PERCENTAGE) * (result[family] - smallest);
          result.width /= (largest - smallest);
          result.width = (result.width + SMALLEST_PERCENTAGE) * 100 / 100;
          result.width = Math.round(result.width);
        }

        result.average = barAverage;
      });
    }

    this.setState({
      records: results,
      min: smallestElement,
      max: largestElement,
      average: realAverage,
    });
  }
  
  render() {
    let alert;

    if (this.state.records.length) {
      alert = <div className="Alert">
                <div className="Alert__item">
                  Min value: {this.state.min[this.state.family]}<br/>
                  {this.state.min.time}
                </div>
                <div className="Alert__item">
                  Max value: {this.state.max[this.state.family]}<br/>
                  {this.state.max.time}
                </div>
                <div className="Alert__item">
                  Average: {this.state.average}
                </div>
              </div>;
    }
    
    return (
      <div>
        <h1>Metrics</h1>

        <nav className="Nav">
          <div className="Nav__item">
            <select onChange={this.handleChange} value={this.state.family}>
              {this.state.options.map((option, index) => {
                return <option value={option.value} key={index}>
                  {option.description}
                </option>
              })}
            </select>
          </div>
          
          <div className="Nav__item">
            <DatePicker
              selected={this.state.start}
              onChange={this.onStartTimeChange}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeIntervals={10}
              minDate={new Date(2019, 2, 16, 10)}
              maxDate={new Date(2019, 2, 16, 10)}
              showTimeSelect
            />
          </div>

          <div className="Nav__item">
            <DatePicker
              selected={this.state.end}
              onChange={this.onEndTimeChange}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeIntervals={10}
              minDate={new Date(2019, 2, 16, 10)}
              maxDate={new Date(2019, 2, 16, 10)}
              showTimeSelect
            />
          </div>
        </nav>

        {alert}

        <div className="Chart">
          {this.state.records.map((record, index) => {
            return <Bar key={index}
                        time={record.time}
                        data={record[this.state.family]}
                        average={record.average}
                        width={record.width} />
          })}
        </div>
      </div>
    );
  }
}

export default Chart;