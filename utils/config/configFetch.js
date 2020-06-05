const axios = require('axios');
const { getProvider } = require('../urlHelper');
const { loadRules } = require('./configProvider');
const fetchContent = require('../fetchContent');
const getCrawlerHttpHeaderOptions = require('../headerOption');

/**
 * Init product data from URL
 *
 * @param u {string} url
 * @return {object}
 */
const initProductDataFromUrl = async u => {
  const domain = getProvider(u);
  const config = loadRules(domain);
  if (!config || !config.init_data) return null;

  const productId = config.productId(u);
  const shopId = config.shopId(u);

  const params = {
    url: u,
    productId,
    shopId,
  };
  return await config.init_data(params);
};

/**
 * Get product info from URL
 *
 * @param u {string} url
 * @return {object}
 */
const getProductInfoFromUrl = async u => {
  const domain = getProvider(u);
  const config = loadRules(domain);

  const productId = config.productId(u);

  const shopId = config.shopId(u);

  // Using API
  if (typeof config.product_info_api === 'string') {
    const productInfoApi = config.product_info_api
      .replace('{product_id}', productId)
      .replace('{shop_id}', shopId);

    if (!productId) {
      return false;
    }

    const data = await fetchContent(productInfoApi);
    return config.format_product_info(data);
  }

  // Using functions
  if (typeof config.product_info_api === 'function') {
    const getFunc = config.product_info_api;
    const params = {
      url: u,
      productId,
      shopId,
    };
    const data = await getFunc(params);
    return config.format_product_info(data);
  }

  console.error('config.product_info_api is not supported');
  return {};
};

/**
 * Parse URL by config
 *
 * @param u {string}
 * @param config {object}
 * @param cb {Function}
 * @param cb_error {Function}
 */

// eslint-disable-next-line no-shadow
const parseUrlWithConfig = async (u, config) => {
  const productId = config.productId(u);
  const shopId = config.shopId(u);

  if (config.required) {
    if (
      (!productId && config.required.indexOf('productId') > -1) ||
      (!shopId && config.required.indexOf('shopId') > -1)
    )
      throw Error('Cannot get productId or shopId, which required!');
  }

  // product_api: https:// .....{productId}/{shopId}
  if (typeof config.product_api === 'string') {
    const productApi = config.product_api
      .replace('{product_id}', productId)
      .replace('{shop_id}', shopId);

    const options = getCrawlerHttpHeaderOptions();
    const response = await axios(productApi, options);
    const { data: json } = response;
    return config.format_func(json);
  }

  // Using functions
  if (typeof config.product_api === 'function') {
    const getFunc = config.product_api;
    const params = {
      url: u,
      productId,
      shopId,
    };
    const json = await getFunc(params);
    return config.format_func(json);
  }

  throw Error('config.product_info_api is not supported');
};

module.exports = {
  initProductDataFromUrl,
  getProductInfoFromUrl,
  parseUrlWithConfig,
};
