const mongoose = require('mongoose');
const dateDiff = require('../utils/dateDiff');
const Product = require('./productModel');

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

priceTrackSchema.statics.calcHistoryRange = async function(productId) {
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

    await Product.findByIdAndUpdate(productId, {
      historyRange,
      minPrice,
      maxPrice,
      avgPrice,
    });
  }
};

priceTrackSchema.post('save', function() {
  // this points to current price track
  this.constructor.calcHistoryRange(this.product);
});

const PriceTrack = mongoose.model('PriceTrack', priceTrackSchema);

module.exports = PriceTrack;
