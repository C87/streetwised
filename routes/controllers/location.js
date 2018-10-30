const fetch = require('node-fetch');
const turf = require('@turf/turf');

const bbox = [-3.21270, 53.16401, -2.65632, 53.58125];

module.exports.currentPosition = (req, res, next) => {
  const lng = parseFloat(req.body.lng);
  const lat = parseFloat(req.body.lat);

  if (lng < bbox[0] || lng > bbox[2]) {
    const err = new Error("You're outside Liverpool this ain't going to work.");
    err.code = 400;
    return next(err);
  }

  if (lat < bbox[1] || lat > bbox[3]) {
    const err = new Error("You're outside Liverpool this ain't going to work.");
    err.code = 400;
    return next(err);
  }

  next();
};

module.exports.distances = (req, res, next) => {
  if (!res.locals.data) return next();
  const from = turf.point(req.session.coordinates);

  res.locals.data.forEach((el) => {
    const to = turf.point(el.geometry.coordinates);
    let distance = turf.distance(from, to);
    // convert default km to metres
    distance *= 1000;
    let transport;
    // 1,680 metres takes approx 20 mins to walk.
    // If distance is greater than 1,680 drive.
    if (distance > 1680) {
      transport = 'car';
      // A car at traveling 30mph travels 13.4112m per second.
      // So distance in metres divided by 13.4112 is equal to distance in seconds.
      distance /= 13.4112;
    } else {
      transport = 'walk';
      // Average walking speed is 1.4m per second,
      // So distance in metres divided by 1.4 is equal to distance in seconds.
      distance /= 1.4;
    }
    // Divide total distance in seconds by 60 to calculate distance in minutes.
    distance /= 60;
    // Round up
    distance = Math.ceil(distance);

    el.properties.travel = {
      mode: transport,
      distance: `${distance}min`,
    };
  });
  next();
};

module.exports.params = (req, res, next) => {
  req.session.coordinates = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
  req.session.geoBoundBox = [
    [parseFloat(req.body.sw_lng), parseFloat(req.body.sw_lat)],
    [parseFloat(req.body.ne_lng), parseFloat(req.body.ne_lat)],
  ];

  if (req.session.coordinates.length === 2 || res.locals.box.length === 2) {
    console.log('PASSED: location.params,', req.session.coordinates);
    next();
  }
};

module.exports.reverseGeo = (req, res, next) => {
  const key = process.env.TILEHOSTING_KEY;
  const url = `https://geocoder.tilehosting.com/gb/q/${req.body.text}.js?key=${key}`;
  fetch(url)
    .then(geo => geo.json())
    .then((geo) => {
      const list = [];
      geo.results.forEach((el) => {
        if (bbox[0] < el.lon && bbox[1] < el.lat && bbox[2] > el.lon && bbox[3] > el.lat) {
          list.push(el);
        }
      });
      return list.slice(0, 6);
    })
    .then((list) => {
      res.locals.response = [];
      list.forEach((el) => {
        const location = {
          lat: el.lat,
          lng: el.lon,
        };
        if (el.city && el.name === el.city) {
          location.name = el.name;
        } else if (el.city && el.name !== el.city) {
          location.name = `${el.name}, ${el.city}`;
        } else {
          location.name = el.name;
        }
        res.locals.response.push(location);
      });
      next();
    })
    .catch(err => next(err));
};

module.exports.review = (req, res, next) => {
  if (req.session.coordinates) {
    console.log('SKIPPED: location.review,', req.session.coordinates);
    return next();
  }

  const locationArray = [
    [-2.981181, 53.403172], [-2.9912471, 53.4036596], [-2.9828705, 53.4014808],
    [-2.9904005, 53.4052938], [-2.9859857, 53.4079822], [-2.98088, 53.4032928],
    [-2.9861755, 53.4033627], [-2.9864008, 53.4052288], [-2.9820082, 53.4050664],
    [-2.984965, 53.4064874], [-2.9882638, 53.4032384], [-2.9781494, 53.4010812],
    [-2.9878397, 53.4076726], [-2.9895214, 53.4085385], [-2.9908203, 53.4062812],
    [-2.9808996, 53.4022641], [-2.981957, 53.4016293], [-2.9862436, 53.4045246],
    [-2.9866329, 53.4071879], [-2.979031, 53.4036655], [-2.9853655, 53.4042151],
  ];

  const index = Math.floor(Math.random() * locationArray.length);

  req.session.coordinates = locationArray[index];

  console.log('PASSED: location.review,', req.session.coordinates);
  next();
};

module.exports.question = (req, res, next) => {
  const lng = req.session.coordinates[0];
  const lat = req.session.coordinates[1];

  console.log(req.session.coordinates);
  console.log(bbox);

  if (lng < bbox[0] || lng > bbox[2]) {
    const err = new Error('Questions can only be posted in Liverpool region.');
    err.code = 400;
    return next(err);
  }

  if (lat < bbox[1] || lat > bbox[3]) {
    const err = new Error('Questions can only be posted in Liverpool region.');
    err.code = 400;
    return next(err);
  }
  next();
};
