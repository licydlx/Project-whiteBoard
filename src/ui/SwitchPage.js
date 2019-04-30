import React from 'react';
import './SwitchPage.css';
/**
 * @description:页面切换控制区模块 
 * @param 
 * @return: 
 */

class SwitchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            switchPage: props.switchPage,
            position: {
                right: '200px',
                bottom: '50px'
            },
            inputValue: null,
            fullScreen: false,
        }

        this.offsetX = null;
        this.offsetY = null;
        // == 被我们拖的元素（按住鼠标）
        // ondragstart - 用户开始拖动元素时触发
        // ondrag - 元素正在拖动时触发
        // ondragend - 用户完成元素拖动后触发
        // == 释放拖拽元素时触发的事件（松开鼠标）
        // ondragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件
        // ondragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
        // ondragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件
        // ondrop - 在一个拖动过程中，释放鼠标键时触发此事件
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
    }

    handleDragStart(e) {
        this.offsetX = e.pageX;
        this.offsetY = e.pageY;
    }

    handleDrag(e) {
        // 阻止默认动作
        e.preventDefault();
    }

    handleDragEnd(e) {
        e.preventDefault();
        let x = e.pageX;
        let y = e.pageY;
        x -= this.offsetX;
        y -= this.offsetY;
        let ox = parseInt(this.state.position.right);
        let oy = parseInt(this.state.position.bottom);
        this.setState({
            position: {
                right: -x + ox + 'px',
                bottom: -y + oy + 'px'
            }
        });
    }

    handleDragEnter(e) {
        e.preventDefault();
    }

    handleDragOver(e) {
        // 阻止默认动作以启用drop
        e.preventDefault();
    }

    handleDragLeave(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
    }

    towardsPageFn(e) {
        // for (const key in e) {
        //     if (e.hasOwnProperty(key)) {
        //         console.log('关键字：' + key);
        //         console.log(e[key]);
        //     }
        // }
        let key = e._dispatchInstances.key;
        let totalPage = parseInt(this.state.switchPage.totalPage);
        let nextPage;
        let leftIcon = true;
        let rightIcon = true;

        switch (key) {
            case 'leftIcon':
                nextPage = parseInt(this.state.switchPage.towardsPage) - 1;
                break;

            case 'rightIcon':
                nextPage = parseInt(this.state.switchPage.towardsPage) + 1;
                break;
        }

        if (nextPage == 1) leftIcon = false;
        if (nextPage == totalPage) rightIcon = false;

        let state = {
            towardsPage: nextPage,
            leftIcon: leftIcon,
            rightIcon: rightIcon,
            totalPage: totalPage,
        }
        this.props.jumpPage(state, true);
    }

    handleKeydown(e) {
        // for (const key in e) {
        //     if (e.hasOwnProperty(key)) {
        //         console.log('关键字：' + key);
        //         console.log(e[key]);
        //     }
        // }

        if (e.keyCode == 13) {
            let value = this.state.inputValue;
            let totalPage = parseInt(this.state.switchPage.totalPage);

            if (value > 0 && value - 1 < totalPage) {
                let leftIcon = true;
                let rightIcon = true;
                if (value == 1) leftIcon = false;
                if (value == totalPage) rightIcon = false;

                let state = {
                    towardsPage: value,
                    leftIcon: leftIcon,
                    rightIcon: rightIcon,
                    totalPage: totalPage,
                }
                this.props.jumpPage(state, true);
                // this.state.inputValue= null;
            }
        }
    }

    handleChange(e) {
        this.setState({
            inputValue: e.target.value
        })
    }

    fullScreen(e) {
        let status = this.state.fullScreen;
        let data = status ? 'miniWhiteboard' : 'maxWhiteboard';
        if (window !== window.parent) window.parent.postMessage(data, '*');
        if (window.webkit) window.webkit.messageHandlers[data].postMessage(data);
        this.setState({
            fullScreen: !status
        })
    }

    render() {
        if (this.props) this.state.switchPage = this.props.switchPage;
        let state = this.state.switchPage;
        return <div className='switchBox' style={{ display: `${this.props.showSwitchPage ? 'flex' : 'none'}`, right: `${this.state.position.right}`, bottom: `${this.state.position.bottom}` }} draggable="true" onDrag={this.handleDrag} onDragStart={this.handleDragStart} onDragOver={this.handleDragOver} onDragEnd={this.handleDragEnd}>
            <div>
                <img className={`leftIcon ${state.leftIcon ? '' : 'disabled'}`} key='leftIcon' onClick={this.towardsPageFn.bind(this)} src='https://res.miaocode.com/livePlatform/soundNetwork/images/10double.png' />
            </div>
            <div>
                {/* onKeyDown={(e)=>{this.handleKeydown(e);}} onChange={this.handleChange.bind(this)} */}
                <input className='towardsPage' type='text' maxLength='2' placeholder={state.towardsPage} />
            </div>
            <div className='totalPage'>/{state.totalPage}</div>
            <div>
                <img className={`rightIcon ${state.rightIcon ? '' : 'disabled'}`} key='rightIcon' onClick={this.towardsPageFn.bind(this)} src='https://res.miaocode.com/livePlatform/soundNetwork/images/11double.png' />
            </div>
            <div>
                <img onClick={this.fullScreen.bind(this)} src={`https://res.miaocode.com/livePlatform/soundNetwork/images/${this.state.fullScreen ? '09' : '08'}double.png`} />
            </div>
        </div>
    }
}

export default SwitchPage;

