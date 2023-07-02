/* eslint-disable react-hooks/exhaustive-deps */
import { Popover, Transition } from '@headlessui/react'
import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid'
import chatApi from '@src/containers/app/feature/Chat/chat.service'
import { initConversation } from '@src/containers/app/feature/Chat/chat.slice'
import moment from 'moment'
import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function MessengerDropdown() {
  const allConversations = useSelector((state) => state.chat.conversations)
  const [getAllConversations] = chatApi.endpoints.getUserConversations.useLazyQuery()
  const dispatch = useDispatch()

  const fetchConversation = async () => {
    const allConversation = await getAllConversations({}, false).unwrap()
    dispatch(initConversation(allConversation?.metadata))
  }

  useEffect(() => {
    fetchConversation()
  }, [])

  console.log('allConversations:: ', allConversations)
  return (
    <div className='flex'>
      <Popover className='relative z-[1000]'>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
        ${open ? '' : 'text-opacity-90 '}
        group inline-flex items-center rounded-md px-3 text-gray-700 py-2 text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-none focus-visible:ring-opacity-75`}
            >
              <div className='w-8 h-8 rounded-full flex justify-center items-center'>
                <ChatBubbleLeftIcon className='w-6 h-6 text-neutral-0' />
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute shadow-xl max-h-96 overflow-y-scroll bg-neutral-0 rounded-xl p-3 right-0 z-10 mt-3 w-96 border-2 max-w-sm transform sm:p-4 lg:max-w-3xl'>
                <div className='text-neutral-600 w-[200px] h-10'>Tin nhắn</div>
                {allConversations ? (
                  <>
                    {allConversations?.map((conversation) => {
                      return (
                        <Link
                          to={`/me/message/${conversation._id}`}
                          className={`h-14 w-full flex items-center py-1 mt-1 rounded-md px-4 hover:bg-neutral-200 hover:cursor-pointer transition`}
                          key={conversation._id}
                          target='_blank'
                        >
                          <div className='flex w-full gap-4'>
                            <img
                              className='w-12 h-12 rounded-full border-[1px] border-neutral-200'
                              src={
                                conversation?.user?.avatar ||
                                'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
                              }
                              alt='avatar'
                            />
                            <div className='flex-1'>
                              <div className='flex items-center justify-between'>
                                <div className='font-semibold text-neutral-700 line-clamp-1 flex-1'>
                                  {conversation?.user?.name}
                                </div>
                                <div className='text-xs text-neutral-500'>
                                  {moment(conversation?.lastMessage?.time).format('HH:MM')}
                                </div>
                              </div>
                              <div className='text-sm text-neutral-400 line-clamp-1'>
                                {conversation?.lastMessage?.message}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                    <div className='flex justify-end mt-1'>
                      <Link
                        to='/me/message/all'
                        className='text-xs text-neutral-500 font-medium hover:text-neutral-600 transition'
                        target='_blank'
                      >
                        Xem tất cả
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className='flex justify-center items-center text-sm text-neutral-700'>
                    Bạn chưa có cuộc trò chuyện nào
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default MessengerDropdown
