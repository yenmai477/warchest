const regexProcess = require('../../utils/regex');
const { initData } = require('../../utils/fetchInitProvider');

module.exports = {
  // Basic infomation
  website: 'Shopee',
  domain: 'shopee.vn',
  color: '#ff531d',
  logo: 'https://i.imgur.com/yNu6MC5.png',
  time_check: 15,
  active: true,

  // Get {productId} and {shopId}
  productId: u => regexProcess(u, /-i\.([0-9]+)\.([0-9]+)/, 2),
  shopId: u => regexProcess(u, /-i\.([0-9]+)\.([0-9]+)/, 1),
  required: ['productId', 'shopId'],

  product_api:
    'https://shopee.vn/api/v2/item/get?itemid={product_id}&shopid={shop_id}',

  format_func: json => {
    const { item } = json;
    const { price, itemId, itemStatus, isHotSale } = item;
    const formatPrice = price / 100000;
    const inventoryStatus = itemStatus === 'normal';
    return {
      price: formatPrice,
      isDeal: isHotSale,
      product_id: itemId,
      inventoryStatus,
    };
  },

  product_info_api:
    'https://shopee.vn/api/v2/item/get?itemid={product_id}&shopid={shop_id}',

  format_product_info: json => {
    const info = json.item;
    const image = `https://cf.shopee.vn/file/${info.images[0]}`;
    const { name, description, currency } = info;
    return { name, description, currency, image };
  },

  init_data: async params => {
    return await initData('shopee.vn', params);
  },
};
