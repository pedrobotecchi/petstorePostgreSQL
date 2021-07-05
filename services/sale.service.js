'use-strict'

const queries = require('../queries/sales');

async function getSalesByEmployee (uid) {
  return await queries.getAllSalesByEmployeeQuery(uid);
}

async function insertSaleInDB (newSale) {
  newSale.saleDt = new Date(newSale.saleDt);
  return queries.insertSaleQuery(newSale) ? newSale : {};
}

async function updateSaleInDB (sale) {
  return queries.updateSaleQuery(sale) ? sale : {};
}

async function getSaleInfo (uid) {
  const info = await queries.searchSaleQuery(uid);
  return info;
}

async function checkIfSaleExists (uid) {
  return queries.searchSaleQuery(uid);
}

async function setDeletedInDB (uid) {
  // Actually it's not deleted, its marked as deleted in the DB
  return queries.setDeletedInDB(uid);
}

async function getAll (showDeleted) {
  return await queries.getAllSalesQuery(showDeleted);
}

module.exports = {
  getAll,
  insertSaleInDB,
  checkIfSaleExists,
  updateSaleInDB,
  getSaleInfo,
  getSalesByEmployee,
  setDeletedInDB
}