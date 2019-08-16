/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-24 10:39:17
 * @LastEditTime: 2019-08-16 15:48:42
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import './SwitchPage.css';
/**
 * @description:页面切换控制区模块 
 */
class SwitchPage extends React.Component {
    constructor(props) {
        super(props);
        this.currentPage = null;
    }
    // 切页
    towardsPageFn(e) {
        // for (const key in e) {
        //     if (e.hasOwnProperty(key)) {
        //         console.log('关键字：' + key);
        //         console.log(e[key]);
        //     }
        // }
        let key = e._dispatchInstances.key;
        let newSwithPage = Object.assign({}, this.state);
        switch (key) {
            case 'leftIcon':
                newSwithPage.currentPage--;
                break;
            case 'rightIcon':
                newSwithPage.currentPage++;
                break;
        }
        newSwithPage.leftIcon = newSwithPage.currentPage == 1 ? false : true;
        newSwithPage.rightIcon = newSwithPage.currentPage == newSwithPage.totalPage ? false : true;
        this.props.jumpPage(newSwithPage, true);
    }

    // enter跳页
    handleKeydown(e) {
        if (e.keyCode == 13) {
            let value = this.currentPage;
            let newSwithPage = Object.assign({}, this.state);

            console.log(value);

            let totalPage = parseInt(newSwithPage.totalPage);
            if (value > 0 && value - 1 < totalPage) {
                newSwithPage.currentPage = value;
                newSwithPage.leftIcon = newSwithPage.currentPage == 1 ? false : true;
                newSwithPage.rightIcon = newSwithPage.currentPage == newSwithPage.totalPage ? false : true;
                this.props.jumpPage(newSwithPage, true);
            }

        }
    }

    // 输入变化
    handleChange(e) {
        this.currentPage = e.target.value;
    }

    // 全屏
    fullScreen(e) {
        let newSwithPage = Object.assign({}, this.state);
        let data = newSwithPage.fullScreen ? 'miniWhiteboard' : 'maxWhiteboard';
        newSwithPage.fullScreen = !newSwithPage.fullScreen;
        if (window !== window.parent) window.parent.postMessage(data, '*');
        if (window.webkit) window.webkit.messageHandlers[data].postMessage(data);
        this.props.fullScreen(newSwithPage, true);
    }

    render() {
        this.state = this.props.state;
        return <div className='switchBox' style={{ display: `${this.state.show ? 'flex' : 'none'}` }}>
            <div>
                <img className={`leftIcon ${this.state.leftIcon ? '' : 'disabled'}`} key='leftIcon' onClick={this.towardsPageFn.bind(this)} src='https://res.miaocode.com/livePlatform/soundNetwork/images/10double.png' />
            </div>
            <div onClick= {this.handleKeydown.bind(this)}>
                <input className='towardsPage' type='text' maxLength='2' placeholder={this.state.currentPage} />
            </div>
            <div className='totalPage'>/{this.state.totalPage}</div>
            <div>
                <img className={`rightIcon ${this.state.rightIcon ? '' : 'disabled'}`} key='rightIcon' onClick={this.towardsPageFn.bind(this)} src='https://res.miaocode.com/livePlatform/soundNetwork/images/11double.png' />
            </div>
            <div>
                <img onClick={this.fullScreen.bind(this)} src={`https://res.miaocode.com/livePlatform/soundNetwork/images/${this.state.fullScreen ? '09' : '08'}double.png`} />
            </div>
        </div>
    }
}

export default SwitchPage;

