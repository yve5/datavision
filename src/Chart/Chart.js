import React, { Component } from 'react';
import './Chart.css';
import Bar from '../Bar/Bar';
import Datepicker from '../Datepicker/Datepicker';

import metrics from '../data/metrics.json';

class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      family: 'files',
      records: [],
      start: new Date(2019, 2, 16, 12, 0, 0).toString(),
      end: new Date(2019, 2, 16, 12, 15, 0).toString(),
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleRecords = this.handleRecords.bind(this);
    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
  }

  componentDidMount() {
    this.handleRecords(this.state.start, this.state.end);
  }
  
  handleChange(event) {
    this.setState({ family: event.target.value });
  }

  onStartTimeChange(newDate) {
    this.setState({ start: new Date(newDate).toString() });
    this.handleRecords(newDate, this.state.end);
  }

  onEndTimeChange(newDate) {
    this.setState({ end: new Date(newDate).toString() });
    this.handleRecords(this.state.start, newDate);
  }

  handleRecords(startDate, endDate) {
    let result = [];
    let start = new Date(startDate);
    let end = new Date(endDate);

    metrics.forEach(element => {
      element.width = 70;
      
      if (element.time) {
        let splitResult = element.time.split(' ');
        splitResult = splitResult[1].split(':');
        
        let eltDate = new Date(2019, 2, 16, splitResult[0], splitResult[1], splitResult[2]);
        
        if (eltDate > start && eltDate < end) {
          result.push(element);
        }
      }
    });
    
    // Smallest element, largest element
    let smallest = result[0][this.state.family];

    console.log(smallest);

    result.forEach(element => {
    
    })
    
    this.setState({ records: result }); 
  }
  
  render() {
    return (
      <div>
        <select onChange={this.handleChange} value={this.state.family}>
          <option value="files">number of files</option>
          <option value="inodes">number of inodes</option>
          <option value="recv">network > bytes received (bytes)</option>
          <option value="send">network > bytes sended (bytes)</option>
          <option value="used">memory usage > used (bytes)</option>
          <option value="buff">memory usage > buff (bytes)</option>
          <option value="cach">memory usage > cach (bytes)</option>
          <option value="free">memory usage > free (bytes)</option>
          <option value="usr">total cpu usage > usr (percentage)</option>
          <option value="sys">total cpu usage > sys (percentage)</option>
          <option value="idl">total cpu usage > idl (percentage)</option>
          <option value="wai">total cpu usage > wai (percentage)</option>
          <option value="hiq">total cpu usage > hiq (percentage)</option>
          <option value="siq">total cpu usage > siq (percentage)</option>
          <option value="read">read bytes on disk</option>
          <option value="writ">write bytes on disk</option>
          <option value="1m">load average > for last minute (percentage)</option>
          <option value="5m">load average > for last 5 minutes (percentage)</option>
          <option value="15m">load average > for last 15 minutes (percentage)</option>
        </select>

        
        <Datepicker time={this.state.start} onTimeChange={this.onStartTimeChange}></Datepicker>
        <Datepicker time={this.state.end} onTimeChange={this.onEndTimeChange}></Datepicker>


        <div className="Chart">
          {this.state.records.map((record, index) => { return <Bar key={index} time={record.time} data={record[this.state.family]} width={record.width} /> })}
        </div>
      </div>
    );
  }
}

export default Chart;