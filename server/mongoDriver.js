const { MongoClient } = require('mongodb');

let db;
let productDetailColl;
let relatedProductColl;
let productDetail;
// ================== MongoDB Connect ==================//
// Initialize connection once
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, database) => {
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
  // prevent user request to many data
  reqestAmount = reqestAmount <= 200 ? reqestAmount : 20;
  return productDetailColl
    .find({}, { projection: { features: 0, _id: 0 } })
    .limit(reqestAmount)
    .toArray();
}

function findRelatedProducts(productId) {
  return relatedProductColl
    .find(
      { current_product_id: productId },
      { projection: { _id: 0 } },
    )
    .limit(48)
    .toArray();
}

function findOneProductDetail(productId) {
  return productDetailColl
    .findOne({ id: productId }, { projection: { _id: 0 } });
}

function findOneProductStyles(productId) {
  return productDetail.find({ productId }).toArray();
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
