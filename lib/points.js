const {
  fetch
} = require('./fetch');

const {
  formatNumber
} = require('./utilities');

const POINT_TYPES = {
  'POI': 'point of interest',
  'ADDRESS': 'address',
  'STOP_AREA': 'stop'
};

function formatPoints(points) {
  const formattedPoints = [];

  for (const point of points) {
    const formattedPoint = {
      id: point['Id'],
      name: point['Name'],
      type: POINT_TYPES[point['Type'] || 'STOP_AREA'],
      coordinates: {
        latitude: formatNumber(point['X']),
        longitude: formatNumber(point['Y'])
      },
      distance: formatNumber(point['Distance'])
    };

    formattedPoints.push(formattedPoint);
  }

  return Promise.resolve(formattedPoints);
}

function filterPoints(points, filter) {
  const filteredPoints = points.filter(point => {
    if (filter.length === 0)
      return true;
    return filter.includes(point.type);
  });

  return Promise.resolve(filteredPoints);
}

function searchPoints(query, options) {
  const url = 'querypage.asp';
  const params = {
    type: 4,  // Value does not seem to matter and seems to be optional
    inppointto: 'foobar', // Value does not matter but has to be include
    inppointfr: query
  };

  /* Available filters:
    POI / point of interest
    ADDRESS / address
    STOP_AREA / stop
  */

  options = Object.assign({
    filter: []
  }, options);

  return fetch(url, params)
  .then(result => result['GetStartEndPointResponse']['GetStartEndPointResult']['StartPoints']['Point'])
  .then(points => formatPoints(points))
  .then(points => filterPoints(points, options.filter));
}

// Either a text or an object {x:, y:}
function searchStops(query) {
  const url = 'neareststation.asp';
  const params = {
    x: NaN,
    y: NaN
  };

  const options = {
    filter: ['stop']
  };

  if (query.x && query.y) {
    params.x = query.x;
    params.y = query.y;

    return fetch(url, params)
    .then(result => result['GetNearestStopAreaResponse']['GetNearestStopAreaResult']['NearestStopAreas']['NearestStopArea'])
    .then(points => formatPoints(points))
    .then(points => filterPoints(points, options.filter));
  }

  return searchPoints(query, options);
}

module.exports = {
  searchPoints,
  searchStops,
  formatPoints,
  filterPoints
};
