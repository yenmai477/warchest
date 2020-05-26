const moment = require('moment');

const dateDiff = (minDate, maxDate) => {
  const diffDuration = moment.duration(moment(maxDate).diff(moment(minDate)));
  const years = diffDuration.years() ? `${diffDuration.years()} năm ` : '';
  const months = diffDuration.months() ? `${diffDuration.months()} tháng ` : '';
  const days = diffDuration.days() ? `${diffDuration.days()} ngày` : '';

  if (!days && !months && !years) {
    return 'Hmm! Có vẻ sản phẩm vừa được thêm vào hệ thống.';
  }
  return `Độ dài của lịch sử giá sản phẩm: ${years}${months}${days}`;
};

module.exports = dateDiff;
