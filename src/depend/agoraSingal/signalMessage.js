/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-21 11:01:55
 * @LastEditTime: 2019-08-28 18:36:42
 * @LastEditors: Please set LastEditors
 */
import SignalData from './SignalData';

function signalMessage() {
    return (next) => (action) => {
        console.log('will dispatch', action)
        // 回放为真时 画板逻辑
        if (SignalData.playback) {

            switch (action.type) {
                // 画板 添删 
                case "BOARD_ADD_PATH":
                    canvas.addPath({ path: action.path, pathConfig: action.pathConfig })
                    break;

                case "BOARD_ADD_TEXT":
                    canvas.addText({ mouseFrom: action.mouseFrom, textContent: action.textContent })
                    break;

                case "BOARD_ADD_GRAPH":
                    canvas.addGraph({ mouseFrom: action.mouseFrom, mouseTo: action.mouseTo })
                    break;

                case "BOARD_REMOVE_CREATED":
                    canvas.removeCreated({ created: action.created })
                    break;

                // 课件通信，声网信令传输 
                case "CHILD_MESSAGE_BOX":
                    whiteBoardMessage.sendMessage("child", JSON.stringify({ type: action.data.type, handleData: action.data.handleData }));
                    break;

                // switchBar 页面跳转
                case "SWITCHBOX_GO_PREVPAGE":
                    if (action.page > 1) {
                        window.boardCache[action.page - 1] = canvas.getObjects();
                        canvas.clear();
                        let page = action.page - 1;
                        if (window.boardCache[page - 1]) {
                            for (let i = 0; i < window.boardCache[page - 1].length; i++) {
                                canvas.add(window.boardCache[page - 1][i])
                            }
                        }

                        whiteBoardMessage.sendMessage("child", JSON.stringify({ type: action.type, handleData: { page: page } }));
                    }
                    break;

                case "SWITCHBOX_GO_NEXTPAGE":
                    if (action.page < action.totalPage) {
                        window.boardCache[action.page - 1] = canvas.getObjects();
                        canvas.clear();

                        let page = action.page + 1;
                        if (window.boardCache[page - 1]) {
                            for (let i = 0; i < window.boardCache[page - 1].length; i++) {
                                canvas.add(window.boardCache[page - 1][i])
                            }
                        }
                        whiteBoardMessage.sendMessage("child", JSON.stringify({ type: action.type, handleData: { page: page } }));
                    }
                    break;

                case "SWITCHBOX_GO_HANDLE_KEYDOWN":
                    let page = parseInt(action.toPage);
                    if (action.code == "Enter" && action.totalPage + 1 > page && page > 0) {
                        window.boardCache[action.curPage - 1] = canvas.getObjects();
                        canvas.clear();
                        if (window.boardCache[page - 1]) {
                            for (let i = 0; i < window.boardCache[page - 1].length; i++) {
                                canvas.add(window.boardCache[page - 1][i])
                            }
                        }
                        whiteBoardMessage.sendMessage("child", JSON.stringify({ type: action.type, handleData: { page: page } }));
                    }
                    break;
                case "SWITCHBOX_FULL_SCREEN":
                    let data = action.fullScreen ? 'miniWhiteboard' : 'maxWhiteboard';
                    if (window !== window.parent) window.parent.postMessage(data, '*');
                    if (window.webkit) window.webkit.messageHandlers[data].postMessage(data);
                    break;
                default:
                    break;
            }

        }

        // 不是回放 才存储
        if (!SignalData.playback) {
            // localStorage 存储 actions
            gzjyDataBase.setItem(JSON.stringify(+new Date()), action).then(value => {

            }).catch((err) => {
                // 当出错时，此处代码运行
                console.log(err);
            });
        }

        // 条件：1.白板信令 2.是否广播 3.是否是回放 
        // action
        if (window.whiteBoardSignal && SignalData.broadcast && !SignalData.playback) {
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
            // 重置 actions 状态
            SignalData.broadcast = true;
            SignalData.playback = false;
        }

        // 调用 middleware 链中下一个 middleware 的 dispatch。
        let returnValue = next(action)
        return returnValue
    }
}

export default signalMessage