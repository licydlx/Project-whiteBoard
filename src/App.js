import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super();
    this.page = {
      last: {
        type: 'agoraAdyLastPage',
        pageNum: 1
      },
      next: {
        type: 'agoraAdyNextPage',
        pageNum: 2
      }
    };

    // var canvas =new fabric.Canvas('test');
    // var rect = new fabric.Rect({
    //   left:100,//距离画布左侧的距离，单位是像素
    //   top:100,//距离画布上边的距离
    //   fill:'red',//填充的颜色
    //   width:30,//方形的宽度
    //   height:30//方形的高度
    // });
    // canvas.add(rect);
 
  }

  componentDidMount() {
    // 监听子级message
    window.addEventListener("message", monitorChildMessage, false);

    function monitorChildMessage(event) {
      console.log('监听子级message');
      console.log(event);
    }

    // 获取id为otherPage的iframe窗口对象        
    var coursewareIframe = document.getElementById("coursewareIframe").contentWindow;

    window.jsAPI = {};

    window.jsAPI.pageControl = function (data) {
      console.log('调用方法成功！');
      console.log(data);
      coursewareIframe.postMessage(data, '*');
    };
  }

  componentWillUnmount() {

  }

  handleClick(data, e) {
    e.preventDefault();
    window.jsAPI.pageControl(data);
  }

  render() {
    return (
      <div id="whiteboardBox">
        <div id="coursewareBox" className="App">
          <iframe id="coursewareIframe" title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" width="960px" height="540px" className={"width: 100%; height: 100%; border: none; padding: 0px; margin: 0px;"} src="https://www.kunqu.tech/page1/">
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>

        <div id="sketchpadBox">
          <button onClick={this.handleClick.bind(this, this.page.last)}>上一页</button>
          <button onClick={this.handleClick.bind(this, this.page.next)}>下一页</button>

          <canvas id="test" width="1080" height="650">请使用支持HTML5的浏览器</canvas>
        </div>
      </div>
    );
  }
}

export default App;
