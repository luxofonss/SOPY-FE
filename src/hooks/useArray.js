import { useCallback, useState } from 'react'

const useArray = (initialValue = []) => {
  const [arrValue, setArrValue] = useState(initialValue)

  const pushToArr = useCallback((item) => {
    setArrValue((v) => [...v, item])
  }, [])

  const removeFromArr = useCallback((index) => {
    setArrValue((v) => {
      const copy = v
      copy.slice(index, 1)
      return copy
    })
  }, [])

  const clearArr = useCallback(() => {
    setArrValue({})
  }, [])

  return { arrValue, pushToArr, removeFromArr, clearArr }
}

export default useArray
