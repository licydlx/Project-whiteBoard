import GLB from '../configs/GLB';

export default function (data, callback) {
    if (!Signal) return console.log('声网信令SDK缺失！');

    if (data) {
        if (data.appId) GLB.appId = data.appId;
        if (data.role) GLB.role = data.role;
        if (data.uid) GLB.account = data.uid + 'A';
        if (data.agoraSignalingToken) GLB.token = data.agoraSignalingToken;
        if (data.channel) GLB.channel = data.channel;
        if (data.canDraw) GLB.canDraw = data.canDraw;
    }

    const signal = Signal(GLB.appId);
    // 登录
    const session = signal.login(GLB.account, GLB.token);
    session.onLoginSuccess = (uid) => {
        // 加入频道
        const channel = session.channelJoin(GLB.channel);
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
}