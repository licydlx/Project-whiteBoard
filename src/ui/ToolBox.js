import React from 'react';

class ToolBox extends React.Component {
    constructor() {
        super();

        this.tools = [
            {
                'data-type': 'pen',
                'className': 'icon-pen-select',
                'data-default': 'icon-pen-black',
                'state':false
            },
            {
                'data-type': 'arrow',
                'className': 'icon-arrow-black',
                'data-default': 'icon-arrow-black',
                'state':false
            },
            {
                'data-type': 'line',
                'className': 'icon-line-black',
                'data-default': 'icon-line-black',
                'state':false
            },
            {
                'data-type': 'ellipse',
                'className': 'icon-ellipse-black',
                'data-default': 'icon-ellipse-black',
                'state':false
            }, {
                'data-type': 'rectangle',
                'className': 'icon-rectangle-black',
                'data-default': 'icon-rectangle-black',
                'state':false
            },
            {
                'data-type': 'text',
                'className': 'icon-text-black',
                'data-default': 'icon-text-black',
                'state':false
            }, {
                'data-type': 'remove',
                'className': 'icon-remove-black',
                'data-default': 'icon-remove-black',
                'state':false
            }
        ]
    }
    render() {
        let sub = this.props.state;
        this.tools[sub]['state'] = true;
        const items = this.tools.map((value,index) =>
            <li data-type={value['data-type']} key={index} className={value['state'] ? 'active' : ''} onClick={this.handleClick}>
                <i className={`icon-tools ${value['className']}`} data-default={`icon-tools ${value['data-default']}`}></i>
            </li>
        );
        return <ul id="tools" className="tools">{items}</ul>
    }
}

export default ToolBox;