const variation = [
  {
    _id: '648205bb734b1aa413941f06',
    productId: '648205b9734b1aa413941f02',
    keyVariation: '1',
    keyVariationValue: '123',
    subVariation: '1',
    subVariationValue: '234',
    isSingle: false,
    thumb:
      'https://firebasestorage.googleapis.com/v0/b/sopy-1858b.appspot.com/o/files%2Fimages%2F5752-peeponuggies.png%202023-6-8%2023%3A45%3A46?alt=media&token=6dcfe8e8-4a6d-4dc1-9c01-a458e11fcbf0',
    price: 4,
    stock: 4,
    createdAt: '2023-06-08T16:45:47.677Z',
    updatedAt: '2023-06-08T16:45:47.677Z',
    __v: 0
  }
]

function getVariation2ByVariation1(variation1) {
  let res = []
  variation.forEach((item) => {
    if (item.subVariation)
      if (item.keyVariationValue === variation1) res.push({ id: item._id, value: item.subVariationValue })
  })
  return res
}

function getVariation1ByVariation2(variation2) {
  let res = []
  variation.forEach((item) => {
    console.log('item::', item)
    if (item.subVariationValue === variation2) res.push({ id: item._id, value: item.keyVariationValue })
  })
  return res
}

const result = getVariation2ByVariation1('123')
console.log('result:: ', result)
