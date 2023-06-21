import AppForm from '@src/components/Form/AppForm'
import { Divider } from 'antd'

function Profile() {
  return (
    <div>
      <div>
        <h4>Hồ sơ của tôi</h4>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <Divider />
      <AppForm></AppForm>
    </div>
  )
}

export default Profile
