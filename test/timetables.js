import test from 'ava';

const {
  parseTimetables,
  formatTimetables,
  searchTimetable
} = require('../lib/timetable');

test('Can parse matching timetables', async t => {
  const testCase = {
    input: {
      'TimetableQueryResponse': {
        'TimetableQueryResult': {
          'Code': '0',
          'Message': '',
          'Timetables': {
            'TimetableInfo': []
          }
        }
      }
    },
    output: []
  };

  const result = await parseTimetables(testCase.input);

  t.deepEqual(result, testCase.output);
});

test('Can parse non matching timetables', async t => {
  const testCase = {
    input: {
      'TimetableQueryResponse': {
        'TimetableQueryResult': {
          'Code': '0',
          'Message': ''
        }
      }
    },
    output: []
  };

  const result = await parseTimetables(testCase.input);

  t.deepEqual(result, testCase.output);
});

test('Can format timetables', async t => {
  const testCase = {
    input: [
      {
        'LineTypeKey': 'Stad',
        'Name': '1',
        'Header': 'Lyckeby - Kungsmarken - Trossö - Saltö',
        'ValidFromDate': '2017-08-21',
        'ValidToDate': '2018-06-17',
        'TimetableRef': 'Stadsbuss/170821_180617/Stadsbuss_01Karlskrona_1_170821_180617',
        'TimetableName': '1 Lyckeby - Kungsmarken - Trossö - Saltö',
        'URL': 'www.etis.fskab.se/blekinge/P4W/Stadsbuss/170821_180617/Stadsbuss_01Karlskrona_1_170821_180617.pdf'
      }
    ],
    output: [
      {
        type: 'Stad',
        name: '1',
        header: 'Lyckeby - Kungsmarken - Trossö - Saltö',
        validFrom: '2017-08-21',
        validTo: '2018-06-17',
        url: 'www.etis.fskab.se/blekinge/P4W/Stadsbuss/170821_180617/Stadsbuss_01Karlskrona_1_170821_180617.pdf'
      }
    ]
  };

  const result = await formatTimetables(testCase.input);

  t.deepEqual(result, testCase.output);
});

test('Can search existing timetable with type', async t => {
  const result = await searchTimetable('1', 'Stad');

  t.true(Array.isArray(result));
});

test('Can search existing timetable without type', async t => {
  const result = await searchTimetable('1');

  t.true(Array.isArray(result));
});
