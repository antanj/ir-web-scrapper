const axios = require('axios');

const getPage = async (url, query = {}) => {
  return axios.get(url, { params: query });
};

module.exports = {
  getPage
};
