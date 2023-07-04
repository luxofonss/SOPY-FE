export const USER_ROLE = {
  USER: 'SHOP',
  SHOP: 'ADMIN'
}

export const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

export const ORDER_STATUS = {
  PENDING: { value: 'PENDING', color: '#cabdff', name: 'Chờ xác nhận' },
  CONFIRMED: { value: 'CONFIRMED', color: '#b5e4ca', name: 'Chờ lấy hàng' },
  CANCELED: { value: 'CANCELED', color: '#FFBC99', name: 'Đơn hủy' },
  REJECTED: { value: 'REJECTED', color: '#FF6A55', name: 'Đơn từ chối' },
  SHIPPING: { value: 'SHIPPING', color: '#8E59FF', name: 'Đang giao' },
  DELIVERED: { value: 'DELIVERED', color: '#83BF6E', name: 'Đã giao' },
  RETURN: { value: 'RETURN', color: '#FF6A55', name: 'Trả hàng' }
}

export const ORDER_FILTER = [
  { name: 'Mã đơn hàng', value: 'trackingNumber' },
  { name: 'Tên người mua', value: 'customer' },
  { name: 'Sản phẩm', value: 'productName' }
]

export const ORDER_STATUS_ARRAY = Object.entries(ORDER_STATUS).map((e) => e[1])

export const RESPONSE_ERROR_STATUS = 'error'

export const ACCESS_TOKEN_EXPIRATION = 30 * 60

export const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000 // 30 days

export const ADS_HOME = [
  { name: 'Khung Giờ Săn Sale', image: 'https://cf.shopee.vn/file/e4a404283b3824c211c1549aedd28d5f_xhdpi' },
  { name: 'Miễn Phí Vận Chuyển', image: 'https://cf.shopee.vn/file/a8d76bca057ba0b117dcf8e1ef068d16_xhdpi' },
  {
    name: 'Voucher Giảm 200.000Đ',
    image: 'https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059_xhdpi'
  },
  {
    name: 'Hàng hiệu Outlet Giảm 50%',
    image: 'https://cf.shopee.vn/file/vn-50009109-852300c407c5e79bf5dc1854aa0cfeef_xhdpi'
  },
  {
    name: 'Mã Giảm Giá',
    image: 'https://cf.shopee.vn/file/vn-50009109-8a387d78a7ad954ec489d3ef9abd60b4_xhdpi'
  },
  {
    name: 'Bắt Trend - Giá Sốc',
    image: 'https://cf.shopee.vn/file/vn-50009109-1975fb1af4ae3c22878d04f6f440b6f9_xhdpi'
  },
  {
    name: 'Nạp Thẻ, Dịch Vụ & Data',
    image: 'https://cf.shopee.vn/file/9df57ba80ca225e67c08a8a0d8cc7b85_xhdpi'
  },
  {
    name: 'Hàng Quốc Tế',
    image: '	https://cf.shopee.vn/file/a08ab28962514a626195ef0415411585_xhdpi'
  },
  {
    name: 'Chọn Số Trúng 86.000 Xu',
    image: 'https://cf.shopee.vn/file/vn-50009109-c2de3206eaa0d62ddb9c0617ccdfa670_xhdpi'
  },
  {
    name: 'Gì Cũng Rẻ - Mua Là Freeship',
    image: 'https://cf.shopee.vn/file/b3535d7e56c58c4ebe9a87672d38cc5e_xhdpi'
  }
]

export const ORDER_NOTIFICATION = 'ORDER_NOTIFICATION'

export const DEFAULT_AVT = 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
