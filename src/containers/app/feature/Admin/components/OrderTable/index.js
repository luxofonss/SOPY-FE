/* eslint-disable jsx-a11y/anchor-is-valid */
import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import AppModal from '@src/components/Modal'
import { ORDER_STATUS } from '@src/configs'
import accounting from 'accounting'
import { Space, Table } from 'antd'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { adminApi } from '../../adminService'

const OrderTable = ({ refreshData, data, onSelect, onTableChange }) => {
  const [selectId, setSelectId] = useState(null)
  const closeRejectRef = useRef(null)
  const openRef = useRef(null)
  const [rejectOrder, { isLoading: isRejecting }] = adminApi.endpoints.rejectOrder.useMutation()

  const handleReject = async (data) => {
    const response = await rejectOrder({ orderId: selectId, reason: data.reason })

    if (response.error) {
      toast.error(response.error.data.message)
    } else {
      toast.success('Từ chối đơn hàng thành công!')
      closeRejectRef.current.closeModal()
      await refreshData()
    }
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      let selectedRowIds = selectedRows.map((row) => row.id)
      onSelect(selectedRowIds)
    }
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name
    // })
  }

  const expandedRowRender = (row) => {
    console.log('row: ', row)
    const columns = [
      {
        title: '',
        dataIndex: 'thumb',
        key: 'thumb',
        width: 80,
        render: (thumb) => (
          <Space size='middle'>
            <img className='w-12 h-12 object-cover rounded-md' src={thumb} alt='thumb' />
          </Space>
        )
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        key: 'name',
        width: 250,
        render: (name) => (
          <Space size='middle'>
            <p className='w-full text-sm text-neutral-500 line-clamp-2'>{name}</p>
          </Space>
        )
      },
      {
        title: 'Phân loại hàng',
        dataIndex: 'variation',
        key: 'variation'
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity'
      },
      {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: 'Action',
        dataIndex: 'id',
        key: 'id',
        render: (id) => <Link to={`/shop/product/${id}`}>Xem sản phẩm</Link>
      }
    ]
    const rowData = []

    data?.orders[row.key]?.products.map((product) => {
      rowData.push({
        variation: `${product.variation.keyVariationValue}, ${product.variation.subVariationValue}`,
        quantity: product.quantity,
        price: product.variation.price,
        thumb: product.variation.thumb,
        id: product.product._id,
        name: product.product.name
      })
    })

    return <Table columns={columns} dataSource={rowData} pagination={false} />
  }
  const columns = [
    {
      title: 'Tracking',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber'
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => <p>₫{accounting.formatNumber(totalPrice)}</p>
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod'
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress'
    },
    {
      title: 'Số lượng',
      dataIndex: 'products',
      key: 'products',
      render: (products) => <p>{products.length}</p>
    },
    {
      title: 'Ngày tạo đơn',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => <p>{createdAt.slice(0, 10)}</p>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return (
          <div style={{ backgroundColor: `${ORDER_STATUS[status].color}` }} className={`rounded-md py-1 px-2`}>
            {ORDER_STATUS[status].value}
          </div>
        )
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (_, record) => (
        <div className='flex gap-2'>
          <Link to={`/shop/order/${record?.id}`}>Xem chi tiết</Link>
          {(record.status === ORDER_STATUS.PENDING.value || record.status === ORDER_STATUS.CONFIRMED.value) && (
            <AppButton
              onClick={() => {
                setSelectId(record?.id)
                openRef.current.openModal()
              }}
              className='h-8 px-2 py-1 text-sm font-medium'
            >
              Từ chối
            </AppButton>
          )}
        </div>
      )
    }
  ]
  const rowData = []
  data?.orders?.forEach((order, index) => {
    rowData.push({
      id: order._id,
      key: index.toString(),
      trackingNumber: order.trackingNumber,
      totalPrice: order.checkout.totalPrice,
      paymentMethod: order.payment.method,
      shippingAddress: order.shipping.address,
      products: order.products,
      createdAt: order.createdAt,
      status: order.status
    })
  })

  return (
    <>
      <AppModal closeRef={closeRejectRef} openRef={openRef}>
        <div className='w-[450px] bg-neutral-200 rounded-lg p-4'>
          <h4 className='text-base text-neutral-600 font-medium'>Từ chối đơn hàng</h4>
          <AppForm onSubmit={handleReject}>
            <AppInput placeholder='Lý do từ chối' name='reason' id='reason' />
            <div className='flex justify-center gap-4 items-center mt-6'>
              <AppButton
                type='button'
                onClick={() => {
                  closeRejectRef.current.closeModal()
                }}
              >
                Hủy
              </AppButton>
              <AppButton isLoading={isRejecting} type='submit'>
                Xác nhận
              </AppButton>
            </div>
          </AppForm>
        </div>
      </AppModal>
      <Table
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ['0']
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15'],
          total: data?.count
        }}
        onChange={(pagination, filters, sorter) => {
          onTableChange(pagination, filters, sorter)
        }}
        dataSource={rowData}
        size='middle'
      />
    </>
  )
}
export default OrderTable
