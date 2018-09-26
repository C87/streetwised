const nodemailer = require('nodemailer');

module.exports.post = (req, res, next) => {
  // Create a SMTP transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.TRANSPORTER_USER,
      pass: process.env.TRANSPORTER_PASS
    }
  });

  // Message object
  const message = {
    from: 'streetwised@outlook.com',
    to: 'shaun@streetwised.com',
    subject: 'New Question!',
    text: req.body.question
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(`Mailer Failed: ${err.message}`);
      return next(err);
    }
    console.log('PASSED: mailer.post,', info.messageId);
  });
  next();
};

module.exports.response = (req, res, next) => {
  // Create a SMTP transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.TRANSPORTER_USER,
      pass: process.env.TRANSPORTER_PASS
    }
  });

  // Message object
  const message = {
    from: 'streetwised@outlook.com',
    to: 'shaun@streetwised.com',
    subject: 'New Response!',
    text: req.body.text
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(`Mailer Failed: ${err.message}`);
      return next(err);
    }
    console.log('PASSED: mailer.post,', info.messageId);
  });
  next();
};

module.exports.signup = (req, res, next) => {
  // Create a SMTP transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.TRANSPORTER_USER,
      pass: process.env.TRANSPORTER_PASS
    }
  });

  // Message object
  const message = {
    from: 'streetwised@outlook.com',
    to: 'shaun@streetwised.com',
    subject: 'New Signup!',
    text: req.body.email
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(`Mailer Failed: ${err.message}`);
      return next(err);
    }
    console.log('PASSED: mailer.post,', info.messageId);
  });
  next();
};
