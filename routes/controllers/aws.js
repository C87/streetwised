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
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_KEY_SECRET,
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

const none = multer().none();

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

module.exports.avatar = (req, res, next) => {
  res.locals.path = `avatars/${req.session.username}`;

  req.body.avatar = req.body.avatar.replace(/^data:image\/[a-z]+;base64,/, '');

  req.body.avatar = Buffer.from(req.body.avatar, 'base64');

  const px = 200;
  let x;
  let y;
  const rotate = parseInt(req.body.rotate, 10);

  gm(req.body.avatar) // This code needs some error checking an validation implemented!!
    .size((error, value) => {
      if (error || !value) {
        console.log('Error:', err);
      }
      x = value.width === px ? 0 : (value.width - 200) / 2;
      y = value.height === px ? 0 : (value.height - 200) / 2;
      // console.log(value, x, y);

      gm(req.body.avatar)
        .crop(px, px, x, y)
        .rotate('black', rotate)
        .autoOrient()
        .setFormat('jpeg')
        .toBuffer((err, buffer) => {
          if (err) console.log('Error:', err);
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
            .catch(err_ => console.log(err_));
        });
    });
};

module.exports.generic = (req, res, next) => {
  res.locals.url = 'https://streetwised.ams3.digitaloceanspaces.com/streetwised/avatars/generic-avatar.jpeg';

  const valid = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'z', 'y',
  ];

  const letter = req.body.username.slice(0, 1);

  valid.forEach((el) => {
    if (el === letter) {
      res.locals.url = `https://streetwised.ams3.digitaloceanspaces.com/streetwised/avatars/${el}.jpeg`;
    }
  });

  next();
};
