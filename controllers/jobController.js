const Product = require('../models/productModel');
const PriceTrack = require('../models/priceTrackModel');
const { loadRules } = require('../utils/config/configProvider');
const { batchOfPromiseAll } = require('../utils/promiseHelper');
const {
  getProductInfoFromUrl,
  parseUrlWithConfig,
} = require('../utils/config/configFetch');

const catchAsync = require('../utils/catchAsync');

exports.startPullInfoJob = catchAsync(async (req, res, next) => {
  const count = await Product.countDocuments();
  const limit = 1000;
  const page = Math.ceil(count / limit);
  const pageArr = Array.from(Array(page).keys());
  const productArr = await batchOfPromiseAll(pageArr, 1, skip =>
    Product.find()
      .skip(skip)
      .limit(limit)
  );

  await batchOfPromiseAll(productArr, 100, products => {
    products = products.map(product => product.toObject());
    return Promise.all(
      products.map(async product => {
        const { url, id } = product;
        const productInfo = await getProductInfoFromUrl(url);

        return await Product.findByIdAndUpdate(id, productInfo, {
          new: true,
          runValidators: true,
        });
      })
    );
  });

  res.status(201).json({
    status: 'success',
  });
});

exports.startPullProductJob = catchAsync(async (req, res, next) => {
  const count = await Product.countDocuments();
  const limit = 1000;
  const page = Math.ceil(count / limit);
  const pageArr = Array.from(Array(page).keys());
  const productArr = await batchOfPromiseAll(pageArr, 1, skip =>
    Product.find()
      .skip(skip)
      .limit(limit)
  );

  const updateProducts = await batchOfPromiseAll(
    productArr,
    100,
    async products => {
      products = products.map(product => product.toObject());

      return Promise.all(
        products.map(async product => {
          const { url, id, site } = product;

          const config = loadRules(site);
          const productData = await parseUrlWithConfig(url, config);

          // newPriceList.push({ price, priceTs: Date.now(), product: id });

          return await Product.findByIdAndUpdate(id, productData, {
            new: true,
          });
        })
      );
    }
  );

  await batchOfPromiseAll(updateProducts, 100, products => {
    products = products.map(product => product.toObject());
    return Promise.all(
      products.map(async product => {
        const { id, price } = product;
        return await PriceTrack.create({
          price,
          priceTs: Date.now(),
          product: id,
        });
      })
    );
  });
  // const prices = await PriceTrack.create(newPriceList);

  res.status(201).json({
    status: 'success',
  });
});
