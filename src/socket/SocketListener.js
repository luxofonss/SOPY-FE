import { ORDER_NOTIFICATION } from '@src/configs'
import { SocketContext } from '@src/context/socket.context'
import { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'

function SocketListener() {
  const socket = useContext(SocketContext)

  useEffect(() => {
    socket.on('receiveMessage', () => {
      console.log('new msg')
    })

    socket.on(ORDER_NOTIFICATION, (msg) => {
      console.log('socket msg:: ', msg)
      toast.success(msg)
    })
  }, [socket])
  return <div></div>
}

export default SocketListener
