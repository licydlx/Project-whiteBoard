import React from 'react';

class CoursewareBox extends React.Component {
    constructor() {
        super();
    }

    render() {
        let style = {
            display: `${this.props.state.value ? 'block' : 'none'}`
        };
        // "https://www.kunqu.tech/page1/"
        return <div id="coursewareBox" className="coursewareBox" >
            <iframe id="coursewareIframe" style={style} title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" width="960px" height="540px" className={"width: 100%; height: 100%; border: none; padding: 0px; margin: 0px;"} src={this.props.state.link}>
                <p>Your browser does not support iframes.</p>
            </iframe>
        </div>
    }
}

export default CoursewareBox;