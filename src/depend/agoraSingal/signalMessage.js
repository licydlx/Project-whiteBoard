/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-21 11:01:55
 * @LastEditTime: 2019-08-26 13:50:20
 * @LastEditors: Please set LastEditors
 */
import SignalData from './SignalData';

function signalMessage() {
    return (next) => (action) => {
        // console.log('will dispatch', action)

        // 中间件 广播 action
        if (SignalData.broadcast && window.whiteBoardSignal) {
            switch (action.type) {
                case "SWITCHBOX_SET_TOTAL_PAGE":
                case "SWITCHBOX_SHOW_SWITCHBAR":
                case "SWITCHBOX_FULL_SCREEN":
                case "BOARD_SHOW_TOOLBAR":
                case "BOARD_REDUCE_TOOLBAR":
                    break;
                default:
                    window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
                        action
                    }));
                    break;
            }
        } else {
            SignalData.broadcast = true;
        }

        // 调用 middleware 链中下一个 middleware 的 dispatch。
        let returnValue = next(action)
        return returnValue
    }
}

export default signalMessage