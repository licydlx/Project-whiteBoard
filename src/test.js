// ==========================
// 描述：白板声网信令服务
// 功能：1.
//
// ==========================


import store from "../store"
import * as actions from "../actionTypes"
import config from "../utils/config"
import AgoraService from "./AgoraService"
import { selectUser } from "../utils/state"
import consola from "consola"

const Signal = window.Signal
const log = consola.withTag("Signal-Service")

/**
 * 信令频道类，先初始化并加入信令后，再加入教室。这样在收到加入教室事件回调后，可以获取该用户对应属性
 */

class SignalService {

	constructor(e) {
		this.signal = Signal(config.appId)
		this.channel = "" //channel实例
		this.uid = ""
		this._channel = "" //channel频道号
	}

	/**
	 * 初始化变量，登录信令
	 * @param {频道-房间号} channel
	 * @param {uid} uid
	 * @param {token} token
	 */

	init(channel = config.channel, uid = "", token = "_no_need_token") {
		const user = selectUser()
		log.info("当前用户信息", user)
		this._channel = channel
		this.uid = user.uid
		this.session = this.signal.login(this.uid, token)
		this.initSessionEvent()
	}

	/**
	 * 退出信令
	 */
	logout() {
		this.channel.channelLeave()
		this.session.logout()
	}

	/**
	 * 加入频道
	 */

	async join() {
		const user = selectUser()
		let userProps = await this.userGetAttr(this.uid)
		const initialProps = {
			uid: this.uid, //用户UID
			nickName: user.userName, //用户昵称
			canChat: true, //是否禁止聊天 true:开启
			role: user.role, //用户身份，0：老师；1：助教；2：学生；3：旁听；4：隐身用户
			hasAudio: true, //是否开启音频  true：开启
			hasVideo: true, //是否开启视频   true：开启
			canDraw: true, //是否有白板操作权限  true：开启
			channelName: this._channel, //频道名称
			trophyNum: 0 //奖杯数量
		}

		if (user.role === config.role.teacher) {
			store.dispatch({
				type: actions.SET_VIDEO_TEACHER,
				payload: initialProps
			})
        }
        
		if (user.role === config.role.student) {
			store.dispatch({
				type: actions.SET_VIDEO_SELF,
				payload: {
					uid: this.uid,
					props: userProps || initialProps
				}
			})
        }
        
		if (!userProps) {
			log.info(`用户[${this.uid}]没有属性，准备设置默认属性`)
			this.userSetAttr(initialProps)
        }
        
		this.channel = this.session.channelJoin(this._channel)
		this.initChannelEvent()
	}

	/**
	 * 初始化channel回调相关事件
	 */
	initChannelEvent() {
		this.channel.onChannelJoined = () => {
			log.success("加入信令频道成功")
			this.queryUserList()
			AgoraService.init(this.uid)
		}

		this.channel.onChannelJoinFailed = err => {
			log.error("加入信令频道失败", err)
		}

		this.channel.onMessageChannelReceive = async (account, uid, msg) => {

			log.info("收到信令频道广播", account, uid, msg)
			const { sigType, sigUid, sigValue } = JSON.parse(msg)
			log.info(sigType, sigUid, sigValue)
			const userProps = await this.userGetAttr(this.uid)
			if (sigType === "showAudio" && this.uid === sigUid) {
				if (sigValue.value) {
					AgoraService.localStream.unmuteAudio()
				} else {
					AgoraService.localStream.muteAudio()
				}
				this.userSetAttr({
					...userProps,
					hasAudio: sigValue.value
				})
            }
            
			if (sigType === "showVideo" && this.uid === sigUid) {
				if (sigValue.value) {
					AgoraService.localStream.unmuteVideo()
				} else {
					AgoraService.localStream.muteVideo()
				}
				this.userSetAttr({
					...userProps,
					hasVideo: sigValue.value
				})
			}
			if (sigType === "msgPub") {
				store.dispatch({
					type: actions.SET_MESSAGE_LIST,
					payload: sigValue
				})
			}
		}

		this.channel.onChannelAttrUpdated = (name, data) => {
			log.info("信令频道属性更新", name, data)
			if (name === "classBegin") {
				store.dispatch({
					type: actions.SET_CHANNEL_PROPS,
					payload: {
						classBeginTime: data.time,
						isClassBegin: data.value
					}
				})
			}
		}

		this.channel.onChannelUserLeaved = res => {
			log.warn("有用户离开-onChannelUserLeaved", res)
		}
	}

	/**
	 * 初始化session相关回调事件
	 */
	initSessionEvent() {

		this.session.onLoginSuccess = () => {
			log.success("登录会话成功-onLoginSuccess")
			this.join()
        }
        
		this.session.onLoginFailed = err => {
			log.error("登录会话失败-onLoginFailed", err)
        }
        
		this.session.onMessageInstanceReceive = (account, uid, msg) => {
			log.info("onMessageInstanceReceive", account, uid, msg)
        }
        
		this.session.onLogout = reason => {
			log.warn("用户退出信令系统", reason)
			this.queryUserList()
        }
        
	}

	/**
	 * 广播消息
	 * @param {object} msg
	 */
	broadcastMessage(msg) {
		this.channel.messageChannelSend(JSON.stringify(msg))
	}

	// 设置频道属性
	channelSetAttr(name, value, cb) {
		this.channel.channelSetAttr(name, value, cb)
	}

	// 设置用户属性
	userSetAttr(value) {
		this.session.invoke(
			"io.agora.signal.user_set_attr",
			{
				name: this.uid,
				value: JSON.stringify(value)
			},
			res => {
				log.success(`设置用户[${this.uid}]的属性成功`, value)
			}
		)
	}

	/**
	 * 获取用户属性, name和account相同
	 * @param {用户uid} account
	 */
	userGetAttr(account) {
		return new Promise((resolve, reject) => {
			try {
				this.session.invoke(
					"io.agora.signal.user_get_attr",
					{
						account,
						name: account
					},
					(err, val) => {
						log.info(`获取用户[${account}]的属性`, val)
						if (!err) {
							if (val.value) {
								resolve(JSON.parse(val.value))
							} else {
								resolve(val.value)
							}
						}
						resolve(false)
					}
				)
			} catch (err) {
				resolve(false)
			}
		})
	}

	/**
	 * 查询用户列表
	 */
	queryUserList() {
		this.session.invoke(
			"io.agora.signal.channel_query_userlist_all",
			{
				name: this._channel
			},
			(res, list) => {
				log.info("获取用户列表", res, list)
			}
		)
	}

	/**
	 * 清除频道属性
	 */
	channelClear() {
		this.session.invoke("io.agora.signal.channel_clear_attr", {
			channel: this._channel
		})
	}
}

export default new SignalService()

