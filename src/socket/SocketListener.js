/* eslint-disable react-hooks/exhaustive-deps */
import { ORDER_NOTIFICATION } from '@src/configs'
import chatApi from '@src/containers/app/feature/Chat/chat.service'
import { initConversation } from '@src/containers/app/feature/Chat/chat.slice'
import { setNotification } from '@src/containers/app/feature/Customer/customer.slice'
import { SocketContext } from '@src/context/socket.context'
import appApi from '@src/redux/service'
import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

function SocketListener() {
  const socket = useContext(SocketContext)
  const dispatch = useDispatch()

  const [getAllConversations] = chatApi.endpoints.getUserConversations.useLazyQuery()
  const [getNotification] = appApi.endpoints.getNotification.useLazyQuery()

  const fetchConversation = async () => {
    const allConversation = await getAllConversations({}, false).unwrap()
    dispatch(initConversation(allConversation?.metadata))
  }

  const fetchNotification = async () => {
    const allNotifications = await getNotification({}, false).unwrap()
    dispatch(setNotification(allNotifications?.metadata))
  }

  useEffect(() => {
    socket.on(ORDER_NOTIFICATION, async (msg) => {
      console.log('socket msg:: ', msg)
      toast.success(msg)
      await fetchNotification()
    })

    // if (location.pathname !== 'me/message/') {
    socket.on('receiveMessage', async () => {
      await fetchConversation()
    })
    // }
  }, [socket])
  return <div></div>
}

export default SocketListener
