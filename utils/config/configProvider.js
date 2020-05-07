const config = require('../../functions/config/index.config');

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
    console.error(`No config rules for ${domain}`);
  }
  return rules;
};

module.exports = {
  loadRules,
  configProvider,
};
