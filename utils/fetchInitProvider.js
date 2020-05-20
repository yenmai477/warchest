/* eslint-disable no-restricted-syntax */
const fetchContent = require('./fetchContent');

const DomainId = {
  'shopee.vn': 1,
  'lazada.vn': 2,
  'tiki.vn': 3,
  'sendo.vn': 4,
};

const initData = async (domain, params) => {
  const { shopId = 'NULL' } = params;
  let { productId } = params;

  // Get Real productId from slug sendo
  if (domain === 'sendo.vn' && productId) {
    productId = productId.split('-').splice(-1);
  }
  let url = `https://apiv2.beecost.com/ecom/product/history?product_base_id=${DomainId[domain]}__${productId}`;

  if (domain !== 'sendo.vn') {
    url += `__${shopId}`;
  }
  console.log(`fetch data from ${url}`);
  const json = await fetchContent(url);
  if (!json) return null;
  if (json.status === 'error') return [];

  // if (priceTs.length === 0 || price.length === 0) return null;
  const { price_ts: priceTs, price } = json.data.item_history;

  //merge two arrays by index
  const priceArr = priceTs.map((time, index) => ({
    price: price[index],
    priceTs: time,
  }));

  return priceArr;
};

module.exports = {
  initData,
};
