import type { Socket } from 'socket.io'

export const demo = (socket: Socket) => {
  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
  socket.on('message', (data) => {
    console.log(data)
    socket.broadcast.emit('message', data)
  })
  socket.on('join', (data) => {
    socket.broadcast.emit('message', data)
  })
  socket.on('leave', (data) => {
    socket.broadcast.emit('message', data)
  })
}
