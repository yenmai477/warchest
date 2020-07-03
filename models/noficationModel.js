const mongoose = require('mongoose');

const noficationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A nofication must belong to a user!'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'A nofication must belong to a user!'],
    },
    noficationId: {
      type: String,
    },
    email: {
      type: Boolean,
    },
    expectedPrice: {
      type: Number,
      required: [true, 'A nofication must have a expected price!'],
    },
    pushNofication: {
      type: Boolean,
      validator: function(el) {
        if (!this.noficationId && el) return false;
        return true;
      },
    },
    active: {
      type: Boolean,
      default: true,
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

noficationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'product',
    select: 'price name',
  });
  next();
});

const Nofication = mongoose.model('Nofication', noficationSchema);

module.exports = Nofication;
