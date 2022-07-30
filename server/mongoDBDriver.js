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
  return productDetail
    .find({}, { projection: { features: 0, _id: 0 } })
    .limit(reqestAmount)
    .toArray();
}

function findRelatedProducts(relatedProduct, productId) {
  return relatedProduct
    .find(
      { current_product_id: productId },
      { projection: { _id: 0 } },
    )
    .limit(48)
    .toArray();
}

// ------------------ transformData ------------------ //
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
