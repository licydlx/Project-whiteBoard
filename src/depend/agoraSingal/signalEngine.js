/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 18:02:22
 * @LastEditTime: 2019-08-20 11:35:16
 * @LastEditors: Please set LastEditors
 */
import SignalData from './SignalData';
import signalResponse from './signalResponse';

const signalEngine = (data, callback) => {
    if (!Signal) return console.log('声网信令SDK缺失！');

    if (data) {
        if (data.appId) SignalData.appId = data.appId;
        if (data.role) SignalData.role = data.role;
        if (data.uid) SignalData.account = data.uid + 'A';
        if (data.agoraSignalingToken) SignalData.token = data.agoraSignalingToken;
        if (data.channel) SignalData.channel = data.channel;
        if (data.canDraw) SignalData.canDraw = data.canDraw;
    }

    const signal = Signal(SignalData.appId);
    // 登录
    const session = signal.login(SignalData.account, SignalData.token);

    session.onLoginSuccess = (uid) => {
        // 加入频道
        const channel = session.channelJoin(SignalData.channel);

        // 加入频道成功回调
        channel.onChannelJoined = () => {
            console.log('加入频道成功！')
            whiteBoardSignal = {
                signal: signal,
                session: session,
                channel: channel
            };

            // 信令其它回调
            signalResponse(callback);
        }

        // 加入频道失败回调
        channel.onChannelJoinFailed = (ecode) => {
            console.log('加入频道失败！')
            console.log(ecode);
        }
    }

    session.onLoginFailed = (ecode) => {
        console.log('登录失败！')
        console.log(ecode);
    }
}

export default signalEngine;