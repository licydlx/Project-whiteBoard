/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 14:20:00
 * @LastEditTime: 2019-08-21 11:01:44
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

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
