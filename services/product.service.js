'use-strict'
const queries = require('../queries/products');

async function insertProductInDB (product) {
  return queries.insertProductQuery(product) ? product : {};
}

async function setDeletedInDB (uid) {
  // Actually it's not deleted, its marked as deleted in the DB
  return await queries.setDeletedInDB(uid);
}

async function updateProductInDB (product, uid) {
  // UPDATE client with actual infos
  return queries.updateProductQuery(product,uid) ? product : {};
}

async function checkIfProductExists (uid) {
  if(uid) {
    return queries.searchProductQuery(uid);
  }
  return null;
}

async function getAll (showDeleted) {
  return await queries.getAllProductsQuery(showDeleted);
}

async function getProductByID (uid) {
  const info = await queries.getProductByIDQuery(uid);
  return info;
}

// helper functions

async function getProductInfo (uid) {
  const info = await queries.searchProductQuery(uid);
  return info;
}

module.exports = {
  getAll,
  getProductByID,
  checkIfProductExists,
  insertProductInDB,
  updateProductInDB,
  getProductInfo,
  setDeletedInDB
}
