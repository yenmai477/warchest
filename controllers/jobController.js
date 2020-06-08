const util = require('util');
const Product = require('../models/productModel');
const PriceTrack = require('../models/priceTrackModel');
const { loadRules } = require('../utils/config/configProvider');
const { runAllPromise } = require('../utils/promiseHelper');
const {
  getProductInfoFromUrl,
  parseUrlWithConfig,
} = require('../utils/config/configFetch');

const catchAsync = require('../utils/catchAsync');

const sleep = util.promisify(setTimeout);
// Up một ngày 100 - 200 thằng cũ nhất thôi
exports.startPullInfoJob = catchAsync(async (req, res, next) => {
  const limit = 20;
  const products = await Product.find()
    .sort('updatedAt')
    .limit(limit);

  await runAllPromise(products, 5, async product => {
    await sleep(1000);
    const { url, id } = product;
    const productInfo = await getProductInfoFromUrl(url);

    return await Product.findByIdAndUpdate(id, productInfo, {
      new: true,
      runValidators: true,
    });
  });

  res.status(200).json({
    status: 'success',
  });
});

exports.startPullProductJob = catchAsync(async (req, res, next) => {
  const limit = 10;

  const products = await Product.find()
    .sort('updatedAt')
    .limit(limit);

  const updateProducts = await runAllPromise(products, 5, async product => {
    await sleep(1000);
    const { url, id, site, name } = product;
    console.log('exports.startPullProductJob -> name', name);

    const config = loadRules(site);
    const productData = await parseUrlWithConfig(url, config);

    // newPriceList.push({ price, priceTs: Date.now(), product: id });

    return await Product.findByIdAndUpdate(id, productData, {
      new: true,
    });
  });

  await runAllPromise(updateProducts, 100, async product => {
    const { id, price } = product;
    return await PriceTrack.create({
      price,
      priceTs: Date.now(),
      product: id,
    });
  });
  // const prices = await PriceTrack.create(newPriceList);

  res.status(200).json({
    status: 'success',
  });
});
