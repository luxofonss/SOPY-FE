import AppButton from '@src/components/AppButton'
import AppForm from '@src/components/Form/AppForm'
import AppInput from '@src/components/Form/AppInput'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { create, fetchTodos } from './todoSlice'
import { v4 as uuidv4 } from 'uuid'
import { unwrapResult } from '@reduxjs/toolkit'
import { useGetTodoListQuery } from './todo.services'

export default function Todo() {
  const todos = useSelector((state) => state.todo.todos)
  const dispatch = useDispatch()
  const onSubmit = (data) => {
    dispatch(create(data))
  }

  const { data, isFetching, isError } = useGetTodoListQuery()

  console.log(data, isFetching, isError)

  const handleFetchTodos = () => {
    try {
      const resultAction = dispatch(fetchTodos())
      const originalPromiseResult = unwrapResult(resultAction)
      console.log('original promise result', originalPromiseResult)
    } catch (rejectedValueOrSerializedError) {
      console.log('rejected value or serialized error', rejectedValueOrSerializedError)
    }
  }

  return (
    <div className='container mx-auto w-96 py-4 px-6 bg-slate-700'>
      <AppForm onSubmit={onSubmit}>
        <AppInput name='title' label='Title' required />
        <AppInput name='description' label='Description' />
        <AppButton type='submit'>Create</AppButton>
      </AppForm>
      <AppButton className='mt-4' onClick={handleFetchTodos}>
        fetch
      </AppButton>
      {todos.length > 0 &&
        todos.map((todo) => {
          return <div key={uuidv4()}>{todo.title}</div>
        })}
    </div>
  )
}
