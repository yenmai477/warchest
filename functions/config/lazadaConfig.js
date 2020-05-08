/**
 *
 * @param {*} $ dom element with jQuery
 */
function getLazadaProduct(htmlResult) {
  const product = {};

  // eslint-disable-next-line no-useless-escape
  const regex = /(?<=\<script type=\"application\/ld\+json"\>)(.*?)(?=\<\/script\>)/g;

  const jsonData = htmlResult.match(regex)[0];
  const productCrawl = JSON.parse(jsonData);

  product.currency = 'VND';
  const { name, image, offers } = productCrawl;
  product.name = name;
  product.image = image;
  const { amountFractionNumerator: price } = offers.lowPrice;
  product.price = { date: Date.now(), price };

  return product;
}

module.exports = {
  getLazadaProduct,
};
