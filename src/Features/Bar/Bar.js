import React, { Component } from 'react';
import './Bar.scss';

class Bar extends Component {
  render() {
    return (
      <div className="Bar">
        <div className="Bar__time">{ this.props.time }</div>
        <div className="Bar__data">
          { this.props.data }
          <span className="Bar__block" style={{ 'width': this.props.width + '%' }}></span>
          <span className="Bar__average" style={{ 'left': this.props.average + '%' }}></span>
        </div>
      </div>
    );
  }
}

export default Bar;