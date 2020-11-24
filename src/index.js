import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import App from './App';
import { user , Warning } from './reducers';

let store = createStore(combineReducers({
  user , Warning
}))


ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider> 
  ,
  document.getElementById('root')
);


