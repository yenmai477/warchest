const axios = require('axios');
const getCrawlerHttpHeaderOptions = require('./headerOption');

/**
 * Node fetch to get json or html
 * @param {string}    url  [description]
 * @param  {Boolean}  json [description]
 * @return {any}      [description]
 */

// FIXME: 04/15/20  Update function return
const fetchContent = async url => {
  try {
    const options = getCrawlerHttpHeaderOptions();
    const response = await axios.get(url, options);

    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = fetchContent;
