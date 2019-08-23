/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-22 21:36:45
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

class Courseware extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 星球封面
    // let scene = document.getElementById('scene');
    // let parallax = new Parallax(scene);

    // https://dribbble.com/shots/3084995-Fluent-Panda
    const body = document.querySelector('#body'),
      head = document.querySelector('#head'),
      mouth = document.querySelector('#mouth'),
      eye = document.querySelector('#eyeTop'),
      ear = document.querySelector('#ear'),
      zzz = document.querySelectorAll('#sleep polyline');
      if(!body) return;
      
    TweenMax.set('svg', { visibility: 'visible' });
    TweenMax.set(zzz, { opacity: 0 });
    TweenMax.set(ear, { rotation: 3, transformOrigin: "bottom center" })

    const breathe = () => {
      const tl = new TimelineMax({});
      tl.to(body, 1.28, { scaleY: 1.2, transformOrigin: "bottom center", ease: Power1.easeOut }, 'in')
        .to(body, 1.12, { scaleY: 1, ease: Linear.easeNone }, 'out')
        .to(head, 1.28, { scaleY: 1.045, transformOrigin: "bottom center", ease: Power1.easeOut }, 'in')
        .to(head, 1.12, { scaleY: 1, ease: Linear.easeNone }, 'out')
        .to(ear, 1, { rotation: 7, transformOrigin: "bottom center" }, 'in')
        // Eyes 
        .to(eye, 0.8, { y: 2 }, 'in+=0.32')
        .to(eye, 0.8, { y: 0 }, 'in+=1.28')
      return tl;
    }

    const earTwitch = () => {
      const tl = new TimelineMax({});
      // Ear twitch
      tl.to(ear, 0.16, { y: 1.5, x: -2, ease: Power1.easeIn, transformOrigin: "bottom center", rotation: 15 })
        .to(ear, 0.16, { y: 0, x: 0, ease: Power1.easeInOut, transformOrigin: "bottom center", rotation: 3 })
      return tl;
    }

    const earTwitch2 = () => {
      const tl = new TimelineMax({});
      // Ear twitch2 
      tl.to(ear, 0.12, { y: -0.5, transformOrigin: "bottom center", rotation: 5 })
        .to(ear, 0.12, { y: 0.5, transformOrigin: "bottom center", rotation: 10 })
        .to(ear, 0.12, { y: -0.5, transformOrigin: "bottom center", rotation: 5 })
        .to(ear, 0.12, { y: 0.5, transformOrigin: "bottom center", rotation: 10 })
        .to(ear, 0.24, { y: 0, transformOrigin: "bottom center", rotation: 7 })
      return tl;
    }

    const zzzText = () => {
      const tl = new TimelineMax({});
      tl.staggerFromTo(zzz, 0.24, { opacity: 0 }, { opacity: 1 }, 0.16)
        .staggerFromTo(zzz, 0.24, { opacity: 1, immediateRender: false }, { opacity: 0 }, 0.16)
      return tl;
    }

    const mouthMove = () => {
      const tl = new TimelineMax({});
      tl.to(mouth, 0.72, { drawSVG: '0% 65%', y: -0.5, transformOrigin: "top center" })
        .to(mouth, 0.72, { drawSVG: '0% 100%', y: 0, transformOrigin: "top center", ease: Power1.easeOut })
      return tl;
    }

    const masterTl = new TimelineMax({ repeat: -1 });

    masterTl
      .add(breathe(), 'start')
      .add(zzzText(), 'start+=1.60')
      .add(earTwitch2(), 'start+=2.4')
      .add(breathe(), 'start+=3.12')
      .add(zzzText(), 'start+=4.72')
      .add(mouthMove(), 'start+=5.82')
      .add(breathe(), 'start+=6.12')
      .add(zzzText(), 'start+=7.72')
      .add(earTwitch(), 'start+=7.24')
    //GSDevTools.create();
  }

  pretab(courseware) {
    switch (courseware.name) {
      case "html5":
        return <iframe id="coursewareIframe" className="coursewareIframe" title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" src={courseware.link}>
          <p>Your browser does not support iframes.</p>
        </iframe>

      default:
        // 默认原始封面
        // return <div>
        //  <img src="https://res.miaocode.com/livePlatform/soundNetwork/images/logo.png" />
        // </div>

        // 星球封面
        // return <div className="default">
        //   <ul id="scene">
        //     <li className="layer" data-depth="4">
        //       <img style={{ top: "450px" }} src="https://i.postimg.cc/7htdLzBd/shooting-star.png" />
        //     </li>
        //     <li className="layer1" data-depth="-1">
        //       <img style={{ top: "20%", left: "20%" }} src="https://i.postimg.cc/ZKDVv4Tk/planet.png" />
        //     </li>
        //     <li className="layer" data-depth="1">
        //       <img src="https://i.postimg.cc/brwj6pD0/planet-earth.png" />
        //     </li>
        //     <li className="layer" data-depth="0.5">
        //       <img style={{ top: "60%", left: "32%" }} src="https://i.postimg.cc/7Lk10c7n/planets.png" />
        //     </li>
        //   </ul>
        // </div>

        // 熊猫封面
        return <div className="default"> 
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 600" xmlSpace="preserve">
            <filter id="shadowBlur" x="0%" y="0%" width="275%" height="150%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
            </filter>    
            <g id="shadow" opacity="0.4" filter="url(#shadowBlur)">
              <ellipse fill="#54AEA7" cx="394.676" cy="343.597" rx="65" ry="8"/>
            </g>
            <g id="body">
              <path id="frontPawR" fill="#303030" d="M369,338.5c0,3.59-6.716,6.5-15,6.5c-11,0-16-3.41-16-7s1-6,16-6C362.284,332,369,334.91,369,338.5z"/>
              <path fill="#FFFFFF" d="M417.562,346l13.759-0.251c7.796-1.072,14.679-6.179,14.679-14.11v0c0-13.608-11.473-24.64-25.625-24.64H394v16.344C394,335.857,394,346,417.562,346z"/>
              <path fill="#EBEBEB" d="M410.441,332.708c0,0,10.042,7.749,17.507,0.97c7.465-6.779,15.351-13.06,15.351-13.06l0.549,1.078
                                      c1.604,3.148,2.363,6.659,2.202,10.189L446,333c0,0-3.22,7.407-9.409,11.173c-2.231,1.357-6.845,1.88-9.024,1.921
                                      c-12.467,0.236-17.187-0.479-17.187-0.479l-3.517-7.829L410.441,332.708z"/>
              <path fill="#303030" d="M445.981,332.269c0,0-0.629,1.396-1.693,2.21c-2.136,1.633-4.56,1.549-4.56,1.549l4.319,1.844
                                      c0.776,0.646,1.953,0.095,1.953-0.915L445.981,332.269z"/>
              <path id="backPaw" fill="#303030" d="M452,343c0,3-5.149,3-11.5,3c-5.268,0-8.23,0-9.823-0.512c-1.28-0.411-1.677-1.152-1.677-2.488c0-4,7-7,11.5-7C446.851,336,452,340.239,452,343z"/>
            </g>
            <g id="head">
              <path fill="#303030" d="M343,316c0,7.732,5.791,14,8,14s0-6.268,0-14s-0.791-14-3-14S343,308.268,343,316z"/>
              <path fill="#FFFFFF" d="M383.9,279.5h-4.3c-18.28,0-33.1,14.819-33.1,33.1v4.958c0,1.512,0.124,2.995,0.355,4.442h-0.14
                                      c-3.882,0-4.939,2.615-4.819,6.698c0.217,7.382,1.104,16.802,32.615,16.802h9.589c18.17,0,32.9-14.73,32.9-32.9v0
                                      C417,294.319,402.181,279.5,383.9,279.5z"/>
              <path fill="#EBEBEB" d="M381.186,279.5h2.896c18.281,0,33.1,14.819,33.1,33.1v0c0,11.356-5.754,21.369-14.505,27.281
                                      C402.677,339.881,411.009,298.46,381.186,279.5z"/>
              <g id="snout">
                <path fill="#231D1D" d="M348.974,328.117c-0.546,0.459-1.402,0.459-1.948,0l-1.603-1.348l0,0
                                        c-0.928-0.781-0.305-2.167,0.974-2.167H348h1.603c1.279,0,1.902,1.386,0.974,2.167l0,0L348.974,328.117z"/>
                <ellipse fill="#231D1D" cx="348.003" cy="325.855" rx="3.018" ry="1.717"/>
              </g>
              <path id="mouth" fill="none" stroke="#231D1D" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" d="M348,327v2.036c0,0,0,3.016,2.587,3.016c1.807,0,2.333-1.988,2.333-1.988"/>
              <g id="ear">
                <path fill="#231D1D" d="M416.259,314.576L416.259,314.576c6.679-6.187,7.078-16.616,0.891-23.295l-3.126-3.374
                                        c-6.173-6.664-16.579-7.062-23.242-0.889l0,0c-3.892,3.605-4.124,9.683-0.519,13.575l12.475,13.467
                                        C406.328,317.936,412.382,318.167,416.259,314.576z"/>
                <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 -95.1679 373.1731)" fill="#3E3E3E" cx="402.876" cy="301.464" rx="11.926" ry="18.708"/>
                <path fill="#3E3E3E" d="M416.43,314.417L416.43,314.417c4.294-3.977,4.55-10.682,0.573-14.976l-11.127-12.012
                                        c-3.963-4.278-10.645-4.534-14.923-0.571l-0.916,0.849c-3.48,3.224-3.688,8.659-0.464,12.14l13.006,14.04
                                        C406.257,317.859,412.459,318.096,416.43,314.417z"/>
              </g>
              <g>
                <path fill="#EBEBEB" d="M355.5,317.014c0.084,2.508,0.581,15.98,16.458,18.427c3.678,0.567,7.472,0.262,10.927-1.118
                                        c0.766-0.306,1.53-0.667,2.234-1.091c5.302-3.195,4.881-13.996,4.881-13.996c0-12.265-7.66-22.207-23.902-22.207
                                        C356.756,297.027,355.5,307,355.5,317.014z"/>
                <path fill="#302F2E" d="M355.5,315.5c0,9.665,3,16,16,16c12,0,14.5-4.335,14.5-14s-6.5-18-20.25-17.5
                                        C356.781,300.326,355.5,305.835,355.5,315.5z"/>
              </g>
              <g id="EyeGroup">
                <ellipse id="eyeBot" fill="#FFFFFF" cx="365.752" cy="320.027" rx="5.164" ry="5.053"/>
                <circle id="eyeTop" fill="#302F2E" cx="365.752" cy="320.027" r="5.5"/>
              </g>
            </g>
            <path id="frontPawL" fill="#303030" d="M417,340.5c0,4.142-5,5.5-12.5,5.5c-6.904,0-12.5,0-12.5-5.5c0-4.142,5.596-7.5,12.5-7.5S417,336.358,417,340.5z"/>
            <g id="sleep">
              <polyline fill="none" stroke="#303030" strokeWidth="0.725" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="370.913,265.143 374.848,265.143 370.662,269.56 375.408,269.56"/>
              <polyline fill="none" stroke="#303030" strokeWidth="0.725" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="377.959,261.272 381.894,261.272 377.708,265.688 382.454,265.688"/>
              <polyline fill="none" stroke="#303030" strokeWidth="0.725" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="385.469,256.856 389.404,256.856 385.218,261.272 389.964,261.272"/>
            </g>
          </svg>
      </div >
    }
  }

  render() {
    return <div id="courseware" className="courseware">
      {this.pretab(this.props.courseware)}
    </div >
  }
}

