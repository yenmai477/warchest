const Product = require('../models/productModel');
const PriceTrack = require('../models/priceTrackModel');
const { getProvider } = require('../utils/urlHelper');
const { loadRules } = require('../utils/config/configProvider');
const {
  getProductInfoFromUrl,
  initProductDataFromUrl,
  parseUrlWithConfig,
} = require('../utils/config/configFetch');

exports.createOne = async (req, res) => {
  const doc = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
};

exports.createProductInfo = async (req, res) => {
  //1. Check product is exists in database
  const { url } = req.body;
  const domain = getProvider(url);
  const config = loadRules(domain);
  const productId = config.productId(url);
  const shopId = config.shopId(url);
  const product = await Product.findOne({
    productId: productId,
    shopId: shopId,
    site: domain,
  }).populate('priceTracks');

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
  delete productData.price;

  initPrice.push({ price, priceTs: Date.now() });

  const crawlProduct = {
    ...productInfo,
    ...productData,
    shopId,
    productId,
    url,
    site: domain,
  };

  const newProduct = await Product.create(crawlProduct);
  console.log('exports.createProductInfo -> newProduct', newProduct);

  // Reference price data to product
  initPrice = initPrice.map(item => ({ ...item, product: newProduct.id }));

  const priceProduct = await PriceTrack.create(initPrice);

  // newProduct = { ...newProduct, priceTrack: priceProduct };
  return res.status(201).json({
    status: 'success',
    data: {
      data: newProduct,
    },
  });
};
