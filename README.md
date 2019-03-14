# Blekingetrafiken API for NodeJS
### A fully async API written in ES6 for retrieval of public transport information, schedules and routes in Blekinge
***
![npm badge](https://img.shields.io/npm/v/blekingetrafiken.svg)

### Setting up

##### Installing

```
npm install blekingetrafiken
```

##### Quickstart

```JavaScript
const api = require('blekingetrafiken');

// Fetch departures
api.fetchDepartures()
.then(departures => {
  const departure = departures[0];
  console.log(`A transportation of type '${departure.type}' (line ${departure.name}) is departing ${departure.onSchedule ? 'on schedule' : 'later than planned'} from stop point ${departure.stopPoint}`);
});
```

```
> A transportation of type 'Stadsbuss' (line 6) is departing on schedule from stop point A
```

### Documentation

##### API

```JavaScript
  const api = require('blekingetrafiken');
  api.fetchDepartures(from);
  api.searchJourneys(from, to, options);
  api.searchPoints(query);
  api.searchStops(query);
  api.fetchInfo();
  api.searchTimetable(line);
```

###### `fetchDepartures`

```JavaScript
  const from = 'Kungsmarken';
  const departures = await api.fetchDepartures(from);
  console.log(departures);
```

```
[
  {
    name: '1',                           // The name of the bus (line)
    run: 26,                             // The current run the bus is on
    type: 'Stadsbuss',                   // The type of transportation - see below
    modeId: NaN,                         // The transportation mode - see below
    modeName: 'Stadsbuss/tätortstrafik', // Mode name
    trainNumber: 0,                      // Similar to name, applicable to trains
    towards: 'Lyckeby',                  // The current direction of the bus
    operatorId: 13,                      // The id of the current operator
    operatorName: null,                  // The operator name (usually Bergkvarabuss)
    onSchedule: true,                    // Whether or not the transportation is on schedule
    stopPoint: 'B',                      // At what point the bus will stop. Usually A or B
    realTime: {
      deviation: NaN,                    // Amount of delay in minutes
      effect: null                       // The effect of the delay - see below
    }
  }
  ...
]
```

###### Transportation types

```
  Stad (Stadsbuss)
  Land (Regionbuss),
  K-buss (Kustbussen),
  Ö-Tåg (Öresundståg),
  Båt,
  P-Tåg(Pågatåg),
  Tåg(Krösatåg)
```

###### Transportation modes

Some sort of yet to be determined bitmask of selected transportation modes (biking / walking / taking the bus).

Known values:

* 1, stadsbuss
* 2, regionbuss
* 4095, every possible transportation mode

###### Realtime effects

Known values:

* 'NONE', the usual effect. No delay
* 'PASSED', the transportation has passed the stop
* 'CRITICAL', the transportation is heavily delayed
* '', no known effect

##### `searchJourneys`

```JavaScript
  const from = 'Kungsmarken';
  const to = 'Kungsplan';
  const journeys = await api.fetchJourneys(from);
  console.log(departures);
```

```
[
  {
    departure: '2017-10-31T20:12:00',
    arrival: '2017-10-31T20:24:00',
    walkDistance: { departure: 0, arrival: 0 },
    changes: 0,
    zones: 1,
    zoneName: 'Karlskrona tätort',
    guaranteed: true,
    co2Factor: 10,
    co2Value: 0,
    prices: { adult: 24, youth: 14, family: 43 },
    discountedPrices: { adult: 19.2, youth: 11.2, family: 34.4 },
    routeLinks: [],
    distance: 5389,
    from:
    { id: '10001067',
    name: 'Kungsmarken A-huset',
    type: 'stop',
    coordinates: [Object],
    distance: NaN },
    to:
    {
      id: '10001001',
      name: 'Kungsplan Karlskrona',
      type: 'stop',
      coordinates: [Object],
      distance: NaN
    }
  }
]
```

##### `searchPoints`

```JavaScript
  const query = 'Park';
  const filter = ['point of interest']
  const points = await api.searchPoints(query, { filter });
  console.log(points);
```

```
[
  {
    id: '10001601',
    name: 'Karlskrona centrum Parkgatan',
    type: 'stop',
    coordinates: {
      latitude: 6226117,
      longitude: 1486398
    },
    distance: NaN
  },
  {
    id: '10001149',
    name: 'Parkvägen Jämjö',
    type: 'stop',
    coordinates: {
      latitude: 6229271,
      longitude: 1502720
    },
    distance: NaN
  }
  ...
]
```

##### `searchStops`

```JavaScript
  const query = 'Campus Gräsvik';
  const stops = await api.searchStops(query);
  console.log(stops);
```

```
[
  {
    id: '10001927',
    name: 'Campus Gräsvik',
    type: 'stop',
    coordinates: {
      latitude: 6228063,
      longitude: 1486813
    },
    distance: NaN
  }
]
```

##### `fetchInfo`

```JavaScript
  const info = await api.fetchInfo();
  console.log(info);
```

```
Vägarbete på väg 22
```

##### `searchTimetable`

```JavaScript
  const query = '1';
  const timetables = await api.searchTimetable(query);
  console.log(timetables);
```

```
[
  {
    type: 'Stad',
    name: '2',
    header: 'Jämjö - Lyckeby - Centrum',
    validFrom: '2017-08-21',
    validTo: '2018-06-17',
    url: '[removed url to pdf file]'
  },
  ...
]
```

### Contributing

Any contribution is welcome. If you're not able to code it yourself, perhaps someone else is - so post an issue if there's anything on your mind.

###### Development

Clone the repository:
```
git clone https://github.com/AlexGustafsson/blekingetrafiken.git && cd blekingetrafiken
```

Set up for development:
```
npm install
```

Follow the conventions enforced:
```
npm test
npm run-script lint
npm run-script coverage
npm run-script check-duplicate-code
```

### Disclaimer

_Although the project is very capable, it is not built with production in mind. Therefore there might be complications when trying to use the API for large-scale projects meant for the public. The API was created to easily fetch public transport information, schedules and routes in Blekinge programmatically and as such it might not promote best practices nor be performant. This project is not in any way affiliated with Blekingetrafiken or Blekinge._
