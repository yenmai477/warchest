const Product = require('../models/productModel');
const PriceTrack = require('../models/priceTrackModel');
const { getProvider } = require('../utils/urlHelper');
const { loadRules } = require('../utils/config/configProvider');
const catchAsync = require('../utils/catchAsync');
const {
  getProductInfoFromUrl,
  initProductDataFromUrl,
  parseUrlWithConfig,
} = require('../utils/config/configFetch');

exports.createProduct = catchAsync(async (req, res, next) => {
  const { _id: user, name, email } = req.user;
  //1. Check product is exists in database
  const { url } = req.body;
  const domain = getProvider(url);
  const config = loadRules(domain);
  const productId = config.productId(url);
  const shopId = config.shopId(url);

  // init query to database
  const query = {
    site: domain,
  };
  if (config.required) {
    if (config.required.indexOf('productId') > -1) {
      query.productId = productId;
    }
    if (config.required.indexOf('shopId') > -1) {
      query.shopId = shopId;
    }
  }

  const product = await Product.findOne(query).populate('priceTracks');

  if (product) {
    return res.status(200).json({
      status: 'success',
      data: {
        data: product,
      },
    });
  }

  //2. If don't have the product , crawl product info data

  const productInfo = await getProductInfoFromUrl(url);

  // 3. Init price data of product
  let initPrice = await initProductDataFromUrl(url);

  const productData = await parseUrlWithConfig(url, config);

  const { price } = productData;

  initPrice.push({ price, priceTs: Date.now() });

  const crawlProduct = {
    ...productInfo,
    ...productData,
    shopId,
    productId,
    url,
    site: domain,
    user,
  };

  let newProduct = await Product.create(crawlProduct);

  // Reference price data to product
  initPrice = initPrice.map(item => ({ ...item, product: newProduct.id }));

  const priceProduct = await PriceTrack.create(initPrice);

  newProduct = {
    ...newProduct.toObject(),
    user: {
      _id: user,
      name,
      email,
    },
    priceTrack: priceProduct.map(priceItem => priceItem.toObject()),
  };
  return res.status(201).json({
    status: 'success',
    data: {
      data: newProduct,
    },
  });
});
