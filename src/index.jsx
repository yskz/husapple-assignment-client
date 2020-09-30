import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  /* material-uiが対応できていないため、対応されるまでstrict modeを切ります
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  */
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
