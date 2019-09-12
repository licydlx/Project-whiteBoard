/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 14:20:00
 * @LastEditTime: 2019-09-12 09:27:13
 * @LastEditors: Please set LastEditors
 */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
// eslint-disable-next-line no-unused-vars
import { Provider } from 'react-redux';

// eslint-disable-next-line no-unused-vars
import App from './containers/App'
import rootReducer from './reducers'

import signalMessage from './depend/agoraSingal/signalMessage'

const store = createStore(
  rootReducer,
  applyMiddleware(signalMessage)
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
