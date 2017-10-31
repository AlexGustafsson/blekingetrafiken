const test = require('ava').test;

const moment = require('moment');

const {
  searchJourneys,
  formatJourneys
} = require('../lib/journey');

test('Can format journeys', async t => {
  const testCase = {
    input: {
      'SequenceNo': '0',
      'DepDateTime': '2017-10-30T10:50:00',
      'ArrDateTime': '2017-10-30T11:02:00',
      'DepWalkDist': '0',
      'ArrWalkDist': '0',
      'NoOfChanges': '0',
      'Guaranteed': 'true',
      'CO2factor': '10',
      'NoOfZones': '1',
      'PriceZoneList': '10000610',
      'FareType': 'Normaltaxa',
      'Prices': {
        'PriceInfo': [
          {
            'PriceType': 'Kontant Vuxen',
            'Price': '24',
            'VAT': '1.35849059',
            'JourneyTicketKey': 'JK15413967303272816600001'
          },
          {
            'PriceType': 'Kontant Skolungdom',
            'Price': '14',
            'VAT': '0.7924528',
            'JourneyTicketKey': 'JK15413967303272816600011'
          },
          {
            'PriceType': 'Kontant Duo/Familj',
            'Price': '43',
            'VAT': '2.43396235',
            'JourneyTicketKey': 'JK15413967303272816600026'
          },
          {
            'PriceType': 'Rabatt Vuxen',
            'Price': '19.2',
            'VAT': '1.08679247',
            'JourneyTicketKey': 'JK15413967303272816600032'
          },
          {
            'PriceType': 'Rabatt Skolungdom',
            'Price': '11.2',
            'VAT': '0.6339623',
            'JourneyTicketKey': 'JK15413967303272816600043'
          },
          {
            'PriceType': 'Rabatt Duo/Familj',
            'Price': '34.4',
            'VAT': '1.9471699',
            'JourneyTicketKey': 'JK15413967303272816600053'
          },
          {
            'PriceType': 'Periodkort Vuxen',
            'Price': '459',
            'VAT': '25.9811325',
            'JourneyTicketKey': 'JK15413967303272816600061'
          },
          {
            'PriceType': 'Periodkort Skolungdom',
            'Price': '459',
            'VAT': '25.9811325',
            'JourneyTicketKey': 'JK15413967303272816600078'
          },
          {
            'PriceType': 'Periodkort Duo/Familj',
            'Price': '469',
            'VAT': '26.54717',
            'JourneyTicketKey': 'JK15413967303272816600081'
          }
        ]
      },
      'JourneyKey': '16148040215035100199800012400140021',
      'RouteLinks': {
        'RouteLink': [
          {
            'RouteLinkKey': '16148040215035100199800012400140021',
            'DepDateTime': '2017-10-30T10:50:00',
            'DepIsTimingPoint': 'true',
            'ArrDateTime': '2017-10-30T11:02:00',
            'ArrIsTimingPoint': 'true',
            'CallTrip': 'false',
            'PriceZones': {
              'PriceZone': {
                'Id': '10000610'
              }
            },
            'RealTime': {
              'RealTimeInfo': {
                'DepTimeDeviation': '5',
                'DepDeviationAffect': 'PASSED',
                'ArrTimeDeviation': '6',
                'ArrDeviationAffect': 'CRITICAL'
              }
            },
            'From': {
              'Id': '10001041',
              'Name': 'Amiralen Lyckeby',
              'StopPoint': 'A',
              'StopPointX': '6229902',
              'StopPointY': '1490012',
              'X': '6229909',
              'Y': '1490019'
            },
            'To': {
              'Id': '10001001',
              'Name': 'Kungsplan Karlskrona',
              'StopPoint': 'I',
              'StopPointX': '6226326',
              'StopPointY': '1486395',
              'X': '6226391',
              'Y': '1486432'
            },
            'Line': {
              'Name': '6',
              'No': '10000006',
              'RunNo': '31',
              'LineTypeId': '1',
              'LineTypeName': 'Stadsbuss',
              'TransportModeId': '2',
              'TransportModeName': 'Stadsbuss/tätortstrafik',
              'TrainNo': '0',
              'Towards': 'Centrum',
              'OperatorId': '15',
              'OperatorName': 'Bergkvarabuss Öst'
            },
            'Deviations': '',
            'Accessibility': '1'
          }
        ]
      },
      'Distance': '6352',
      'CO2value': '0',
      'SalesRestriction': '',
      'PriceZoneNamesList': 'Karlskrona tätort',
      'StartEndBigZoneList': '|'
    },
    output: {
      departure: '2017-10-30T10:50:00',
      arrival: '2017-10-30T11:02:00',
      walkDistance: {
        departure: 0,
        arrival: 0
      },
      changes: 0,
      zones: 1,
      zoneName: 'Karlskrona tätort',
      guaranteed: true,
      co2Factor: 10,
      co2Value: 0,
      prices: {
        adult: 24,
        youth: 14,
        family: 43
      },
      discountedPrices: {
        adult: 19.2,
        youth: 11.2,
        family: 34.4
      },
      from: undefined,
      to: undefined,
      routeLinks: [
        {
          departure: '2017-10-30T10:50:00',
          arrival: '2017-10-30T11:02:00',
          onSchedule: {
            arrival: true,
            department: true
          },
          realTime: {
            deviation: {
              arrival: 6,
              departure: 5
            },
            effect: {
              arrival: 'CRITICAL',
              departure: 'PASSED'
            }
          },
          from: {
            id: '10001041',
            name: 'Amiralen Lyckeby',
            stopPoint: 'A',
            stopPointCoordinates: {
              latitude: 6229902,
              longitude: 1490012
            },
            coordinates: {
              latitude: 6229909,
              longitude: 1490019
            }
          },
          to: {
            id: '10001001',
            name: 'Kungsplan Karlskrona',
            stopPoint: 'I',
            stopPointCoordinates: {
              latitude: 6226326,
              longitude: 1486395
            },
            coordinates: {
              latitude: 6226391,
              longitude: 1486432
            }
          },
          line: {
            name: '6',
            run: 31,
            type: 'Stadsbuss',
            modeId: 2,
            modeName: 'Stadsbuss/tätortstrafik',
            trainNumber: 0,
            towards: 'Centrum',
            operatorId: 15,
            operatorName: 'Bergkvarabuss Öst',
            onSchedule: false,
            stopPoint: null,
            realTime: {
              deviation: NaN,
              effect: null
            }
          }
        }
      ],
      distance: 6352
    }
  };

  const result = await formatJourneys([testCase.input]);

  const isArray = Array.isArray(result);
  t.true(isArray);

  if (isArray) {
    t.is(result.length, 1);
    t.deepEqual(result, [testCase.output]);
  }
});

test('Can fetch journeys', async t => {
  let result = null;
  try {
    result = await searchJourneys('Kungsmarken', 'Amiralen');
  } catch (error) {
    return t.fail(error);
  }

  t.true(Array.isArray(result));
});

test('Can\'t fetch journeys with faulty options', async t => {
  const result = await t.throws(searchJourneys(null, null, {date: 'foo', time: 'bar'}));
  t.is(result.message, 'Invalid date or time given');
});

test('Can fetch journeys date options', async t => {
  let result = null;
  try {
    result = await searchJourneys('Kungsmarken', 'Amiralen', {date: moment().toDate(), time: moment().toDate()});
  } catch (error) {
    return t.fail(error);
  }

  t.true(Array.isArray(result));
});

test('Can fetch journeys string date options', async t => {
  let result = null;
  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    result = await searchJourneys('Kungsmarken', 'Amiralen', {date, time});
  } catch (error) {
    return t.fail(error);
  }

  t.true(Array.isArray(result));
});
