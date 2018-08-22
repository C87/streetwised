const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const gm = require('gm').subClass({ imageMagick: true });

// -----------------------------------------------------------------------------
// Spaces config
// -----------------------------------------------------------------------------
const spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'FMEKUZ7SAV2FQUO4PYQ4',
  secretAccessKey: process.env.SPACES_KEY_SECRET,
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const none = multer().none();
const single = multer().single('avatar');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.none = (req, res, next) => {
  none(req, res, (err) => {
    if (err) next(err);
    console.log('PASSED: aws.none,', Object.keys(req.body).length);
    next();
  });
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

module.exports.single = (req, res, next) => {
  single(req, res, (err) => {
    if (err) next(err);
    if (!req.file) {
      console.log('SKIPPED: aws.single');
      return next();
    }
    if (!req.file.mimetype.startsWith('image/')) {
      const _err = new Error('Invalid file type.');
      _err.code = 400;
      return next(_err);
    }
    console.log('PASSED: aws.single,', req.file);
    next();
  });
};

module.exports.avatar = (req, res, next) => {
  if (!req.file || !req.body.image) {
    const err = new Error('No file found.');
    err.code = 400;
    return next(err);
  }

  if (!req.session.username) {
    const err = new Error('No session found.');
    err.code = 400;
    return next(err);
  }

  const imageArray = [];
  req.body.image.split(',').forEach((el) => {
    imageArray.push(parseInt(el, 10));
  });

  image = {
    height: imageArray[0],
    width: imageArray[1],
    left: imageArray[2],
    top: imageArray[3],
    capture: imageArray[4],
  };

  console.log(image);

  if (image.top > (image.height - image.capture)) image.top = image.height - image.capture;
  if (image.left > (image.width - image.capture)) image.left = image.width - image.capture;

  res.locals.path = `avatars/${req.session.username}`;

  gm(req.file.buffer)
    .resizeExact(image.width, image.height)
    .crop(image.capture, image.capture, image.left, image.top)
    .setFormat('jpeg')
    .toBuffer((err, buffer) => {
      if (err) { console.log('Error,', err); }
      console.log('PASSED: aws.avatar.gm,', buffer);
      const params = {
        Bucket: 'streetwised',
        Key: res.locals.path,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      };
      s3
        .putObject(params)
        .promise()
        .then((data) => {
          console.log('PASSED: aws.avatar.s3,', data);
          next();
        })
        .catch(error => console.log(error));
    });
};
