function formatNumber(object) {
  return object === '' ? NaN : Number(object);
}

module.exports = {
  formatNumber
};
