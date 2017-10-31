const { fetch } = require('./fetch');

function formatInfo(info) {
  return Promise.resolve(info.map(x => {
    return {
      case: x['CaseNo'],
      text: x['Text']
    };
  }));
}

function parseInfo(result) {
  // If there are no messages, the object is either undefined or an empty string
  let info = result['GetInfoMessageResponse']['GetInfoMessageResult']['InfoMessages']['InfoMessage'] || '';
  if (info === '')
    info = [];
  else if (!Array.isArray(info))
    info = [info];
  return Promise.resolve(info);
}

function fetchInfo() {
  const url = 'infoMessage.asp';

  return fetch(url)
  .then(result => parseInfo(result))
  .then(info => formatInfo(info));
}

module.exports = {
  fetchInfo,
  formatInfo,
  parseInfo
};
