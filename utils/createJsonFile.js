const fs = require('fs').promises;

async function createJsonFile(data, filename = 'test') {
  await fs.writeFile(`./data/${filename}.json`, JSON.stringify(data));
}

module.exports = createJsonFile;
