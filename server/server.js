const express = require('express');
const cors = require('cors');
const db = require('./mongoDriver');

const loaderioToken = 'loaderio-ea8731dd65d23a6e201c0e62afca126b';

const app = express();

app.use(cors());
const port = 3000;

// ================== Server Router ==================//
// app.use('*', (req, res) => {
//   console.log('client connect to user');
// });

app.get(`/${loaderioToken}`, (req, res) => {
  res.send(loaderioToken);
});

app.get('/products', (req, res) => {
  // console.log('find products request received');
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  db.findProducts(page, count)
    .then((products) => {
      res.send(products);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

app.get('/products/:product_id', (req, res) => {
  // console.log('find product detail request received');
  const productId = parseInt(req.params.product_id, 10);
  db.findOneProductDetail(productId)
    .then((products) => {
      res.send(products);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

app.get('/products/:product_id/related', (req, res) => {
  // console.log('find re;ated products request received');
  const productId = parseInt(req.params.product_id, 10);
  db.findRelatedProducts(productId)
    .then((relatedProducts) => {
      res.send(db.transformRelatedProducts(relatedProducts));
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

app.get('/products/:product_id/styles', (req, res) => {
  const productId = parseInt(req.params.product_id, 10);
  db.findOneProductStyles(productId)
    .then((styles) => {
      res.send(db.transformStyles(styles));
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

app.listen(3000, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
