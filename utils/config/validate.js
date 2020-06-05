const { configProvider } = require('./configProvider');
const { getProvider } = require('../urlHelper');

/**
 * @param {*} u
 * validate Rule
 */

const validateUrlPath = u => {
  const domain = getProvider(u);
  const config = configProvider[domain];

  const productId = config.productId(u);
  const shopId = config.shopId(u);

  // console.log(`Parse ${u} => product_id=${productId} shop_id=${shopId}`);

  if (config.required) {
    if (!productId && config.required.indexOf('productId') > -1) return false;
    if (!shopId && config.required.indexOf('shopId') > -1) return false;
  }

  return true;
};

let SUPPORTED_DOMAIN = [];

/**
 * Get supported domain
 *
 * @return {array} List of domain name
 */
const getSupportedDomain = () => {
  if (SUPPORTED_DOMAIN.length) return SUPPORTED_DOMAIN;

  SUPPORTED_DOMAIN = Object.keys(configProvider);

  return SUPPORTED_DOMAIN;
};

module.exports = {
  getSupportedDomain,
  validateUrlPath,
};
