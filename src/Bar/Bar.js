import React, { Component } from 'react';
import './Bar.css';

class Bar extends Component {
  render() {
    return (
      <div className="Bar">
        { this.props.data }
      </div>
    );
  }
}

export default Bar;