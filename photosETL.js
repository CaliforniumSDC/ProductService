//Load features into product collection

const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const dbName = 'sdc'
let db

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)

  // Storing a reference to the database so you can use it later
  db = client.db(dbName)
  console.log(`Connected MongoDB: ${url}`)
  console.log(`Database: ${dbName}`)
  const products = db.collection('photos');

  //Loading data from csv
  // fs.createReadStream('../photos.csv')
  fs.createReadStream('../xaa.csv')
  // fs.createReadStream('../xab.csv')
  .pipe(csv())
  .on('data', (data) => {
    // results.push(data);
    // if(data.id==='263'){
    //   console.log('whole ',data);
    // }
    // if(data.id==='262'){
    //   console.log('whole ',data);
    // }
    if(Object.keys(data).length > 4) {
      console.log('whole ',data);
    }
    // console.log('whole ',data);
    // products.insertOne(data);

  })
  .on('end', () => {
    // client.close();
    console.log('CSV file successfully processed');
  });
})