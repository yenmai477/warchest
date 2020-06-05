const regexProcess = require('../../utils/regex');
const { initData } = require('../../utils/fetchInitProvider');

module.exports = {
  // Basic infomation
  website: 'Sendo',
  domain: 'sendo.vn',
  color: '#ff531d',
  logo: 'https://i.imgur.com/yNu6MC5.png',
  time_check: 15,
  active: true,

  // Get {productId} and {shopId}
  productId: u => {
    const url = new URL(u);
    const { pathname } = url;
    const productId = pathname.replace('.html', '').replace('/', '');
    return productId;
  },
  shopId: u => null,
  required: ['productId'],

  product_api:
    'https://www.sendo.vn/m/wap_v2/full/san-pham/{product_id}?platform=web',

  format_func: json => {
    const { data: item } = json.result;
    const { price, url_key: itemId, quantity } = item;

    const inventoryStatus = !!quantity;
    return {
      price: price,
      // productId: itemId,
      inventoryStatus,
    };
  },

  product_info_api:
    'https://www.sendo.vn/m/wap_v2/full/san-pham/{product_id}?platform=web',

  format_product_info: json => {
    const { data: item } = json.result;
    const { name, description, media } = item;
    const image = media && media.length ? media[0].image : null;
    const currency = 'VND';
    return { name, description, currency, image };
  },

  init_data: async params => {
    return await initData('sendo.vn', params);
  },
};
