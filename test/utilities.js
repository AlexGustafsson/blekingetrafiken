import test from 'ava';

const {
  formatNumber
} = require('../lib/utilities');

test('Formatting fauly numbers returns NaN', async t => {
  const testCases = new Array(25)
    .fill(0)
    .map(() => Math.random().toString(36).slice(2));

  await Promise.all(testCases.map(async x => {
    const result = formatNumber(x);

    t.true(Number.isNaN(result));
  }));
});

test('Formatting numbers returns the same number', async t => {
  const testCases = new Array(25)
    .fill(0)
    .map(() => Math.floor(Math.random() * 100).toString());

  await Promise.all(testCases.map(async x => {
    const result = formatNumber(x);

    t.is(result, Number(x));
  }));
});

test('Formatting empty string returns NaN', async t => {
  const testCase = '';
  const result = formatNumber(testCase);

  t.true(Number.isNaN(result));
});
