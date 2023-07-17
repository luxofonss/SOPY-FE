/* eslint-disable react-hooks/exhaustive-deps */
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import SearchBar from '@src/components/Layouts/components/SearchBar'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import chatApi from '../../chat.service'
import {
  initConversation,
  initMessages,
  newConversation,
  setMessages,
  setNewChat,
  setNewMessage
} from '../../chat.slice'
import { SocketContext } from '@src/context/socket.context'
import { toast } from 'react-toastify'
import { useTitle } from '@src/hooks/useTitle'
import { DEFAULT_AVT } from '@src/configs'
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'

function Chat() {
  const [currentConversation, setCurrentConversation] = useState()
  const messagesInConversations = useSelector((state) => state.chat.messages)
  const allConversations = useSelector((state) => state.chat.conversations)
  const newConversationInfo = useSelector((state) => state.chat.newConversation)
  const userInfo = useSelector((state) => state.auth.user)
  const [getAllConversations] = chatApi.endpoints.getUserConversations.useLazyQuery()
  const [getMessagesInConversation] = chatApi.endpoints.getMessagesInConversation.useLazyQuery()
  const [sendMessage] = chatApi.endpoints.sendMessage.useMutation()
  const scrollRef = useRef(null)
  const resetRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const socket = useContext(SocketContext)

  const { id } = useParams()
  const location = useLocation()

  useTitle('Sopy - Tin nhắn')

  const fetchConversation = async () => {
    const allConversation = await getAllConversations({}, false).unwrap()
    console.log('allConversation:: ', allConversation)
    dispatch(initConversation(allConversation?.metadata))
    console.log('id::', id)
    if (id !== 'all' && id !== 'new') {
      allConversation?.metadata?.map((conversation) => {
        console.log('conversation:: ', conversation, id)
        if (conversation._id === id) {
          setCurrentConversation(conversation)
        }
      })

      const allMessages = await getMessagesInConversation({ conversationId: id, page: 1 }, false).unwrap()
      dispatch(initMessages(allMessages?.metadata))
    }
  }

  const refreshConversation = async (conId) => {
    const allConversation = await getAllConversations({}, false).unwrap()
    console.log('allConversation:: ', allConversation)
    dispatch(initConversation(allConversation?.metadata))

    allConversation?.metadata?.map((conversation) => {
      console.log('conversation:: ', conversation, conId)
      if (conversation._id === conId) {
        setCurrentConversation(conversation)
      }
    })

    const allMessages = await getMessagesInConversation({ conversationId: conId, page: 1 }, false).unwrap()
    dispatch(initMessages(allMessages?.metadata))
  }

  const handleReceiverMessage = async (data) => {
    const response = await getAllConversations({}, false).unwrap()
    console.log('allConversation:: ', response)
    dispatch(initConversation(response?.metadata))
    if (data.conversationId === id) dispatch(setMessages([data]))
  }

  console.log('socket:: ', socket)

  useEffect(() => {
    socket?.on('receiveMessage', (data) => {
      handleReceiverMessage(data)
    })
    return () => {
      dispatch(setNewChat({}))
      dispatch(newConversation({}))
      dispatch(initMessages([]))
      // dispatch(initConversation([]))
    }
  }, [socket])

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesInConversations])

  //when first come to page
  useEffect(() => {
    fetchConversation()
  }, [])

  //when location change
  useEffect(() => {
    if (id === 'new') {
      console.log('setting conversation to new')
      setCurrentConversation(newConversationInfo)
    } else {
      getMessagesInConversation({ conversationId: id, page: 1 }, false).then((allMessages) => {
        dispatch(initMessages(allMessages?.data?.metadata))
      })
    }
  }, [location])

  const handleChooseConversation = (conversation) => {
    console.log('conversation:: ', conversation)
    dispatch(initMessages([]))
    setCurrentConversation(conversation)
  }

  const handleSendMessage = async (data) => {
    if (!isEmpty(data.message)) {
      if (id !== 'all' && id !== 'new') {
        dispatch(
          setMessages([
            {
              conversationId: currentConversation?._id,
              sender: userInfo._id,
              receiver: currentConversation?.user._id,
              message: data.message
            }
          ])
        )

        dispatch(
          setNewMessage({
            conversationId: currentConversation?._id,
            from: userInfo._id,
            message: data.message,
            time: Date.now()
          })
        )
        resetRef.current.resetFormValues()
        await sendMessage({
          conversationId: currentConversation?._id,
          receiver: currentConversation?.user._id,
          message: data?.message
        })
        socket?.emit('sendMessage', {
          conversationId: currentConversation?._id,
          receiver: currentConversation?.user._id,
          message: data?.message
        })
      } else if (id === 'new') {
        console.log('currentConversation?._id:: ', currentConversation?._id)
        // console.log('receiver:: ', receiver)
        const response = await sendMessage({
          conversationId: currentConversation?._id,
          receiver: currentConversation?.user._id,
          message: data?.message
        })

        if (!response.error) {
          console.log('response when send new message', response?.data?.metadata?.conversationId)
          dispatch(setNewChat({}))
          dispatch(newConversation({}))

          resetRef.current.resetFormValues()
          await refreshConversation(response?.data?.metadata?.conversationId)

          socket?.emit('sendMessage', {
            conversationId: response?.metadata?._id,
            receiver: currentConversation?.user.response?._id,
            message: data?.message
          })

          navigate(`/me/message/${response?.data?.metadata?.conversationId}`)
        } else {
          toast.warn('Không thể gửi tin nhắn')
        }
      }
    }
  }

  return (
    <div className='container mx-auto flex h-[calc(100vh_-_96px)] flex-col p-4'>
      {/* <div className='text-neutral-700 text-md font-semibold'>Chat</div> */}
      <div className=' grid h-[calc(100vh_-_96px)] flex-1 grid-cols-12 gap-4'>
        <div className='col-span-3 h-[calc(100vh_-_148px)] overflow-y-scroll  rounded-xl bg-white '>
          <div className='flex h-14 items-center border-b-[1px] border-b-neutral-300 px-4'>
            <SearchBar />
          </div>
          {!isEmpty(newConversationInfo) ? (
            <div
              className={`${
                newConversationInfo?._id === currentConversation?._id ? 'bg-orange-1' : ''
              } mt-4 flex h-16 w-full items-center py-1 px-4 transition hover:cursor-pointer hover:bg-neutral-200`}
              onClick={() => handleChooseConversation(newConversationInfo)}
              key={newConversationInfo?.user?._id}
            >
              <div className='flex w-full gap-4'>
                <img
                  className='h-12 w-12 rounded-full border-[1px] border-neutral-200'
                  src={
                    newConversationInfo?.user?.avatar ||
                    'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
                  }
                  alt='avatar'
                />
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1 font-bold text-neutral-700 line-clamp-1'>
                      {newConversationInfo?.user?.name}
                    </div>
                    <div className='text-xs text-neutral-400'></div>
                  </div>
                  <div className='text-sm text-neutral-400 line-clamp-1'></div>
                </div>
              </div>
            </div>
          ) : null}
          {allConversations?.map((conversation) => {
            return (
              <Link
                to={`/me/message/${conversation._id}`}
                className={`${
                  conversation._id === currentConversation?._id ? 'bg-neutral-300' : ''
                } mt-4 flex h-16 w-full items-center py-1 px-4 transition hover:cursor-pointer hover:bg-neutral-200`}
                onClick={() => handleChooseConversation(conversation)}
                key={conversation._id}
              >
                <div className='flex w-full gap-4'>
                  <img
                    className='h-12 w-12 rounded-full border-[1px] border-neutral-200'
                    src={conversation?.user?.avatar || DEFAULT_AVT}
                    alt='avatar'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <div className='flex-1 font-semibold text-neutral-700 line-clamp-1'>
                        {conversation?.user?.name}
                      </div>
                      <div className='text-xs text-neutral-500'>
                        {moment(conversation?.lastMessage?.time).format('HH:MM')}
                      </div>
                    </div>
                    <div className='text-sm text-neutral-400 line-clamp-1'>{conversation?.lastMessage?.message}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        <div className='col-span-9 flex h-[calc(100vh_-_148px)] flex-col rounded-xl bg-msg-bg px-4'>
          <div className='flex h-14 items-center border-b-[1px] border-b-neutral-300 font-semibold '>
            {currentConversation?.user?.name}
          </div>
          <div className='h-[calc(100vh_-_148px)] flex-1 overflow-y-scroll  py-4'>
            {messagesInConversations?.length > 0 ? (
              messagesInConversations?.map((message) => {
                if (message.sender !== userInfo?._id)
                  return (
                    <div ref={scrollRef} key={message._id} className='mb-3 flex justify-start gap-3'>
                      <img
                        className='p- h-12 w-12 rounded-full border-[1px] border-neutral-200'
                        src={currentConversation?.user?.avatar || DEFAULT_AVT}
                        alt='avatar'
                      />

                      <div className='rounded-xl bg-neutral-200 px-3 py-3 hover:bg-orange-3'>
                        <p className='block '>{message.message}</p>
                        <div className='flex-end ml-auto text-xs text-neutral-500'>
                          {moment(message?.createdOn).fromNow()}
                        </div>
                      </div>
                    </div>
                  )
                else {
                  return (
                    <div ref={scrollRef} key={message._id} className='mb-3 flex justify-end gap-3'>
                      <div className='rounded-xl bg-neutral-200 px-3 py-3 hover:bg-orange-3'>
                        <p className='block '>{message.message}</p>
                        <div className='flex-start ml-auto text-xs text-neutral-500'>
                          {moment(message?.createdOn).fromNow()}
                        </div>
                      </div>
                      <img
                        className='h-12 w-12 rounded-full border-[1px] border-neutral-200'
                        src={userInfo?.avatar || DEFAULT_AVT}
                        alt='avatar'
                      />
                    </div>
                  )
                }
              })
            ) : (
              <div>nothing</div>
            )}
          </div>
          <div>
            <AppForm className='flex items-center gap-3' ref={resetRef} onSubmit={handleSendMessage}>
              <AppInput className='flex-1' type='text' name='message' id='message' />
              <AppButton className='rounded-full bg-transparent hover:bg-orange-1' type='submit'>
                <PaperAirplaneIcon className='h-5 w-5 text-orange-3' />
              </AppButton>
            </AppForm>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
