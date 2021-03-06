import React from 'react';

class SketchpadBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        this.state = this.props.state;
        
        let style = {
            display: `${this.state.sketchpad.type !== 'sketchpad' ? 'block' : 'none'}`
        };

        let sketchpad = {
            width: '100%',
            height: '100%'
        }

        return <div id="sketchpadBox" className="sketchpadBox" style={style}>
            <canvas id="sketchpad" style={sketchpad}>请使用支持HTML5的浏览器</canvas>
        </div>
    }
}

export default SketchpadBox;