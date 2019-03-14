const axios = require('axios');
const parseXML = require('xml2js').parseString;

const ENDPOINT = 'https://www.iphone.fskab.se/version3/';

function checkApiStatus(content) {
  // The API's error code is nested within the first child of the first child, both with different names for each API call
  // Note that not all API calls return a code as handled by the first if case
  const firstChild = content[Object.keys(content)[0]];
  const firstGrandChild = firstChild[Object.keys(firstChild)[0]];

  if (!firstGrandChild['Code'] || firstGrandChild['Code'] === '0')
    return Promise.resolve(content);
  if (firstGrandChild['Code'] === '202')
    return Promise.reject(new Error('Query should be at least 2 characters long'));
  if (firstGrandChild['Code'] === '99')
    return Promise.reject(new Error('Server timeout'));
  if (firstGrandChild['Code'] === '260')
    return Promise.reject(new Error('Travel date is outside the database\'s range'));
  if (firstGrandChild['Code'] === '320')
    return Promise.reject(new Error('The stop point id was incorrect'));
  if (firstGrandChild['Code'] === '404')
    return Promise.reject(new Error('The API endpoint was not found'));
  return Promise.reject(new Error(`Unknown API endpoint error. Check your parameters and try again. Full error: ${firstGrandChild['Code']}: ${firstGrandChild['Message']}`));
}

function parseResult(response) {
  const options = {
    explicitArray: false,
    ignoreAttrs: true
  };

  return new Promise((resolve, reject) => {
    parseXML(response.data, options, (error, result) => {
      if (error)
        return reject(new Error('Could not parse API response'));

      const content = result['soap:Envelope']['soap:Body'];

      resolve(content);
    });
  });
}

function fetch(url, params) {
  params = Object.assign({
    lang: 'sv',
    customer: 'bl'
  }, params);

  return axios.get(ENDPOINT + url, {params})
    .then(parseResult)
    .then(checkApiStatus);
}

module.exports = {
  fetch,
  parseResult,
  checkApiStatus
};
