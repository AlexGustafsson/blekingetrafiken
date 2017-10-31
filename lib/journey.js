const moment = require('moment');

const { fetch } = require('./fetch');
const { formatLine } = require('./line');
const { searchStops } = require('./points');
const { formatNumber } = require('./utilities');

function formatJourneys(journeys, from, to) {
  const formattedJourneys = [];

  for (const journey of journeys) {
    const formattedJourney = {
      departure: journey['DepDateTime'],
      arrival: journey['ArrDateTime'],
      walkDistance: {
        departure: formatNumber(journey['DepWalkDist']),
        arrival: formatNumber(journey['ArrWalkDist'])
      },
      changes: formatNumber(journey['NoOfChanges']),
      zones: formatNumber(journey['NoOfZones']),
      zoneName: journey['PriceZoneNamesList'],
      guaranteed: journey['Guaranteed'] === 'true',
      co2Factor: formatNumber(journey['CO2factor']),
      co2Value: formatNumber(journey['CO2value']),
      prices: {
        adult: formatNumber(journey['Prices']['PriceInfo'][0]['Price']),
        youth: formatNumber(journey['Prices']['PriceInfo'][1]['Price']),
        family: formatNumber(journey['Prices']['PriceInfo'][2]['Price'])
      },
      discountedPrices: {
        adult: formatNumber(journey['Prices']['PriceInfo'][3]['Price']),
        youth: formatNumber(journey['Prices']['PriceInfo'][4]['Price']),
        family: formatNumber(journey['Prices']['PriceInfo'][5]['Price'])
      },
      routeLinks: [],
      distance: formatNumber(journey['Distance'])
    };

    const parent = journey['RouteLinks'] || {};
    let links = parent['RouteLink'] || [];
    if (!Array.isArray(links))
      links = [links];
    for (const link of links) {
      const formattedLink = {
        departure: link['DepDateTime'],
        arrival: link['ArrDateTime'],
        onSchedule: {
          arrival: link['ArrIsTimingPoint'] === 'true',
          department: link['DepIsTimingPoint'] === 'true'
        },
        realTime: {
          timeDeviation: {
            arrival: NaN,
            departure: NaN
          },
          effect: {
            arrival: null,
            departure: null
          }
        },
        from: {
          id: link['From']['Id'],
          name: link['From']['Name'],
          stopPoint: link['From']['StopPoint'],
          stopPointCoordinates: {
            latitude: formatNumber(link['From']['StopPointX']),
            longitude: formatNumber(link['From']['StopPointY'])
          },
          coordinates: {
            latitude: formatNumber(link['From']['X']),
            longitude: formatNumber(link['From']['Y'])
          }
        },
        to: {
          id: link['To']['Id'],
          name: link['To']['Name'],
          stopPoint: link['To']['StopPoint'],
          stopPointCoordinates: {
            latitude: formatNumber(link['To']['StopPointX']),
            longitude: formatNumber(link['To']['StopPointY'])
          },
          coordinates: {
            latitude: formatNumber(link['To']['X']),
            longitude: formatNumber(link['To']['Y'])
          }
        },
        line: formatLine(link['Line'])
      };

      if (link['RealTime']) {
        formattedLink.realTime = {
          deviation: {
            arrival: formatNumber(link['RealTime']['RealTimeInfo']['ArrTimeDeviation']),
            departure: formatNumber(link['RealTime']['RealTimeInfo']['DepTimeDeviation'])
          },
          effect: {
            arrival: link['RealTime']['RealTimeInfo']['ArrDeviationAffect'],
            departure: link['RealTime']['RealTimeInfo']['DepDeviationAffect']
          }
        };
      }
      formattedJourney.routeLinks.push(formattedLink);
    }

    formattedJourneys.push(Object.assign(formattedJourney, {from, to}));
  }

  return Promise.resolve(formattedJourneys);
}

function searchJourneys(from, to, options) {
  const url = 'resultspage.asp';
  const params = {
    transportMode: '4095',
    selWalkSpeed: '0',
    chkWalkToOtherStop: '0',
    selDirection: '0',
    NoOf: '10',
    alt: '2',
    cmdaction: 'search',
    selpointto: '|10001001|0',
    selpointfr: '|10001041|0',
    selPriority: '0',
    selChangeTime: '0',
    customer: 'bl',
    lang: 'sv'
  };

  options = Object.assign({
    date: moment().toDate(),
    time: moment().toDate()
  }, options);

  if (options.date instanceof Date)
    options.date = moment(options.date).format('YYMMDD');
  else if (typeof options.date === 'string')
    options.date = moment(new Date(options.date)).format('YYMMDD');

  if (options.time instanceof Date)
    options.time = moment(options.time).format('HHmm');
  else if (typeof options.time === 'string')
    options.time = moment(new Date(options.time)).format('HHmm');

  if (options.date === 'Invalid date' || options.time === 'Invalid date')
    return Promise.reject(new Error('Invalid date or time given'));

  let searchPromise = Promise.resolve([{id: from}, {id: to}]);

  if (typeof from === 'string' && typeof to === 'string')
    searchPromise = Promise.all([searchStops(from), searchStops(to)]);

  return searchPromise.then(stops => {
    const stopA = stops[0][0];
    const stopB = stops[1][0];

    // Format as used by Blekingetrafiken
    params['selpointto'] = `|${stopA.id}|0`;
    params['selpointfr'] = `|${stopB.id}|0`;
    params['inpTime'] = options.time;
    params['inpDate'] = options.date;

    return fetch(url, params)
    .then(result => result['GetJourneyResponse']['GetJourneyResult']['Journeys']['Journey'])
    .then(journeys => formatJourneys(journeys, stopA, stopB));
  });
}

module.exports = {
  searchJourneys,
  formatJourneys
};
