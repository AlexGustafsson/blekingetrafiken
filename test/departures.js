import test from 'ava';

const {
  fetchDepartures
} = require('../lib/departures');

test('Can fetch departures', async t => {
  const result = await fetchDepartures('Amiralen');

  const isArray = Array.isArray(result);
  t.true(isArray);

  if (isArray && result.length > 0) {
    const item = result[0];
    t.is(typeof item, 'object');
  }
});
