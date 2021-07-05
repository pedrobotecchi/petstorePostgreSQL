'use-strict'
const pool = require('../schema/DBConnection');

async function searchProductQuery(search){
  let product = null;
  if(typeof search === 'string') {
    await pool
    .query('SELECT * from products WHERE name = $1', [search])
    .then(response => {
      response.rows ? product = response.rows[0] :  product = {}
    })

    return product;
  }

  await pool
  .query('SELECT * from products WHERE uid = $1', [search])
  .then(response => {
    response.rows ? product = response.rows[0] :  product = {}
  })

  return product;
}

async function insertProductQuery(product){
  const resp = await pool.query('INSERT INTO products (name, amount, description) VALUES ($1,$2,$3)'
          ,[product.name, product.amount, product.description]).then(response => response.rowCount);
  
  return resp ? true : false;
}

async function updateProductQuery(product, uid){
  const response = await pool.query('UPDATE products SET name = $1, amount = $2, description = $3 WHERE uid = $4'
                                    , [product.name,product.amount,product.description, uid])
                          .then(res => res.rowCount);
  return response ? true : false;
}

async function getAllProductsQuery(showDeleted) {
  if(showDeleted) {
    return await pool.query('SELECT * FROM products').then(res => res.rows);
  }

  return await pool.query('SELECT * FROM products WHERE deleted IS NULL').then(res => res.rows);
}

async function getProductByIDQuery(uid) {
  return await pool.query('SELECT * FROM products WHERE uid = $1',[uid]).then(res => res.rows);
}

async function setDeletedInDB(uid) {
  const response = await pool.query('UPDATE products SET deleted = true WHERE uid = $1', [uid])
                          .then(res => res.rowCount);
  return response ? true : false;
}

module.exports = {
  searchProductQuery,
  insertProductQuery,
  updateProductQuery,
  getAllProductsQuery,
  setDeletedInDB,
  getProductByIDQuery
}