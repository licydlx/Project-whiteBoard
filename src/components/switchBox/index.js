/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-15 17:41:29
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

const SwitchBox = ({ switchBox, prevPage, handleKeydown, nextPage, fullscreen }) => (
  <div className='switchBox' style={{ display: `${this.state.show ? 'flex' : 'none'}` }}>
    <div onClick={() => prevPage()}>
      <img className="leftIcon" key='leftIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/10double.png' />
    </div>
    <div onClick={() => handleKeydown()}>
      <input className='towardsPage' type='text' maxLength='2' />
    </div>
    <div className='totalPage'>/12</div>
    <div onClick={() => nextPage()}>
      <img className="rightIcon" key='rightIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/11double.png' />
    </div>
    <div onClick={() => fullscreen()}>
      <img src="https://res.miaocode.com/livePlatform/soundNetwork/images/08double.png" />
    </div>
  </div>
)

export default SwitchBox;