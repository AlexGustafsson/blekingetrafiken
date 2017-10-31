const test = require('ava').test;

const {
  formatLine
} = require('../lib/line');

test('Can format fully defined line', async t => {
  const testCase = {
    input: {
      'Name': '2',
      'No': '10000002',
      'JourneyDateTime': '2017-06-13T11:03:00',
      'IsTimingPoint': 'true',
      'StopPoint': 'A',
      'RouteLinkKey': '31579040241036100125800006400150015',
      'RunNo': '43',
      'LineTypeId': '1',
      'LineTypeName': 'Stadsbuss',
      'TransportModeId': '2',
      'TransportModeName': 'Stadsbuss/tätortstrafik',
      'RealTime': {
        'RealTimeInfo': {
          'DepTimeDeviation': '0',
          'DepDeviationAffect': 'NONE'
        }
      },
      'TrainNo': '0',
      'Deviations': '',
      'Towards': 'Centrum',
      'OperatorId': '20',
      'OperatorName': 'Bergkvarabuss Öst',
      'OperatorCode': '20'
    },
    output: {
      name: '2',
      run: 43,
      type: 'Stadsbuss',
      modeId: 2,
      modeName: 'Stadsbuss/tätortstrafik',
      trainNumber: 0,
      towards: 'Centrum',
      operatorId: 20,
      operatorName: 'Bergkvarabuss Öst',
      onSchedule: true,
      stopPoint: 'A',
      realTime: {
        deviation: 0,
        effect: 'NONE'
      }
    }
  };

  const result = await formatLine(testCase.input);

  t.deepEqual(result, testCase.output);
});

test('Can format less defined line', async t => {
  const testCase = {
    input: {
      'Name': '2',
      'No': '10000002',
      'JourneyDateTime': '2017-06-13T11:03:00',
      'IsTimingPoint': 'true',
      'RouteLinkKey': '31579040241036100125800006400150015',
      'RunNo': '43',
      'LineTypeId': '1',
      'LineTypeName': 'Stadsbuss',
      'TransportModeId': '2',
      'TransportModeName': 'Stadsbuss/tätortstrafik',
      'RealTime': '',
      'TrainNo': '0',
      'Deviations': '',
      'Towards': 'Centrum',
      'OperatorCode': '20'
    },
    output: {
      name: '2',
      run: 43,
      type: 'Stadsbuss',
      modeId: 2,
      modeName: 'Stadsbuss/tätortstrafik',
      trainNumber: 0,
      towards: 'Centrum',
      operatorId: 20,
      operatorName: null,
      onSchedule: true,
      stopPoint: null,
      realTime: {
        deviation: NaN,
        effect: null
      }
    }
  };

  const result = await formatLine(testCase.input);

  t.deepEqual(result, testCase.output);
});
