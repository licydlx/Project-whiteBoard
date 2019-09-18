/* eslint-disable no-undef */
/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 14:20:00
 * @LastEditTime: 2019-09-18 11:17:30
 * @LastEditors: Please set LastEditors
 */
// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Provider } from 'react-redux';

import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';

// eslint-disable-next-line no-unused-vars
import App from './containers/App'

import rootReducer from './reducers'
import signalMessage from './depend/agoraSingal/signalMessage'

// 接入 fundebug
var fundebug = require("fundebug-javascript");
fundebug.apikey = "b160ae4b424b5f83a05db833c6f86e96b311d5f90583f7c9fe7d1f854e298ae7";

// eslint-disable-next-line no-unused-vars
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidCatch(error, info) {
    // 将component中的报错发送到Fundebug
    fundebug.notifyError(error, {
      metaData: {
        info: info
      }
    });
  }

  render() {
    return this.props.children;
  }
}

const store = createStore(
  rootReducer,
  applyMiddleware(signalMessage)
)

render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
)
