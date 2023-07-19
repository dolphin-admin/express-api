import { Socket } from 'socket.io'

import { Event, Namespace } from '@/decorators'

@Namespace('/demo')
export class DemoController {
  // 监听消息
  @Event('message')
  handleMessage(socket: Socket, data: any) {
    console.log(data)
    // 广播消息
    socket.broadcast.emit('message', data)
  }

  // 监听进入
  @Event('join')
  handleJoin(socket: Socket, data: any) {
    console.log(data)
    // 广播用户进入的信息
    socket.broadcast.emit('message', data)
  }

  // 监听离开
  @Event('leave')
  handleLeave(socket: Socket, data: any) {
    console.log(data)
    // 广播用户离开的信息
    socket.broadcast.emit('message', data)
  }

  // 监听错误
  @Event('error')
  handleError(err: any) {
    console.log(err)
  }
}
