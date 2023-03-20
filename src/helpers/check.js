export const isJsonString = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const isEmptyValue = (value) => {
  if (
    value === NaN ||
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return true
  }
  return false
}

export const isExist = (value) => {
  return !isEmptyValue(value)
}

export function cleanObject(obj) {
  for (var propName in obj) {
    if (isEmptyValue(obj[propName])) {
      delete obj[propName]
    }
  }
  return obj
}
