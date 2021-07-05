'use-strict'
const pool = require('../schema/DBConnection');

async function searchSaleQuery(uid){
  let sale = null;

  await pool
  .query('SELECT * from sales WHERE uid = $1', [uid])
  .then(response => {
    response.rows ? sale = response.rows[0] :  sale = {}
  })

  return sale;
}
async function insertSaleQuery(sale){
  // ADD CHECK
  const resp = await pool.query('INSERT INTO sales (amount, uid_client, uid_employee, saledt) VALUES ($1,$2,$3,$4)'
          ,[sale.amount, sale.uid_client, sale.uid_employee, sale.saleDt]).then(response => response.rowCount);
  
  return resp ? true : false;
}

async function updateSaleQuery(sale){
  const response = await pool.query('UPDATE sales SET amount = $1, uid_client = $2, uid_employee = $3, saleDt = $4 WHERE uid = $5'
                                    , [sale.amount,sale.uid_client,sale.uid_employee, sale.saleDt, sale.uid ])
                          .then(res => res.rowCount);
  return response ? true : false;
}

async function getAllSalesQuery(showDeleted) {
  if(showDeleted) {
    return await pool.query('SELECT * FROM sales').then(res => res.rows);
  }

  return await pool.query('SELECT * FROM sales WHERE deleted IS NULL').then(res => res.rows);
}

async function getAllSalesByEmployeeQuery(showDeleted, uid) {
  if(showDeleted) {
    return await pool.query('SELECT * FROM sales WHERE uid_client = $1',[uid]).then(res => res.rows);
  }

  return await pool.query('SELECT * FROM sales WHERE deleted IS NULL and uid_client = $1',[uid]).then(res => res.rows);
}

async function setDeletedInDB(uid) {
  const response = await pool.query('UPDATE sales SET deleted = true WHERE uid = $1', [uid])
                          .then(res => res.rowCount);
  return response ? true : false;
}

module.exports = {
  searchSaleQuery,
  insertSaleQuery,
  updateSaleQuery,
  getAllSalesQuery,
  setDeletedInDB,
  getAllSalesByEmployeeQuery
}