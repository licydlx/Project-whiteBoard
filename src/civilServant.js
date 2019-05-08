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
    }, () => {
        // 时间戳
        // 设置某个数据仓库 key 的值不会影响到另一个数据仓库
        let key = + new Date();
        let pageNum = newSwithPage.currentPage;
        // 不同于 localStorage，你可以存储非字符串类型
        this.localforage.setItem(key + 'page' + pageNum , {switchPage:newSwithPage}).then(function (value) {
            
        }).catch(function (err) {
            console.log(err);
        });
    })
    if (boolean) this.broadcastMessage('courseware', 'jumpPage', null, data);
}

export {
    jumpPage
}