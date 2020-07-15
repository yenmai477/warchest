const Product = require('../models/productModel');
const PriceTrack = require('../models/priceTrackModel');
const { getProvider } = require('../utils/urlHelper');
const { loadRules } = require('../utils/config/configProvider');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');
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

exports.aliasSearchProduct = (req, res, next) => {
  if (!req.query.limit) {
    req.query.limit = 18;
  }

  console.log(req.query);

  if (req.query.q) {
    req.query.name = {};
    req.query.name.regex = req.query.q;
  }

  if (req.query.minPrice) {
    req.query.price = {};
    req.query.price.gt = req.query.minPrice;
  }

  if (req.query.maxPrice) {
    if (!req.query.price) {
      req.query.price = {};
    }
    req.query.price.lt = req.query.maxPrice;
  }

  if (req.query.selectSales) {
    req.query.priceLabel = {};
    const selectLabels = `[${req.query.selectSales}]`;
    req.query.priceLabel.in = selectLabels;
  }

  if (req.query.q && req.query.sort) {
    req.query.sort = `-${req.query.sort}`;
  }

  if (req.query.selectSites) {
    req.query.site = {};
    const selectSites = `[${req.query.selectSites}]`;
    req.query.site.in = selectSites;
  }
  ['q', 'minPrice', 'maxPrice', 'selectSites', 'selectSales'].forEach(item => {
    if (req.query[item]) {
      delete req.query[item];
    }
  });

  next();
};
exports.createTest = factory.createOne(Product);
exports.createTestPrice = factory.createOne(PriceTrack);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: 'priceTracks' });
exports.updateProduct = factory.updateOne(Product);
