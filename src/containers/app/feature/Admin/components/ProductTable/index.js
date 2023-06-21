/* eslint-disable jsx-a11y/anchor-is-valid */
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Space, Table } from 'antd'
import { Link } from 'react-router-dom'
const items = [
  {
    key: '1',
    label: 'Action 1'
  },
  {
    key: '2',
    label: 'Action 2'
  }
]

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

const ProductTable = ({ data, onTableChange }) => {
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
        title: 'Tồn kho',
        dataIndex: 'stock',
        key: 'stock'
      },
      {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size='middle'>
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown
              menu={{
                items
              }}
            >
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        )
      }
    ]
    const rowData = []

    data.products[row.key].variations.map((variation) => {
      rowData.push({
        variation: `${variation.keyVariationValue}, ${variation.subVariationValue}`,
        stock: variation.stock,
        price: variation.price,
        thumb: variation.thumb
      })
    })

    return <Table columns={columns} dataSource={rowData} pagination={false} />
  }
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
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDraft',
      key: 'isDraft',
      render: (isDraft) => {
        if (isDraft) return <p className='bg-secondary-orange rounded-md py-1 px-2'>Inactive</p>
        else return <p className='bg-secondary-green rounded-md py-1 px-2'>Active</p>
      }
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand'
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Link to={`/shop/product/${id}`}>View</Link>
    }
  ]
  const rowData = []
  data?.products?.forEach((product, index) => {
    rowData.push({
      key: index.toString(),
      name: product.name,
      sku: 'null',
      brand: product.brand,
      thumb: product.thumb[0],
      id: product._id
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
export default ProductTable
