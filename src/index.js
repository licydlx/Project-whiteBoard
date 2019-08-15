/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 14:20:00
 * @LastEditTime: 2019-08-15 18:23:00
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './components/App'
import rootReducer from './reducers'

const store = createStore(rootReducer)
const rootView = document.getElementById('root');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootView
)
