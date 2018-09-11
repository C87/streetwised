module.exports.comment = (req, res, next) => {
  res
    .json(res.locals.comment);
};

module.exports.location = (req, res, next) => {
  res
    .json({
      center: req.session.coordinates,
      maxBounds: [-3.21270, 53.16401, -2.65632, 53.58125],
    });
};

module.exports.points = (req, res, next) => {
  if (!res.locals.data) return next();

  const data = {
    length: res.locals.data.length,
    geoJSON: {
      type: 'FeatureCollection',
    }
  };

  if (req.session.userId) {
    data.geoJSON.features = res.locals.data;
  } else {
    data.geoJSON.features = res.locals.data.slice(-10);
  }
  // console.log(res.locals.data.length);
  // const data = {
  //   length: res.locals.data.length
  // }
  // if (!res.locals.data) return next();
  // const geoJSON = {
  //   type: 'FeatureCollection',
  //   features: res.locals.data,
  // };
  //
  res
    .json(data);
};

module.exports.post = (req, res, next) => {
  res
    .json(res.locals.data);
};

module.exports.redirect = (req, res, next) => {
  res
    .status(200)
    .json({
      code: 301,
    });
};

module.exports.results = (req, res, next) => {
  res
    .json(res.locals.response);
};

module.exports.ok = (req, res, next) => {
  res
    .status(200)
    .json({
      code: 200,
      body: 'OK',
    });
};

module.exports.url = (req, res, next) => {
  console.log('PASSED: res.url');
  res
    .json({ code: 200, url: req.session.avatar });
};
