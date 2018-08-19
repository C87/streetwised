const mongoose = require('mongoose');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)
  .then((db) => {
    console.log('_db/index.js: DB Connected' /* db.connections */);
  }).catch((err) => {
    console.log('_db/index.js: DB Connection Error' /* err */);
  });
