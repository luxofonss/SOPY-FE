/* eslint-disable react-hooks/exhaustive-deps */
import { ORDER_NOTIFICATION } from '@src/configs'
import chatApi from '@src/containers/app/feature/Chat/chat.service'
import { initConversation } from '@src/containers/app/feature/Chat/chat.slice'
import { SocketContext } from '@src/context/socket.context'
import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

function SocketListener() {
  const socket = useContext(SocketContext)
  const dispatch = useDispatch()

  const [getAllConversations] = chatApi.endpoints.getUserConversations.useLazyQuery()

  const fetchConversation = async () => {
    const allConversation = await getAllConversations({}, false).unwrap()
    dispatch(initConversation(allConversation?.metadata))
  }

  useEffect(() => {
    socket.on(ORDER_NOTIFICATION, (msg) => {
      console.log('socket msg:: ', msg)
      toast.success(msg)
    })

    // if (location.pathname !== 'me/message/') {
    socket.on('receiveMessage', () => {
      fetchConversation()
    })
    // }
  }, [socket])
  return <div></div>
}

export default SocketListener
