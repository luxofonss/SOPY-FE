import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      Home
      <Link to='/login'>Sign in</Link>
      <Link to='/signup'>Sign up</Link>
    </div>
  )
}

export default Home
