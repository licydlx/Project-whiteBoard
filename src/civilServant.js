
// 白板跳到某页
const jumpPage = function (newSwithPage, boolean) {
    let data = {
        state: newSwithPage,
        handleData: {
            method: 'swithScene',
            pars: newSwithPage.currentPage
        }
    }
    if (boolean) this.broadcastMessage('courseware', 'jumpPage', null, data);
    this.message.sendMessage('child', data, this.coursewareIframe);

    let brushCopy = JSON.stringify(this.state.brush);
    let newBrush = JSON.parse(brushCopy);
    newBrush.sketchpad.type = 'sketchpad';
    this.setState({
        switchPage: newSwithPage,
        brush: newBrush
    })
}

export {
    jumpPage
}