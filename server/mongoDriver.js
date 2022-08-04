const { MongoClient } = require('mongodb');

let db;
let productDetailColl;
let relatedProductColl;
let productDetail;
// ================== MongoDB Connect ==================//
// Initialize connection once
MongoClient.connect('mongodb://localhost:8080/', { useNewUrlParser: true }, (err, database) => {
  if (err) throw err;

  db = database.db('betterSDC');
  productDetailColl = db.collection('product_detail');
  relatedProductColl = db.collection('related');
  productDetail = db.collection('style_detail');
});

// ================== Server Functions ==================//
// ------------------ getData ------------------ //
function findProducts(page, count) {
  let reqestAmount = page * count;
  const query = {};
  const queryOption = { projection: { features: 0, _id: 0 } };
  // prevent user request to many data
  reqestAmount = reqestAmount <= 200 ? reqestAmount : 20;
  return productDetailColl
    .find(query, queryOption)
    .limit(reqestAmount)
    .toArray();
}

function findRelatedProducts(productId) {
  const query = { current_product_id: productId };
  const queryOption = { projection: { _id: 0 } };
  return relatedProductColl
    .find(query, queryOption)
    .limit(48)
    .toArray();
}

function findOneProductDetail(productId) {
  const query = { id: productId };
  const queryOption = { projection: { _id: 0 } };
  return productDetailColl
    .findOne(query, queryOption);
}

function findOneProductStyles(productId) {
  const query = { productId };
  return productDetail.find(query).toArray();
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

module.exports = {
  findProducts,
  findRelatedProducts,
  findOneProductDetail,
  findOneProductStyles,
  transformRelatedProducts,
  transformStyles,
};
