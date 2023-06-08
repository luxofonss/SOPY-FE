import { Table } from 'antd'

const columns = [
  {
    title: 'Sản phẩm',
    dataIndex: 'name',
    width: 250,
    render: (text) => (
      <div className='flex gap-3 max-w-[250px]'>
        <img
          className='w-12 h-12 object-cover rounded-md'
          src='https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/351199809_1775346002923434_6247307998493095477_n.jpg?stp=dst-jpg_s600x600&_nc_cat=107&ccb=1-7&_nc_sid=a26aad&_nc_ohc=83UG26cKklAAX8Dw15p&_nc_ht=scontent.fhan14-1.fna&oh=00_AfBeHapx1zhfbrSYCUy2cSB6AP6--0KQ4MYxdOTAAtVoyw&oe=6482A670'
          alt='thumb'
        />
        <div>
          <a className='font-bold text-neutral-700 text-sm truncate max-w-[180px]' href='/'>
            {text}
          </a>
          <p className='font-semibold text-sm text-neutral-400 truncate max-w-[180px]'>
            this is a long product description that may cause line break but it doesnt work at all
          </p>
        </div>
      </div>
    )
  },
  {
    title: 'SKU',
    dataIndex: 'sku'
  },
  {
    title: 'Phân loại hàng',
    dataIndex: 'variation'
  },
  {
    title: 'Giá',
    dataIndex: 'price'
  },
  {
    title: 'Kho hàng',
    dataIndex: 'stock'
  },
  {
    title: 'Doanh số',
    dataIndex: 'revenue'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (status) => <div className='h-6 px-2 bg-secondary-green rounded-md'>{status}</div>
  },
  {
    title: 'Thao tác',
    dataIndex: 'address'
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    sku: 32,
    variation: 'Red, M',
    price: 200000,
    stock: 1000,
    revenue: 100000,
    status: 'Active'
  },
  {
    key: '2',
    name: 'John Brown',
    sku: 32,
    variation: 'Red, M',
    price: 200000,
    stock: 1000,
    revenue: 100000,
    status: 'Active'
  },
  {
    key: '3',
    name: 'John Brown',
    sku: 32,
    variation: 'Red, M',
    price: 200000,
    stock: 1000,
    revenue: 100000,
    status: 'Active'
  },
  {
    key: '44',
    name: 'John Brown',
    sku: 32,
    variation: 'Red, M',
    price: 200000,
    stock: 1000,
    revenue: 100000,
    status: 'Active'
  }
]

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name
  })
}

function ProductTable() {
  return (
    <div>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}

export default ProductTable
