/**
 * Get domain name
 *
 * @param u {string} url
 * @return {string} domain name of url example tiki.vn
 */
const getProvider = u => {
  const url = new URL(u);
  return url.hostname.replace('www.', '');
};

module.exports = {
  getProvider,
};
