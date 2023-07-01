product.aggregate(
  [
    { $match: { sold: { $gte: -1, $lte: 10000000000 }, stock: { $gte: -1, $lte: 10000000000 } } },
    {
      $lookup: {
        from: 'variation',
        let: { variations: '$variations' },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', '$$variations'] } } },
          {
            $project: {
              keyVariation: 1,
              keyVariationValue: 1,
              subVariation: 1,
              subVariationValue: 1,
              price: 1,
              stock: 1,
              isSingle: 1,
              thumb: 1
            }
          }
        ],
        as: 'variations'
      }
    },
    { $sort: { _id: -1 } },
    { $skip: 0 },
    { $limit: 10 },
    { $project: { name: 1, thumb: 1, description: 1, variations: 1, isDraft: 1, sold: 1, sku: 1 } }
  ],
  {}
)
