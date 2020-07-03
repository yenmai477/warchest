const mongoose = require('mongoose');
const dateDiff = require('../utils/dateDiff');
const Product = require('./productModel');
const { priceComment, addLabelPrice } = require('../utils/priceAnalysis');

const priceTrackSchema = mongoose.Schema(
  {
    priceTs: {
      type: Date,
      default: Date.now(),
    },
    price: {
      type: Number,
      min: [0, `The price of product can't be negative `],
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Price track must belong to a Product!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

priceTrackSchema.statics.priceAnalysisHandle = async function(
  productId,
  currentPrice
) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: null,
        minDate: { $min: '$priceTs' },
        maxDate: { $max: '$priceTs' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgPrice: { $avg: '$price' },
        countPrice: { $sum: 1 },
      },
    },
  ]);
  console.log('productId', productId);
  console.log(stats);

  if (stats.length > 0) {
    const { minDate, maxDate, minPrice, maxPrice, avgPrice } = stats[0];

    const historyRange = dateDiff(minDate, maxDate);
    console.log(historyRange);
    console.log('-------------------------------');

    // TODO: 05/27/20 Đánh giá giá sản phẩm
    const priceAnalysis = priceComment({ ...stats[0], currentPrice });
    // TODO: 05/27/20 Gắn thẻ good best price
    const priceLabel = addLabelPrice({ ...stats[0], currentPrice });
    await Product.findByIdAndUpdate(
      productId,
      {
        historyRange,
        priceAnalysis,
        minPrice,
        maxPrice,
        avgPrice,
        priceLabel,
        price: currentPrice,
      },
      { new: true }
    );
  }
};

priceTrackSchema.post('save', function() {
  // this points to current price track
  this.constructor.priceAnalysisHandle(this.product, this.price);
});

const PriceTrack = mongoose.model('PriceTrack', priceTrackSchema);

module.exports = PriceTrack;
