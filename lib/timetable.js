const { fetch } = require('./fetch');

function parseTimetables(result) {
  // If there are no timetables, the object is undefined
  const parent = result['TimetableQueryResponse']['TimetableQueryResult']['Timetables'] || {};
  const timetables = parent['TimetableInfo'] || [];

  return Promise.resolve(timetables);
}

function formatTimetables(timetables) {
  const formattedTimetables = [];

  for (const timetable of timetables) {
    const formattedTimetable = {
      type: timetable['LineTypeKey'],
      name: timetable['Name'],
      header: timetable['Header'], // The text displayed on the bus
      validFrom: timetable['ValidFromDate'],
      validTo: timetable['ValidToDate'],
      url: timetable['URL']
    };

    formattedTimetables.push(formattedTimetable);
  }

  return Promise.resolve(formattedTimetables);
}

/*  Type is optional but one of the following:
  Stad(stadsbuss)
  Land(regionbuss),
  K-buss(kustbussen),
  Ö-Tåg (öresundståg),
  Båt,
  P-Tåg(pågatåg),
  Tåg(Krösatåg)
*/
function searchTimetable(line, type) {
  const url = 'timetableQuery.asp';
  const params = {
    'searchstring': line,
    'linetypekey': type || ''
  };

  return fetch(url, params)
  .then(result => parseTimetables(result))
  .then(timetables => formatTimetables(timetables));
}

module.exports = {
  parseTimetables,
  formatTimetables,
  searchTimetable
};
