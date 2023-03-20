import { logOut } from '@src/containers/authentication/feature/Auth/authSlice'
import { useDispatch } from 'react-redux'

function Home() {
  const dispatch = useDispatch()
  return (
    <div>
      Home
      <button
        onClick={() => {
          dispatch(logOut())
        }}
      >
        Log out
      </button>
    </div>
  )
}

export default Home
