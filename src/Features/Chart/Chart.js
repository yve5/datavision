import React, { Component } from 'react';
import './Chart.scss';
import Bar from '../Bar/Bar';
import Datepicker from '../Datepicker/Datepicker';
import metrics from '../../config/metrics.json';
import { SMALLEST_PERCENTAGE } from '../../config/constants';

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
      start: new Date(2019, 2, 16, 10, 0, 0).toString(),
      end: new Date(2019, 2, 16, 13, 0, 0).toString(),
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
    this.handleRecords(this.state.start, this.state.end, this.state.family);
  }
  
  handleChange(event) {
    this.handleRecords(this.state.start, this.state.end, event.target.value);
  }

  onStartTimeChange(newDate) {
    this.handleRecords(newDate, this.state.end, this.state.family);
  }

  onEndTimeChange(newDate) {
    this.handleRecords(this.state.start, newDate, this.state.family);
  }

  handleRecords(startDate, endDate, family) {
    let results = [];
    let start = new Date(startDate);
    let end = new Date(endDate);

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
      let smallest, largest, barAverage, count;

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
      start: new Date(startDate).toString(),
      end: new Date(endDate).toString(),
      family: family,
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
            <Datepicker time={this.state.start}
                        onTimeChange={this.onStartTimeChange}></Datepicker>
          </div>

          <div className="Nav__item">
            <Datepicker time={this.state.end}
                        onTimeChange={this.onEndTimeChange}></Datepicker>
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