export const USER_ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN'
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
  RETURN: { value: 'RETURN', color: '#FF6A55', name: 'Trả hàng/hoàn tiền' }
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
