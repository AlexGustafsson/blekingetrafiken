const test = require('ava').test;

const {
  parseResult,
  checkApiStatus
} = require('../lib/fetch');

test('Disallows non-permitted API statuses', async t => {
  const testCases = [
    {content: {a: {b: {'Code': '202'}}}, expectedError: 'Query should be at least 2 characters long'},
    {content: {a: {b: {'Code': '99'}}}, expectedError: 'Server timeout'},
    {content: {a: {b: {'Code': '260'}}}, expectedError: 'Travel date is outside the database\'s range'},
    {content: {a: {b: {'Code': '320'}}}, expectedError: 'The stop point id was incorrect'},
    {content: {a: {b: {'Code': '404'}}}, expectedError: 'The API endpoint was not found'},
    {content: {a: {b: {'Code': '500', 'Message': 'Error Message'}}}, expectedError: 'Unknown API endpoint error. Check your parameters and try again. Full error: 500: Error Message'}
  ];

  const results = await Promise.all(testCases.map(x => t.throws(checkApiStatus(x.content))));

  for (let i = 0; i < results.length; i++)
    t.is(results[i].message, testCases[i].expectedError);
});

test('Allows permitted API statuses', async t => {
  const passingCase = {content: {a: {b: {'Code': '0'}}}};

  await t.notThrows(checkApiStatus(passingCase.content));
});

test('Can parse correct API responses', async t => {
  function getTestCase(content) {
    const string = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope>
      <soap:Body>
        <FirstChild>
          <SecondChild>
            <Content>${content}</Content>
          </SecondChild>
        </FirstChild>
      </soap:Body>
    </soap:Envelope>`.replace(/\s/g, '');

    return {string, content};
  }

  const testCases = Array(25)
    .fill(0)
    .map(() => getTestCase(Math.random().toString(36).slice(2)));

  await Promise.all(testCases.map(async x => {
    const result = await parseResult({data: x.string});

    t.is(result['FirstChild']['SecondChild']['Content'], x.content.toString());
  }));
});

test('Can\'t parse faulty API responses', async t => {
  const testCases = Array(25)
    .fill(0)
    .map(() => Math.random().toString(36).slice(2));

  await Promise.all(testCases.map(async x => {
    const error = await t.throws(parseResult({data: x}));

    t.is(error.message, 'Could not parse API response');
  }));
});
