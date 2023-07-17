import { ORDER_STATUS } from '@src/configs'

function OrderStatusHistory({ order }) {
  console.log('order: ', order)
  return (
    <>
      <p className='mb-2 font-semibold text-neutral-600'>Lịch sử</p>
      <div className='flex items-center gap-1'>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-sm font-medium'>Created</div>
          <div className='h-4 w-4 rounded-full border-[1px] border-neutral-300 bg-primary-green'></div>
          <div className='color-neutral-600 text-center text-xs font-medium'>{order?.createdAt?.slice(0, 10)}</div>
        </div>
        {order?.status === ORDER_STATUS.REJECTED.value || order?.status === ORDER_STATUS.CANCELED.value ? null : (
          <>
            <div className={`${order?.confirmAt ? 'bg-primary-green' : 'bg-neutral-400'} h-[2px] w-full `}></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Confirmed</div>
              <div
                className={`${
                  order?.confirmAt ? 'bg-primary-green' : 'bg-neutral-400'
                } h-4 w-4 rounded-full border-[1px] border-neutral-300`}
              ></div>
              <div className='color-neutral-600 text-center text-xs font-medium'>
                {order?.confirmAt?.slice(0, 10) || ''}
              </div>
            </div>
            <div className={`${order?.shippingAt ? 'bg-primary-green' : 'bg-neutral-400'} h-[2px] w-full `}></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Shipping</div>
              <div
                className={`${
                  order?.shippingAt ? 'bg-primary-green' : 'bg-neutral-400'
                } h-4 w-4 rounded-full border-[1px] border-neutral-300`}
              ></div>
              <div className='color-neutral-600 text-center text-xs font-medium'>
                {order?.shippingAt?.slice(0, 10) || ''}
              </div>
            </div>
            <div className={`${order?.deliveredAt ? 'bg-primary-green' : 'bg-neutral-400'} h-[2px] w-full `}></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Delivered</div>
              <div
                className={`${
                  order?.deliveredAt ? 'bg-primary-green' : 'bg-neutral-400'
                } h-4 w-4 rounded-full border-[1px] border-neutral-300`}
              ></div>
              <div className='color-neutral-600 text-center text-xs font-medium'>
                {order?.deliveredAt?.slice(0, 10) || ''}
              </div>
            </div>
          </>
        )}
        {order?.status === ORDER_STATUS.REJECTED.value && (
          <>
            <div className='h-[2px] w-full bg-primary-red '></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Reject</div>
              <div className={`h-4 w-4 rounded-full border-[1px] border-neutral-300`}></div>
              <div className='color-neutral-600 text-center text-xs font-medium'>
                {order.reject.rejectedAt?.slice(0, 10)}
              </div>
              <div className='color-neutral-600 text-center text-xs font-medium'>{order.reject.reason}</div>
            </div>
          </>
        )}
        {order?.status === ORDER_STATUS.CANCELED.value && (
          <>
            <div className='h-[2px] w-full bg-primary-red '></div>
            <div className='flex flex-col items-center justify-center'>
              <div className='text-sm font-medium'>Reject</div>
              <div className={`h-4 w-4 rounded-full border-[1px] border-neutral-300`}></div>
              <div className='color-neutral-600 text-center text-xs font-medium'>
                {order.cancel.rejectedAt?.slice(0, 10)}
              </div>
              <div className='color-neutral-600 text-center text-xs font-medium'>{order.cancel.reason}</div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default OrderStatusHistory
