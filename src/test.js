function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
    })
  } else if (data && isArray(data) && !(data instanceof Date) && !(data instanceof File)) {
    data.forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
    })
  } else {
    const value = data == null ? '' : data

    formData.append(parentKey, value)
  }
}

const form = new FormData()

const attributes = {
  dimensions: {
    h: 1,
    w: 2,
    l: 3
  }
}

form.append('attributes', JSON.stringify(attributes))
attributes
// buildFormData(form)

console.log(form)
