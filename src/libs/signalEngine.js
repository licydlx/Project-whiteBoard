import GLB from '../configs/GLB';

export default function (data, callback) {
    if (!Signal) {
        console.log('声网信令SDK缺失！');
        return;
    }

    if (data) {
        if (data.role) GLB.role = data.role;
        if (data.uid) GLB.account = data.uid + 'A';
        if (data.token) GLB.token = data.token;
        if (data.channel) GLB.channel = data.channel;
        if (data.canDraw) GLB.canDraw = data.canDraw;
    }

    const signal = Signal(GLB.appId);
    let session, channel;

    // 登录
    session = signal.login(GLB.account, GLB.token);
    session.onLoginSuccess = (uid) => {
        // 加入频道
        channel = session.channelJoin(GLB.channel);
        channel.onChannelJoined = () => {
            console.log('加入频道成功');
            let engine = {
                signal: signal,
                session: session,
                channel: channel
            };

            if (callback) callback(engine)
        }
    }
}