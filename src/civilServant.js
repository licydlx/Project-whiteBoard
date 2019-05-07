// 白板跳到某页
const jumpPage = function (newSwithPage, boolean) {
    // 翻页时清空画板
    this.sketchpad.removeAll();
    let data = {
        state: newSwithPage,
        handleData: {
            method: 'swithScene',
            pars: newSwithPage.currentPage
        }
    }
    this.message.sendMessage('child', data, this.coursewareIframe);
    this.setState({
        switchPage: newSwithPage
    })
    if (boolean) this.broadcastMessage('courseware', 'jumpPage', null, data);
}

export {
    jumpPage
}