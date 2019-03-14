import React from 'react';
import ReactDOM from 'react-dom';
import Datepicker from './Datepicker';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Datepicker />, div);
  ReactDOM.unmountComponentAtNode(div);
});
