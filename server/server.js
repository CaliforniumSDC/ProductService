const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
let db;

// Initialize connection once
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, database) => {
  if (err) throw err;

  db = database.db('sdc');

  // Start the application after the database connection is ready
  app.listen(3000);
  console.log(`Listening on port http://localhost:${port}`);
});

// Reuse database object in request handlers
app.get('/', (req, res) => {
  console.log('this is db ', db);
  const productDetail = db.collection('product_detail');
  productDetail.findOne({ id: 6 }).then((data) => {
    console.log(data);
    res.send(data);
  }).catch((error) => {
    throw error;
  });
});