// const pretab = (courseware) => {
//   console.log(courseware)
//   switch (courseware.name) {
//     case "html5":
//       return <iframe id="coursewareIframe" className="coursewareIframe" title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" src={courseware.link}>
//         <p>Your browser does not support iframes.</p>
//       </iframe>

//     default:
//       // return <div>
//       //           {/* <img src="https://res.miaocode.com/livePlatform/soundNetwork/images/logo.png" /> */}
//       //           <canvas id="canvasDefault"></canvas>
//       //        </div>
//       return <div class="default">
//         <ul id="scene">
//           <li className="layer" data-depth="4"><img style="top:450px; " src="https://i.postimg.cc/7htdLzBd/shooting-star.png" /></li>
//           <li className="layer1" data-depth="-1"><img style="top:  20%; left:20%" src="https://i.postimg.cc/ZKDVv4Tk/planet.png" /></li>
//           <li className="layer" data-depth="1"><img src="https://i.postimg.cc/brwj6pD0/planet-earth.png" /></li>
//           <li className="layer" data-depth="0.5"><img style="top:60%; left:32%" src="https://i.postimg.cc/7Lk10c7n/planets.png" />
//           </li>
//         </ul>
//       </div>
//   }

//   var scene = document.getElementById('scene');
//   var parallax = new Parallax(scene);
// }

// const Courseware = ({ courseware }) => (
//   <div id="courseware" className="courseware">
//     {pretab(courseware)}
//   </div >
// )

export default Courseware;