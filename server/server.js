const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
let db;

// ================== Server Functions ==================//

// ------------------ getData ------------------ //
function findProducts(productDetail, page, count) {
  let reqestAmount = page * count;
  // prevent user request to many data
  reqestAmount = reqestAmount <= 200 ? reqestAmount : 20;
  return productDetail.find().limit(reqestAmount).toArray();
}

function findRelatedProducts(relatedProduct, productId) {
  return relatedProduct.find({ current_product_id: productId }).limit(48).toArray();
}

// ------------------ transformData ------------------ //
function transformProducts(products) {
  const result = [];
  products.forEach((product) => {
    result.push({
      id: product.id,
      name: product.name,
      slogan: product.slogan,
      description: product.description,
      category: product.category,
      default_price: product.default_price,
    });
  });
  return result;
}

function transformRelatedProducts(products) {
  const relatedProducts = [];
  products.forEach((product) => {
    relatedProducts.push(product.related_product_id);
  });
  return relatedProducts;
}

function transformStyles(styles) {
  const results = [];
  const finalStyle = {};
  styles.forEach((style) => {
    const newStyleFormat = {};
    newStyleFormat.style_id = style.id;
    newStyleFormat.name = style.name;
    newStyleFormat.original_price = style.original_price;
    newStyleFormat.sale_price = (style.sale_price === 'null' ? 0 : style.sale_price);
    newStyleFormat['default?'] = (style.default_style === 1);
    newStyleFormat.skus = {};
    style.skus.forEach((sku) => {
      newStyleFormat.skus[sku.id] = {};
      newStyleFormat.skus[sku.id].quantity = sku.quantity;
      newStyleFormat.skus[sku.id].size = sku.size;
    });
    newStyleFormat.photos = style.photos;
    results.push(newStyleFormat);
    finalStyle.product_id = style.productId;
    // stylesOutput.push(finalStyle);
  });
  finalStyle.results = results;
  return finalStyle;
}

// ================== Server Router & MongoDB Connect ==================//
// Initialize connection once
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, database) => {
  if (err) throw err;

  db = database.db('betterSDC');

  // Start the application after the database connection is ready
  app.listen(3000);
  console.log(`Listening on port http://localhost:${port}`);
});

// Reuse database object in request handlers
app.get('/products', (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const productDetailColl = db.collection('product_detail');
  findProducts(productDetailColl, page, count)
    .then((products) => {
      res.send(transformProducts(products));
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

app.get('/products/:product_id', (req, res) => {
  const pId = parseInt(req.params.product_id, 10);
  const productDetailColl = db.collection('product_detail');
  productDetailColl
    .findOne({ id: pId })
    .then((products) => {
      res.send(products);
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

app.get('/products/:product_id/related', (req, res) => {
  const pId = parseInt(req.params.product_id, 10);
  const relatedProductColl = db.collection('related');
  findRelatedProducts(relatedProductColl, pId)
    .then((relatedProducts) => {
      res.send(transformRelatedProducts(relatedProducts));
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});

app.get('/products/:product_id/styles', (req, res) => {
  const pId = parseInt(req.params.product_id, 10);
  const productDetail = db.collection('style_detail');
  productDetail
    .find({ productId: pId })
    .toArray()
    .then((styles) => {
      res.send(transformStyles(styles));
    })
    .catch((error) => {
      res.sendStatus(500);
      throw error;
    });
});
