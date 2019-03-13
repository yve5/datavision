import React, { Component } from 'react';
import * as d3 from 'd3';
import './Chart.css';

class Chart extends Component {

  componentDidMount() {
    this.drawChart();
  }
  
  drawChart() {
    const data = this.props.data;
    const w = 1000;
    const h = 500;
    
    const svg = d3.select(this.refs.myChart)
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style("background-color", 'pink');
    
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h - 10 * d)
      .attr("width", 65)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "green");

  }
  
  render() {
    return (
      <div ref="myChart" className="Chart"></div>
      );
    }
  }
  
  export default Chart;