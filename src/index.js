/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 14:20:00
 * @LastEditTime: 2019-08-20 18:05:53
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import App from './components/App'
import rootReducer from './reducers'
// import createSagaMiddleware from 'redux-saga'

import signalCallback from './depend/agoraSingal/signalCallback'

// create the saga middleware
// const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  applyMiddleware(signalCallback)
)

// sagaMiddleware.run(signalCallback)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
