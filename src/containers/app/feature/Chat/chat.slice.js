import { createSlice, current } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

const initialState = {
  conversations: [],
  messages: [],
  newChat: {},
  newConversation: {}
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    initConversation: (state, action) => {
      console.log('payload:: ', action.payload)
      state.conversations = [...action.payload]
    },
    initMessages: (state, action) => {
      console.log('payload:: ', action.payload)
      state.messages = action.payload
    },
    setConversation: (state, action) => {
      state.conversations = [...state.conversations, ...action.payload]
    },
    setMessages: (state, action) => {
      console.log('payload:: ', action.payload)
      state.messages = [...state.messages, ...action.payload]
    },
    setNewMessage: (state, action) => {
      const { conversationId, message, from, time } = action.payload
      console.log('new msg info', conversationId, message, from, time)
      const newConversations = current(state.conversations).map((conversation) => {
        let newConversation = cloneDeep(conversation)
        console.log(newConversation, newConversation.lastMessage)

        if (conversation._id === conversationId) {
          newConversation.lastMessage.message = message
          newConversation.lastMessage.from = from
          newConversation.lastMessage.time = time
        }
        console.log(newConversation)
        return newConversation
      })
      state.conversations = [...newConversations]
    },
    setNewChat: (state, action) => {
      state.newChat = action.payload
    },
    newConversation: (state, action) => {
      state.newConversation = action.payload
    }
  }
})

export const {
  setNewChat,
  newConversation,
  initConversation,
  setNewMessage,
  initMessages,
  setConversation,
  setMessages
} = chatSlice.actions

export default chatSlice.reducer
