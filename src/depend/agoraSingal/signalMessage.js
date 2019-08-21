/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-21 11:01:55
 * @LastEditTime: 2019-08-21 15:05:43
 * @LastEditors: Please set LastEditors
 */
import SignalData from './SignalData';

function signalMessage() {
    return (next) => (action) => {
        console.log('will dispatch', action)
        // 中间件 广播 action

        if (SignalData.broadcast) {
            window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
                action
            }));
        } else {
            SignalData.broadcast = true;
        }

        // 调用 middleware 链中下一个 middleware 的 dispatch。
        let returnValue = next(action)
        return returnValue
    }
}

export default signalMessage