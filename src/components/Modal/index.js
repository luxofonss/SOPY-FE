import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useImperativeHandle, useState } from 'react'

export default function AppModal({
  isOpenModal = false,
  Trigger,
  openRef = { current: {} },
  children,
  closeRef = { current: {} }
}) {
  let [isOpen, setIsOpen] = useState(isOpenModal)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  useImperativeHandle(
    closeRef,
    () => ({
      closeModal
    }),
    [
      /* dependencies (if any) */
    ]
  )

  useImperativeHandle(
    openRef,
    () => ({
      openModal
    }),
    [
      /* dependencies (if any) */
    ]
  )

  return (
    <>
      <div className='w-auto'>
        <div
          type='button'
          onClick={() => {
            openModal()
          }}
        >
          {Trigger}
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10 bg-red-400' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                {children}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
