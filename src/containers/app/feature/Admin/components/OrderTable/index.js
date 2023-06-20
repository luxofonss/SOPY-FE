/* eslint-disable jsx-a11y/anchor-is-valid */
import { ORDER_STATUS } from '@src/configs'
import accounting from 'accounting'
import { Space, Table } from 'antd'
import { Link } from 'react-router-dom'

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  }
  // getCheckboxProps: (record) => ({
  //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //   name: record.name
  // })
}

const OrderTable = ({ data, onTableChange }) => {
  const expandedRowRender = (row) => {
    console.log('row: ', row)
    const columns = [
      {
        title: '',
        dataIndex: 'thumb',
        key: 'thumb',
        render: (thumb) => (
          <Space size='middle'>
            <img className='w-12 h-12 object-cover rounded-md' src={thumb} alt='thumb' />
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

    data[row.key].products.map((product) => {
      rowData.push({
        variation: `${product.variation.keyVariationValue}, ${product.variation.subVariationValue}`,
        quantity: product.quantity,
        price: product.variation.price,
        thumb: product.variation.thumb,
        id: product.product._id
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
      render: (id) => <Link to={`/shop/order/${id}`}>Xem chi tiết</Link>
    }
  ]
  const rowData = []
  data?.forEach((order, index) => {
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
