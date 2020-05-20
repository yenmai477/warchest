const { initData } = require('../../utils/fetchInitProvider');
const regexProcess = require('../../utils/regex');

module.exports = {
  website: 'Tiki',
  domain: 'tiki.vn',
  color: '#189eff',
  logo: 'https://i.imgur.com/Tqa8FCc.png',
  time_check: 15,
  active: true,

  // Get {productId} and {shopId}
  productId: u => regexProcess(u, /-p([0-9]+)/, 1),
  shopId: u => {
    try {
      const parsed = new URL(u);
      const spid = parsed.searchParams.get('spid');
      if (spid !== null) return spid;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  required: ['productId'],

  product_api: 'https://tiki.vn/api/v2/products/{product_id}?spid={shop_id}',

  format_func: json => {
    const {
      price,
      is_deal: isDeal,
      qty,
      // product_id: productId,
      inventory_status: inventoryStatus,
    } = json;
    const fmStatus = inventoryStatus === 'available';

    return {
      price,
      isDeal,
      qty,
      // productId,
      inventoryStatus: fmStatus,
    };
  },

  // TODO: rename this attr
  /**
   * params {url, productId, shopId}
   */
  // product_info_api: async params => {
  //   const { url } = params;
  //   const html = await request.get(url);
  //   if (!html) return false;
  //   const $ = await cheerio.load(html);

  //   const name = $('#product-name')
  //     .text()
  //     .trim();
  //   const image = $('.product-image img')
  //     .first()
  //     .attr('src');
  //   const description = $('.top-feature-item')
  //     .text()
  //     .trim();
  //   const currency = 'VND';
  //   return {
  //     name,
  //     description,
  //     currency,
  //     image,
  //   };
  // },
  product_info_api:
    'https://tiki.vn/api/v2/products/{product_id}?spid={shop_id}',
  format_product_info: json => {
    const {
      short_description: description,
      configurable_products: configProducts,
    } = json;

    let { name, thumbnail_url: image } = json;

    const currency = 'VND';

    // 1. If product don't have variants
    if (configProducts && configProducts.length) {
      // Find variants of product
      const variant = configProducts.find(item => item.selected);

      // Update name and image
      ({ name, thumbnail_url: image } = variant);
    }

    return {
      name,
      currency,
      description,
      image,
    };
  },

  init_data: async params => {
    return await initData('tiki.vn', params);
  },
};
