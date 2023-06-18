export default function getVariation(variations, product) {
  let variationRes = { id: null, stock: null }
  product?.metadata?.variations?.forEach((variation) => {
    if (!variation?.subVariation) {
      if (variation.keyVariationValue === variations.variation1) {
        variationRes.id = variation._id
        variationRes.stock = variation.stock
      }
    } else {
      if (
        variation.keyVariationValue === variations.variation1 &&
        variation.subVariationValue === variations.variation2
      ) {
        variationRes.id = variation._id
        variationRes.stock = variation.stock
      }
    }
  })
  console.log('variation is:: ', variationRes)
  return variationRes
}
