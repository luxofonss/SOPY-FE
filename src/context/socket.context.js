import socketio from 'socket.io-client'
import React from 'react'

// export const socket = socketio.connect('http://localhost:8080')
export const socket = socketio.connect('https://sopt.onrender.com')

export const disConnectSocket = (userId) => {
  socket?.emit('disconnectSocket', userId)
}

export const connectSocket = (userId) => {
  socket.emit('newConnection', userId)
}

export const SocketContext = React.createContext()
