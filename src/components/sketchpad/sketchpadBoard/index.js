/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-02 15:32:43
 * @LastEditTime: 2019-08-12 19:00:10
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import sketchpadEngine from '../../../depend/sketchpadEngine/sketchpadEngine';

class sketchpadBoard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        let sketchpadBoard = {
            width: '1000px',
            height: '800px'
        }
        return <div style={sketchpadBoard}>
            <canvas id="sketchpadBoard" style={sketchpadBoard}>请使用支持HTML5的浏览器</canvas>
        </div>
    }
}

export default sketchpadBoard;