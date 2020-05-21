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
    price: {
      type: String,
      required: [true, 'A product must have a price'],
    },
    concurrency: {
      type: String,
      default: 'VND',
    },
    qty: {
      type: Number,
      default: 0,
    },
    isDeal: {
      type: Boolean,
      default: false,
    },
    inventoryStatus: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A product must belong to a user!'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    updatedAt: {
      type: Date,
      // select: false,
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

productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email',
  });
  next();
});

productSchema.pre('findOneAndUpdate', function(next) {
  // console.log('this._update)', this._update);
  if (this._update) {
    this._update.updatedAt = Date.now();
  }

  next();
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
