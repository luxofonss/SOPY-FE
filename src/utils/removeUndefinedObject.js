const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key]
    }
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      removeUndefinedObject(obj[key])
    }
  })
  return obj
}

export default removeUndefinedObject
