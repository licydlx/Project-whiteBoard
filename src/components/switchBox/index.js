/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-16 18:05:23
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

const SwitchBox = ({ switchBox, goPrevPage, handleKeydown, goNextPage, fullscreen }) => (
  <div className='switchBox' style={{ display: `${switchBox.show ? 'flex' : 'none'}` }}>

    <div onClick={() => goPrevPage(switchBox.prevPage)}>
      <img className="leftIcon" key='leftIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/10double.png' />
    </div>

    <div onClick={() => handleKeydown()}>
      <input className='towardsPage' type='text' value={switchBox.toPage}  maxLength='2' />
    </div>

    <div className='totalPage'>/{switchBox.totalPage} </div>

    <div onClick={() => goNextPage(switchBox.nextPage)}>
      <img className="rightIcon" key='rightIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/11double.png' />
    </div>

    <div onClick={() => fullscreen()}>
      <img src="https://res.miaocode.com/livePlatform/soundNetwork/images/08double.png" />
    </div>

  </div>
)

export default SwitchBox;