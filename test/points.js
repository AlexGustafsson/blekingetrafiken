import test from 'ava';

const {
  searchPoints,
  searchStops,
  formatPoints,
  filterPoints
} = require('../lib/points');

test('Formats points correctly', async t => {
  const testCase = {
    input: {
      'Id': '10001041',
      'Name': 'Amiralen Lyckeby',
      'Type': 'STOP_AREA',
      'X': '6229909',
      'Y': '1490019',
      'Distance': '299'
    },
    output: {
      id: '10001041',
      name: 'Amiralen Lyckeby',
      type: 'stop',
      coordinates: {
        latitude: 6229909,
        longitude: 1490019
      },
      distance: 299
    }
  };

  const result = await formatPoints([testCase.input]);

  t.deepEqual(result, [testCase.output]);
});

test('Can filter points correctly', async t => {
  const testCases = [
    {type: 'point of interest'},
    {type: 'point of interest'},
    {type: 'point of interest'},
    {type: 'address'},
    {type: 'address'},
    {type: 'address'},
    {type: 'stop'},
    {type: 'stop'},
    {type: 'stop'}
  ];

  const pointOfInterestResult = await filterPoints(testCases, ['point of interest']);
  const pointOfInterestIsArray = Array.isArray(pointOfInterestResult);

  const addressResult = await filterPoints(testCases, ['address']);
  const addressIsArray = Array.isArray(addressResult);

  const stopResult = await filterPoints(testCases, ['stop']);
  const stopIsArray = Array.isArray(stopResult);

  t.true(pointOfInterestIsArray);
  t.true(addressIsArray);
  t.true(stopIsArray);

  t.is(pointOfInterestResult.length, 3);
  t.is(addressResult.length, 3);
  t.is(stopResult.length, 3);
});

test('Can search for nearby stops', async t => {
  let result = null;

  try {
    result = await searchStops({x: 56.182321, y: 15.590342});
  } catch (error) {
    t.fail(error);
  }

  const isArray = Array.isArray(result);
  t.true(isArray);

  if (isArray && result.length !== 0) {
    const item = result[0];

    const isObject = typeof item === 'object';
    t.true(isObject);

    if (isObject) {
      t.is(typeof item.id, 'string');
      t.is(typeof item.name, 'string');
      t.is(typeof item.type, 'string');
      t.is(typeof item.coordinates, 'object');
      t.is(typeof item.coordinates.latitude, 'number');
      t.is(typeof item.coordinates.longitude, 'number');
      t.is(typeof item.distance, 'number');
    }
  }
});

test('Can search for stops', async t => {
  let result = null;

  try {
    result = await searchStops('Amiralen');
  } catch (error) {
    t.fail(error);
  }

  const isArray = Array.isArray(result);
  t.true(isArray);

  if (isArray && result.length !== 0) {
    const item = result[0];

    const isObject = typeof item === 'object';
    t.true(isObject);

    if (isObject) {
      t.is(typeof item.id, 'string');
      t.is(typeof item.name, 'string');
      t.is(typeof item.type, 'string');
      t.is(typeof item.coordinates, 'object');
      t.is(typeof item.coordinates.latitude, 'number');
      t.is(typeof item.coordinates.longitude, 'number');
      t.is(typeof item.distance, 'number');
      t.true(Number.isNaN(item.distance));
    }
  }
});

test('Can search for points', async t => {
  let result = null;

  try {
    result = await searchPoints('Wämö');
  } catch (error) {
    t.fail(error);
  }

  const isArray = Array.isArray(result);
  t.true(isArray);

  if (isArray && result.length !== 0) {
    const item = result[0];

    const isObject = typeof item === 'object';
    t.true(isObject);

    if (isObject) {
      t.is(typeof item.id, 'string');
      t.is(typeof item.name, 'string');
      t.is(typeof item.type, 'string');
      t.is(typeof item.coordinates, 'object');
      t.is(typeof item.coordinates.latitude, 'number');
      t.is(typeof item.coordinates.longitude, 'number');
      t.is(typeof item.distance, 'number');
      t.true(Number.isNaN(item.distance));
    }
  }
});
