const fs = require('fs');

const saveToJson = (filename, content) => {
  fs.writeFileSync(
    `./results/${filename}.json`,
    JSON.stringify(content, null, 4)
  );
};

module.exports = {
  saveToJson
};
