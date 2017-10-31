const test = require('ava').test;

const {
  fetchInfo,
  formatInfo,
  parseInfo
} = require('../lib/info');

test('Can format info', async t => {
  const testCases = Array(25)
    .fill(0)
    .map(() => {
      return {
        'CaseNo': Math.floor(Math.random() * 500),
        'Text': Math.random().toString(36).slice(2)
      };
    });

  const result = await formatInfo(testCases);

  for (let i = 0; i < result.length; i++) {
    t.is(result[i].case, testCases[i]['CaseNo']);
    t.is(result[i].text, testCases[i]['Text']);
  }
});

test('Can parse info', async t => {
  const testCaseA = {
    'GetInfoMessageResponse': {
      'GetInfoMessageResult': {
        'InfoMessages': {
          'InfoMessage': ['foobar']
        }
      }
    }
  };

  const testCaseB = {
    'GetInfoMessageResponse': {
      'GetInfoMessageResult': {
        'InfoMessages': {
          'InfoMessage': ''
        }
      }
    }
  };

  const testCaseC = {
    'GetInfoMessageResponse': {
      'GetInfoMessageResult': {
        'InfoMessages': {
          'InfoMessage': 'Message'
        }
      }
    }
  };

  const resultA = await parseInfo(testCaseA);
  const resultB = await parseInfo(testCaseB);
  const resultC = await parseInfo(testCaseC);

  t.deepEqual(resultA, ['foobar']);
  t.deepEqual(resultB, []);
  t.deepEqual(resultC, ['Message']);
});

test('Can fetch info', async t => {
  let result = null;
  try {
    result = await fetchInfo();
  } catch (error) {
    return t.fail(error);
  }

  const isArray = Array.isArray(result);
  t.true(isArray);

  if (isArray && result.length !== 0) {
    const item = result[0];

    const isObject = typeof item === 'object';
    t.true(isObject);

    if (isObject) {
      t.is(typeof item.case, 'number');
      t.is(typeof item.text, 'string');
    }
  }
});
