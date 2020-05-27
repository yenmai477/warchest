const dateDiff = require('./dateDiff');

const priceComment = ({
  minDate,
  maxDate,
  minPrice,
  maxPrice,
  avgPrice,
  currentPrice,
  countPrice,
}) => {
  const { years, months } = dateDiff(minDate, maxDate, false);
  if (countPrice < 3 || (!years && months < 1)) {
    return 'Không có nhận xét nào thú vị dành cho bạn, hãy quay lại sau nhé!';
  }
  if (minPrice === maxPrice) {
    return 'Một sản phẩm có giá vô cùng bền bĩ, nếu đã yêu thích thì có lẽ không nên ngần ngại.';
  }
  if (currentPrice === maxPrice) {
    return 'Giá sản phẩm đang ở mức cao nhất, có lẽ nên đợi đến khi giá giảm bớt để mua.';
  }

  if (currentPrice === minPrice) {
    return 'Giá sản phẩm đang ở mức thấp nhất, ngần ngại gì mà không mua bạn nhỉ.';
  }

  if (currentPrice <= 1.05 * avgPrice || currentPrice >= 0.95 * avgPrice) {
    return 'Giá sản phẩm đang ở rất gần mức giá trung bình, mua lúc này có lẽ là quyết định không tệ.';
  }
  if (currentPrice > 1.05 * avgPrice) {
    return 'Giá sản phẩm đang khá cao, có lẽ nên xem xét việc mua trừ khi đây là sản phẩm hot.';
  }
  return 'Giá sản phẩm đang ở mức rất tốt đừng ngần ngại nếu muốn mua bạn nhé';
};

const addLabelPrice = ({
  minPrice,
  maxPrice,
  minDate,
  maxDate,
  currentPrice,
}) => {
  const { years, months } = dateDiff(minDate, maxDate, false);
  if ((!years && months < 1) || minPrice === maxPrice) return null;
  const goodPrice = minPrice * 1.05;
  const badPrice = 0.95 * maxPrice;
  if (currentPrice === minPrice) return 'Sale xịn';
  if (currentPrice <= goodPrice) {
    return 'Sale tốt';
  }
  if (currentPrice >= badPrice) {
    return 'Sale ảo';
  }
};
module.exports = { priceComment, addLabelPrice };
