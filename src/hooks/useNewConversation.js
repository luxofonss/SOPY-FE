import chatApi from '@src/containers/app/feature/Chat/chat.service'
import { initConversation, newConversation, setNewChat } from '@src/containers/app/feature/Chat/chat.slice'
import { isEmpty } from 'lodash'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const useNewConversation = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [getNewConversation] = chatApi.endpoints.getNewConversation.useMutation()

  const handleClick = async ({ receiverId, name, avatar }) => {
    console.log('receiverId', receiverId, name, avatar)
    const response = await getNewConversation({ receiverId })
    if (response.error) {
      toast.warn('Hệ thống đang bảo trì, vui lòng thử lại sau!')
    } else {
      console.log('conversation:: ', response?.data?.metadata)
      if (!isEmpty(response?.data?.metadata)) {
        dispatch(setNewChat({ receiverId, name, avatar: avatar || '' }))
        dispatch(initConversation(response?.data?.metadata))
        navigate(`/me/message/${response?.data?.metadata[0]._id}`)
      } else {
        dispatch(setNewChat({ receiverId, name, avatar: avatar || '' }))
        dispatch(
          newConversation({
            id: 'temporatyConversation',
            user: { _id: receiverId, avatar, name }
          })
        )
        navigate('/me/message/new')
      }
    }
  }

  return handleClick
}

export default useNewConversation
