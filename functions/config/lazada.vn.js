const regexProcess = require('../../utils/regex');
const fetchContent = require('../../utils/fetchContent');
const { initData } = require('../../utils/fetchInitProvider');

module.exports = {
  website: 'Lazada',
  domain: 'lazada.vn',
  logo: 'https://i.imgur.com/2bm4glz.png',
  color: '#053647',
  time_check: 15,
  active: false,

  // Get {productId} and {shopId}
  productId: u => regexProcess(u, /-i([0-9]+)-/, 1),
  shopId: u => regexProcess(u, /-s([0-9]+)\.html/, 1),
  required: ['productId', 'shopId'],

  product_api: async params => {
    const url = `https://www.lazada.vn/products/i${params.productId}-s${params.shopId}.html`;

    const html = await fetchContent(url);
    if (!html) return false;

    // eslint-disable-next-line no-useless-escape
    const regex = /(?<=\<script type=\"application\/ld\+json"\>)(.*?)(?=\<\/script\>)/g;

    let jsonData = html.match(regex);
    if (!jsonData || !jsonData.length) return {};
    jsonData = jsonData[0];
    const productCrawl = JSON.parse(jsonData);
    const { offers } = productCrawl;

    const { lowPrice: price } = offers;
    return {
      price,
      // productId: params.productId,
    };
  },
  format_func: json => json,

  product_info_api: async params => {
    const url = `https://www.lazada.vn/products/i${params.productId}-s${params.shopId}.html`;
    console.log(url);
    const html = await fetchContent(url);
    if (!html) return false;

    // eslint-disable-next-line no-useless-escape
    const regex = /(?<=\<script type=\"application\/ld\+json"\>)(.*?)(?=\<\/script\>)/g;

    const jsonData = html.match(regex)[0];
    const productCrawl = JSON.parse(jsonData);

    const currency = 'VND';
    const { name, image } = productCrawl;

    return {
      name,
      currency,
      image,
    };
  },
  format_product_info: json => json,

  init_data: async params => {
    return await initData('lazada.vn', params);
  },
};
