import React from 'react';

class CoursewareBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
    }
    render() {

        let style = {
            display: `${this.state.show ? 'block' : 'none'}`,
            padding: '0',
            border: 'none',
            width: '100%',
            height: '100%'
        };
        // "https://www.kunqu.tech/page1/"
        return <div id="coursewareBox" className="coursewareBox" style={{ width: '100%', height: '100%' }}>
            <iframe id="coursewareIframe" style={style} title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" src={this.state.link}>
                <p>Your browser does not support iframes.</p>
            </iframe>
        </div>
    }
}

export default CoursewareBox;