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
      type: Number,
      required: [true, 'A product must have a price'],
    },
    minPrice: {
      type: Number,
    },
    maxPrice: {
      type: Number,
    },
    avgPrice: {
      type: Number,
      set: val => Math.round(val * 100) / 100, // 4.666666, 466.666, 467, 4.67
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
    historyRange: {
      type: String,
      default: 'Hmm! Có vẻ sản phẩm vừa được thêm vào hệ thống.',
    },
    priceAnalysis: {
      type: String,
    },
    priceLabel: { type: String },
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
