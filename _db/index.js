const mongoose = require('mongoose');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
const db = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
};

// const dbUrl = `mongodb://${db.login}@${db.host}/${db.name}`;
const dbUrl = `mongodb://${db.host}/${db.name}`;

mongoose.connect(dbUrl)
  .then(() => {
    console.log('DB Connection:', db.name);
  }).catch((err) => {
    console.log('DB Connection Error:', err.message);
  });
