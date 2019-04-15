import React from 'react';

class SketchpadBox extends React.Component {
    constructor() {
        super();
    }

    render() {
        let style = {
            display: `${this.props.state ? 'block' : 'none'}`
        };

        return <div id="sketchpadBox" className="sketchpadBox" style={style}>
            <canvas id="sketchpad" width="960" height="540">请使用支持HTML5的浏览器</canvas>
        </div>
    }
}

export default SketchpadBox;