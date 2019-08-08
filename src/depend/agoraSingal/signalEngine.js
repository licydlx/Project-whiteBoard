import SignalData from './SignalData';

export default function (data, callback) {
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
        channel.onChannelJoined = () => {
            let engine = {
                signal: signal,
                session: session,
                channel: channel
            };
            if (callback) callback(engine)
        }
    }

    session.onLoginFailed = (ecode) => {
        console.log('登录失败！')
        console.log(ecode);
    }

    session.onLogout = (reason) => {
        console.log('用户登出！')
        console.log(reason);
    }
}