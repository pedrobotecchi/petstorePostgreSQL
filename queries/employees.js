'use-strict'
const pool = require('../schema/DBConnection');

async function searchUserQuery(search){
  let user = null;
  
  if(typeof search === 'string') {
    await pool
    .query('SELECT * from employees WHERE username = $1', [search])
    .then(response => {
      response.rows ? user = response.rows[0] :  user = {}
    })

    return user;
  }

  await pool
  .query('SELECT * from employees WHERE uid = $1', [search])
  .then(response => {
    response.rows ? user = response.rows[0] :  user = {}
  })

  return user;
}

async function setLastLogin(uid){
  const now = new Date();
  const response = await pool.query('UPDATE employees SET lastLogin = $1 WHERE uid = $2', [now, uid]).then(res => res);

  return response;
}

async function insertEmployeeQuery(user){
  // ADD CHECK
  const resp = await pool.query('INSERT INTO employees (name, username, password) VALUES ($1,$2,$3)',[user.name, user.username, user.password]).then(response => response.rowCount);
  
  return resp ? true : false;
}

async function updateEmployeeQuery(user, uid){
  const response = await pool.query('UPDATE employees SET name = $1, username = $2, password = $3 WHERE uid = $4', [user.name,user.username,user.password, uid])
                          .then(res => res.rowCount);
  return response ? true : false;
}

async function getAllUsersQuery(showDeleted) {
  if(showDeleted) {
    return await pool.query('SELECT * FROM employees').then(res => res.rows);
  }

  return await pool.query('SELECT * FROM employees WHERE deleted IS NULL').then(res => res.rows);
}

async function setDeletedInDB(uid) {
  const response = await pool.query('UPDATE employees SET deleted = true WHERE uid = $1', [uid])
                          .then(res => res.rowCount);
  return response ? true : false;
}

module.exports = {
  searchUserQuery,
  setLastLogin,
  insertEmployeeQuery,
  updateEmployeeQuery,
  getAllUsersQuery,
  setDeletedInDB
}