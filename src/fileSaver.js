const fs = require('fs');const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const saveToJSON = (filename, content) => {
  fs.writeFileSync(
    `./results/${filename}.json`,
    JSON.stringify(content, null, 4)
  );
};

const saveToCSV = async (filename, content) => {
  const csvWriter = createCsvWriter({
    path: `./results/${filename}.csv`,
    header: content.length ? Object.keys(content[0]).map(item => ({ id: item, title: item })) : []
  });

  return csvWriter.writeRecords(content);
}

module.exports = {
  saveToJSON,
  saveToCSV
};
