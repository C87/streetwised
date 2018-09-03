module.exports.comment = (req, res, next) => {
  res
    .json(res.locals.comment);
};

module.exports.location = (req, res, next) => {
  res
    .json({
      center: req.session.coordinates,
      maxBounds: null,
    });
};

module.exports.points = (req, res, next) => {
  if (!res.locals.data) return next();
  const geoJSON = {
    type: 'FeatureCollection',
    features: res.locals.data,
  };

  res
    .json(geoJSON);
};

module.exports.post = (req, res, next) => {
  res
    .json(res.locals.data);
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
