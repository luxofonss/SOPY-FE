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
        focus-visible:ring-none group inline-flex items-center rounded-md px-3 py-2 text-base font-medium  text-gray-700 hover:text-opacity-100 focus:outline-none focus-visible:ring-opacity-75`}
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-full'>
                <ChatBubbleLeftIcon className='h-6 w-6 text-neutral-0' />
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
              <Popover.Panel className='absolute right-0 z-10 mt-3  w-96 max-w-sm transform  rounded-xl border-2 bg-neutral-0 p-3 shadow-xl sm:p-4 lg:max-w-3xl'>
                <div className='h-10 w-[200px] text-neutral-600'>Tin nhắn</div>
                {allConversations ? (
                  <>
                    <div className='max-h-96 overflow-y-scroll'>
                      {allConversations?.map((conversation) => {
                        return (
                          <Link
                            to={`/me/message/${conversation._id}`}
                            className={`mt-1 flex h-14 w-full items-center rounded-md py-1 px-4 transition hover:cursor-pointer hover:bg-neutral-200`}
                            key={conversation._id}
                            target='_blank'
                          >
                            <div className='flex w-full gap-4'>
                              <img
                                className='h-12 w-12 rounded-full border-[1px] border-neutral-200'
                                src={
                                  conversation?.user?.avatar ||
                                  'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
                                }
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
                                <div className='text-sm text-neutral-400 line-clamp-1'>
                                  {conversation?.lastMessage?.message}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                    <div className='mt-1 flex justify-end'>
                      <Link
                        to='/me/message/all'
                        className='mt-3 text-xs font-medium text-neutral-500 transition hover:text-neutral-600'
                        target='_blank'
                      >
                        Xem tất cả
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className='flex items-center justify-center text-sm text-neutral-700'>
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
