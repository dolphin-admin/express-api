import { Socket } from 'socket.io'

import { Event, Namespace } from '@/decorators'
import { getCurrentTime } from '@/shared'

import { UserInfo, UserInfoWithMessage } from './types'

@Namespace('/demo')
export class DemoController {
  // 监听消息
  @Event('message')
  handleMessage(socket: Socket, data: UserInfoWithMessage) {
    const sendMessage = {
      zh_CN: `[ ID: ${data.id}, 用户名：${data.username} ] 发送了 [ ${data.message} ]`,
      en_US: `[ ID: ${data.id}, Username: ${data.username} ] has sent [ ${data.message} ]`
    }
    console.log('-----------------------------------------------------------')
    console.log('Socket: /demo')
    console.log('Event: message')
    console.log(sendMessage.zh_CN)
    console.log(getCurrentTime())
    console.log('-----------------------------------------------------------')
    // 广播消息
    socket.broadcast.emit('message', sendMessage)
  }

  // 监听进入
  @Event('join')
  handleJoin(socket: Socket, data: UserInfo) {
    const joinMessage = {
      zh_CN: `[ ID: ${data.id}, 用户名：${data.username} ] 建立了连接`,
      en_US: `[ ID: ${data.id}, Username: ${data.username} ] has joined`
    }
    console.log('-----------------------------------------------------------')
    console.log('Socket: /demo')
    console.log('Event: join')
    console.log(joinMessage.zh_CN)
    console.log(getCurrentTime())
    console.log('-----------------------------------------------------------')
    // 广播用户进入的信息
    socket.broadcast.emit('join', joinMessage)
  }

  // 监听离开
  @Event('leave')
  handleLeave(socket: Socket, data: UserInfo) {
    const leaveMessage = {
      zh_CN: `[ ID: ${data.id}, 用户名：${data.username} ] 断开了连接`,
      en_US: `[ ID: ${data.id}, Username: ${data.username} ] has left`
    }
    console.log('-----------------------------------------------------------')
    console.log('Socket: /demo')
    console.log('Event: leave')
    console.log(leaveMessage.zh_CN)
    console.log(getCurrentTime())
    console.log('-----------------------------------------------------------')
    // 广播用户离开的信息
    socket.broadcast.emit('leave', leaveMessage)
  }

  // 监听错误
  @Event('error')
  handleError(err: any) {
    console.log(err)
  }
}
