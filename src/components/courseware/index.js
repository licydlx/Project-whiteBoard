/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-19 16:33:07
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

const pretab = (courseware) => {
  console.log(courseware)
  switch (courseware.name) {
    case "html5":
      return <iframe id="coursewareIframe" className="coursewareIframe" title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" src={courseware.link}>
        <p>Your browser does not support iframes.</p>
      </iframe>

    default:
      return <div className="default">我是默认白板课件区</div>
  }
}

const Courseware = ({courseware}) => (
  <div id="courseware" className="courseware">
    {pretab(courseware)}
  </div >
)

export default Courseware;