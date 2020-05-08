const mongoose = require('mongoose');

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

const PriceTrack = mongoose.model('PriceTrack', priceTrackSchema);

module.exports = PriceTrack;
