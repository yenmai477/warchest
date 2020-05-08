/* eslint-disable no-restricted-syntax */
const fetchContent = require('./fetchContent');

const DomainId = {
  'shopee.vn': 1,
  'lazada.vn': 2,
  'tiki.vn': 3,
};

// Init link Shopee https://www.beecost.com/san-pham-pbid.1__2348490497__103987827.html
// Init link tiki https://www.beecost.com/san-pham-pbid.3__28739841__28739851.html

const initData = async (domain, params) => {
  const url = `https://apiv2.beecost.com/ecom/product/history?product_base_id=${DomainId[domain]}__${params.productId}__${params.shopId}`;
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
