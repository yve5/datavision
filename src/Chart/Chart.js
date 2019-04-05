import React, { Component } from 'react';
import './Chart.scss';
import metrics from '../config/metrics.json';
import { DATEPICKER_TIME_INTERVALS, SELECT_OPTIONS } from '../config/constants';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';

class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: [],
      data: [],
      family: SELECT_OPTIONS[0]['value'],
      start: new Date(2019, 2, 16, 10, 0, 0),
      end: new Date(2019, 2, 16, 13, 0, 0),
      min: {},
      max: {},
      average: null,
      dateError: false,
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
    if (prevState.start !== this.state.start || prevState.end !== this.state.end) {
      if (this.state.start > this.state.end && prevState.start !== this.state.start) {
        this.setState({ start: prevState.start });
      }
      else if (this.state.start > this.state.end && prevState.end !== this.state.end) {
        this.setState({ end: prevState.end });
      }

      this.handleRecords();
    }

    if (prevState.family !== this.state.family) {
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

    let labels = [];
    let data = [];

    metrics.forEach(element => {
      if (element.time) {
        element.width = 70;
      
        let pieces = element.time.split(' ');
        pieces = pieces[1].split(':');
        
        let eltDate = new Date(2019, 2, 16, pieces[0], pieces[1], pieces[2]);
        
        if (eltDate >= start && eltDate <= end) {
          results.push(element);
          labels.push(element.time);
          data.push(element[this.state.family]);
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
    }

    this.setState({
      labels: labels,
      data: data,
      min: smallestElement,
      max: largestElement,
      average: realAverage,
    });
  }
  
  render() {
    let Alert;

    if (this.state.labels.length) {
      Alert = <div className="Alert">
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

    let chartData = {
      labels: this.state.labels,
      datasets: [
        {
          label: this.state.family.substr(0,1).toUpperCase() + this.state.family.substr(1).toLowerCase(),
          data: this.state.data,
          backgroundColor: 'rgba(84, 84, 255, 0.2)',
          borderColor: 'rgba(84, 84, 255, 1)',
          borderWidth: 1,
        },
        {
          label: 'Average',
          data: [
            {x: this.state.labels[0], y: this.state.average},
            {x: this.state.labels[this.state.labels.length - 1], y: this.state.average},
          ],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(255, 0, 0, 1)',
          borderWidth: 2,
          borderDash: [5, 5],
        }
      ],
    };
    
    return (
      <div>
        <h1>Metrics</h1>

        <nav className="Nav">
          <div className="Nav__item">
            <select onChange={this.handleChange} value={this.state.family}>
              {SELECT_OPTIONS.map((option, index) => {
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
              timeIntervals={DATEPICKER_TIME_INTERVALS}
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
              timeIntervals={DATEPICKER_TIME_INTERVALS}
              minDate={new Date(2019, 2, 16, 10)}
              maxDate={new Date(2019, 2, 16, 10)}
              showTimeSelect
            />
          </div>
        </nav>

        {Alert}

        <Line 
          data={chartData} 
          width={100}
          height={50}
        />
      </div>
    );
  }
}

export default Chart;