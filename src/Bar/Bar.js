import React, { Component } from 'react';
import './Bar.css';

class Bar extends Component {
  render() {
    return (
      <div className="Bar" 
          style={{
            width: this.props.width + '%'
          }}>
        { this.props.time } - { this.props.data }
      </div>
    );
  }
}

export default Bar;