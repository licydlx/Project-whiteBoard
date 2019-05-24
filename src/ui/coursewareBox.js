import React from 'react';
import PDFJS from 'pdfjs-dist';
import PDFWORKER from 'pdfjs-dist/build/pdf.worker.js';

class CoursewareBox extends React.Component {
    constructor(props) {
        super(props);
        PDFJS.GlobalWorkerOptions.workerSrc = PDFWORKER;
    }

    getCanvasSize() {
        const compose = (...fns) => fns.reduceRight((acc, fn) => (...args) => fn(acc(...args)));
        const getWindowSize = () => {
            if (window.innerWidth && window.innerHeight) {
                return [window.innerWidth, window.innerHeight]
            } else if ((document.body) && (document.body.clientWidth)) {
                return [document.body.clientWidth, document.body.clientHeight]
            }
        };
        const setCanvaSize = (...arg) => arg[0][0] / arg[0][1] > 16 / 9 ? [arg[0][1] * 9 / 16, arg[0][1]] : [arg[0][0], arg[0][0] * 9 / 16];
        return compose(setCanvaSize, getWindowSize)();
    }

    showPDF(){
        const url = this.state.link;
        PDFJS.getDocument(url).then((pdf) => {
            return pdf.getPage(1);
        }).then((page) => {
            // 获取需要渲染的元素
            const canvas = document.getElementById('pdfCanvas');
            const context = canvas.getContext('2d');
            const viewport = page.getViewport(1);
            const canvasSize = this.getCanvasSize();
            const scale = canvasSize[1] / viewport.height;
            const scaledViewport = page.getViewport(scale);
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;
            const renderContext = {
                canvasContext: context, 
                viewport: scaledViewport,
            };
            page.render(renderContext);
        });
    }

    render() {
        this.state = this.props.state;

        let emptyBox = {
            display:'flex',
            height: '100%',
            backgroundColor:'#fff',
            color:'#333',
            fontSize:'30px',
            justifyContent: 'center',
            alignItems: 'center',
        }

        let courseware = {
            display:`${this.state.show ? 'block' : 'none'}`,
            padding: '0',
            border: 'none',
            width: '100%',
            height: '100%'
        };

        let pdfBox = {
            display:`${this.state.show ? 'block' : 'none'}`,
            border: 'none'
        };

        let imgBox = {
            display:`${this.state.show ? 'block' : 'none'}`,
            border: 'none'
        };

        console.log('============白板渲染参数！==========')
        console.log(this.state)

        let item;
        let newStr = this.state.link.slice(0, -3);
        if(this.state.link == ''){
            item = <div style={emptyBox}>我是白板</div>;
        } else if(newStr.includes('pdf')){
            item = <canvas id='pdfCanvas' style={pdfBox}></canvas>;
            this.showPDF();
        } else if(newStr.includes('jpg') || newStr.includes('png')) {
            item = <image style={imgBox} src={this.state.link}></image>
        } else {
            item =<iframe id="coursewareIframe" style={courseware} title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" src={this.state.link}>
                <p>Your browser does not support iframes.</p>
            </iframe>
        }
        
        return <div id="coursewareBox" className="coursewareBox" style={{ width: '100%', height: '100%', textAlign: 'center' }}>
            {item}
        </div>
    }
}

export default CoursewareBox;