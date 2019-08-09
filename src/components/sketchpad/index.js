import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

import SketchpadConfig from './sketchpadConfig/index';
import UiConfig from './index.json';

const Sketchpad = ({ sketchpadActive, toggleSketchpad }) => (
  <div className='drag'>
    {sketchpadActive.map((value) => {
      return <div className='tool' key={value.name} onClick={() => toggleSketchpad(value.name)}>
        <div className={value.active ? 'active' : ''} >
          <img src={UiConfig[value.name].imgLink}></img>
        </div>
        
        <SketchpadConfig name={value.name} />
      </div>
    })}
  </div>
)

export default Sketchpad;