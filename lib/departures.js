const {
  fetch
} = require('./fetch');

const {
  searchStops
} = require('./points');

const {
  formatLine
} = require('./line');

function fetchDepartures(query, options) {
  const url = 'stationresults.asp';
  const params = {
    'selpointfrkey': '10001001',
    'selDirection': 0
  };

  options = Object.assign(options || {}, {
    direction: 0
  });

  return searchStops(query).then(stops => {
    const stop = stops[0];
    params['selpointfrkey'] = stop.id;
    params['selDirection'] = options.direction;

    return fetch(url, params)
      .then(result => result['GetDepartureArrivalResponse']['GetDepartureArrivalResult']['Lines']['Line'])
      .then(lines => Promise.resolve(lines.map(formatLine)));
  });
}

module.exports = {
  fetchDepartures
};
