import React from 'react';
import ReactDOM from 'react-dom';
import Datepicker from './Datepicker';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const date = new Date().toString();
  ReactDOM.render(<Datepicker time={date} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
