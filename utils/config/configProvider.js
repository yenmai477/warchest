const config = require('../../functions/config/index.config');
const AppError = require('../appError');

/**
 *  return config for all domain
 */
const configProvider = () => config;

/**
 * @param {*} domain
 * return config for domain
 */
const loadRules = domain => {
  const configs = configProvider();
  const rules = configs[domain];

  // TODO: 04/15/20 Handle no rules for domain
  if (!rules) {
    throw new AppError(
      `Trang web hiện tại chưa hỗ trợ cho trang ${domain}`,
      400
    );
  }
  return rules;
};

module.exports = {
  loadRules,
  configProvider,
};
