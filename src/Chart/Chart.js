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
      start: '',
      end: '',
    }
    
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let filter = metrics.filter((record) => { return 1 });
    this.setState({ records: filter });
  }
  
  handleClick() {
    let filter = metrics.filter((record) => { return 0 });
    this.setState({ records: filter });
  }

  handleChange(event) {
    this.setState({ family: event.target.value });
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

        
        <Datepicker></Datepicker>
        <Datepicker></Datepicker>

        
        <div className="Chart">
          {this.state.records.map((record, index) => { return <Bar key={index} data={record[this.state.family]} /> })}
        </div>
      </div>
    );
  }
}

export default Chart;