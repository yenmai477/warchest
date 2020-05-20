const Product = require('../models/productModel');
const PriceTrack = require('../models/priceTrackModel');
const { loadRules } = require('../utils/config/configProvider');
const {
  getProductInfoFromUrl,
  parseUrlWithConfig,
} = require('../utils/config/configFetch');

const catchAsync = require('../utils/catchAsync');

exports.startPullInfoJob = catchAsync(async (req, res, next) => {
  let products = await Product.find();
  products = products.map(product => product.toObject());

  await Promise.all(
    products.map(async product => {
      const { url, id } = product;
      const productInfo = await getProductInfoFromUrl(url);

      return await Product.findByIdAndUpdate(id, productInfo, {
        new: true,
        runValidators: true,
      });
    })
  );

  res.status(201).json({
    status: 'success',
  });
});

exports.startPullProductJob = catchAsync(async (req, res, next) => {
  let products = await Product.find();
  products = products.map(product => product.toObject());

  const newPriceList = [];

  const productList = await Promise.all(
    products.map(async product => {
      const { url, id, site } = product;

      const config = loadRules(site);
      const productData = await parseUrlWithConfig(url, config);

      const { price } = productData;

      newPriceList.push({ price, priceTs: Date.now(), product: id });

      return await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });
    })
  );

  const prices = await PriceTrack.create(newPriceList);

  res.status(201).json({
    status: 'success',
    productList,
    prices,
  });
});
