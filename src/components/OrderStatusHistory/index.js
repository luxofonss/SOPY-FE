import { ORDER_STATUS } from '@src/configs'

function OrderStatusHistory({ order }) {
  console.log('order: ', order)
  return (
    <>
      <p className='text-neutral-600 font-semibold mb-2'>Lịch sử</p>
      <div className='flex items-center gap-1'>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-sm font-medium'>Created</div>
          <div className='w-4 h-4 border-[1px] border-neutral-300 bg-primary-green rounded-full'></div>
          <div className='text-xs text-center font-medium color-neutral-600'>{order?.createdAt.slice(0, 10)}</div>
        </div>
        {order?.status === ORDER_STATUS.REJECTED.value || order?.status === ORDER_STATUS.CANCELED.value ? null : (
          <>
            <div className={`${order?.confirmAt ? 'bg-primary-green' : 'bg-neutral-400'} h-[2px] w-full `}></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Confirmed</div>
              <div
                className={`${
                  order?.confirmAt ? 'bg-primary-green' : 'bg-neutral-400'
                } w-4 h-4 border-[1px] border-neutral-300 rounded-full`}
              ></div>
              <div className='text-xs text-center font-medium color-neutral-600'>
                {order?.confirmAt?.slice(0, 10) || ''}
              </div>
            </div>
            <div className={`${order?.shippingAt ? 'bg-primary-green' : 'bg-neutral-400'} h-[2px] w-full `}></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Shipping</div>
              <div
                className={`${
                  order?.shippingAt ? 'bg-primary-green' : 'bg-neutral-400'
                } w-4 h-4 border-[1px] border-neutral-300 rounded-full`}
              ></div>
              <div className='text-xs text-center font-medium color-neutral-600'>
                {order?.shippingAt?.slice(0, 10) || ''}
              </div>
            </div>
            <div className={`${order?.deliveredAt ? 'bg-primary-green' : 'bg-neutral-400'} h-[2px] w-full `}></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Delivered</div>
              <div
                className={`${
                  order?.deliveredAt ? 'bg-primary-green' : 'bg-neutral-400'
                } w-4 h-4 border-[1px] border-neutral-300 rounded-full`}
              ></div>
              <div className='text-xs text-center font-medium color-neutral-600'>
                {order?.deliveredAt?.slice(0, 10) || ''}
              </div>
            </div>
          </>
        )}
        {order?.status === ORDER_STATUS.REJECTED.value && (
          <>
            <div className='bg-primary-red h-[2px] w-full '></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Reject</div>
              <div className={`w-4 h-4 border-[1px] border-neutral-300 rounded-full`}></div>
              <div className='text-xs text-center font-medium color-neutral-600'>
                {order.reject.rejectedAt.slice(0, 10)}
              </div>
              <div className='text-xs text-center font-medium color-neutral-600'>{order.reject.reason}</div>
            </div>
          </>
        )}
        {order?.status === ORDER_STATUS.CANCELED.value && (
          <>
            <div className='bg-primary-red h-[2px] w-full '></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Reject</div>
              <div className={`w-4 h-4 border-[1px] border-neutral-300 rounded-full`}></div>
              <div className='text-xs text-center font-medium color-neutral-600'>
                {order.cancel.rejectedAt.slice(0, 10)}
              </div>
              <div className='text-xs text-center font-medium color-neutral-600'>{order.cancel.reason}</div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default OrderStatusHistory
