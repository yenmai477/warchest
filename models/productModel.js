const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
    },

    productId: {
      type: String,
      required: [true, 'A product must have a id'],
      // unique: true,
    },
    shopId: {
      type: String,
    },

    site: {
      type: String,
    },
    url: {
      type: String,
      required: [true, 'A product must have a url'],
    },

    // prices: [
    //   {
    //     priceTs: {
    //       type: Date,
    //       default: Date.now(),
    //     },
    //     price: {
    //       type: Number,
    //       min: [0, `The price of product can't be negative `],
    //     },
    //   },
    // ],
    // concurrency: {
    //   type: String,
    //   default: 'VND',
    // },
    // qty: {
    //   type: Number,
    //   default: 0,
    // },
    // isDeal: {
    //   type: Boolean,
    //   default: false,
    // },
    inventoryStatus: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updatedAt: {
      type: Date,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
productSchema.virtual('priceTracks', {
  ref: 'PriceTrack',
  foreignField: 'product',
  localField: '_id',
});

productSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();

  next();
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
