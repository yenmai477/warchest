const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const apiCall = require('./apiCall');
const connectDB = require('../utils/db');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const PriceTrack = require('../models/priceTrackModel');
const { getProvider } = require('../utils/urlHelper');
const { loadRules } = require('../utils/config/configProvider');

const {
  getProductInfoFromUrl,
  initProductDataFromUrl,
  parseUrlWithConfig,
} = require('../utils/config/configFetch');

const { batchOfPromiseAll } = require('../utils/promiseHelper');

// 1) CONNECT DATABASE
connectDB();

const rawdata = fs.readFileSync('tiki-sach.json');
const data = JSON.parse(rawdata);
console.log(data.length);

const user = '5ec49569ee959237d4783614';
const createData = async data => {
  console.log(data.length);

  for (let index = 0; index < data.length; index++) {
    const url = data[index];
    console.log(data[index]);

    //1. Check product is exists in database
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

    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findOne(query);

    if (product) {
      continue;
    }

    //2. If don't have the product , crawl product info data

    // eslint-disable-next-line no-await-in-loop
    const productInfo = await getProductInfoFromUrl(url);

    // 3. Init price data of product
    // eslint-disable-next-line no-await-in-loop
    let initPrice = await initProductDataFromUrl(url);

    // eslint-disable-next-line no-await-in-loop
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

    // eslint-disable-next-line no-await-in-loop
    const newProduct = await Product.create(crawlProduct);

    // Reference price data to product
    initPrice = initPrice.map(item => ({ ...item, product: newProduct.id }));

    // eslint-disable-next-line no-await-in-loop
    const priceProduct = await PriceTrack.create(initPrice);
  }
};

const postData = async data => {
  await batchOfPromiseAll(data, 5, async url => {
    return await apiCall.post('http://127.0.0.1:8000/api/v1/products', { url });
  });
};

try {
  createData(data);

  console.log('DONE!');
} catch (error) {
  console.log(error);
}
