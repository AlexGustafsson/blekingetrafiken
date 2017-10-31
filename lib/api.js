const { fetchDepartures } = require('./departures');
const { searchJourneys } = require('./journey');
const { searchPoints, searchStops } = require('./points');
const { fetchInfo } = require('./info');
const { searchTimetable } = require('./timetable');

module.exports = {
  fetchDepartures,
  searchJourneys,
  searchPoints,
  searchStops,
  fetchInfo,
  searchTimetable
};
