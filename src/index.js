/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 14:20:00
 * @LastEditTime: 2019-08-14 16:27:11
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './components/App'
import rootReducer from './reducers'
import visualArea from './untils/visualArea'

const store = createStore(rootReducer)

let rootView = document.getElementById('root');
let { windowWidth, windowHeight } = { ...visualArea() }
rootView.style.width = windowWidth + 'px';
rootView.style.height = windowHeight + 'px';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootView
)
