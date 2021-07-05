'use-strict'
const { lte } = require('lodash');
const pool = require('../schema/DBConnection');

async function searchClientQuery(search){
  let client = null;
  if(typeof search === 'string') {
    await pool
    .query('SELECT * from clients WHERE cpf = $1', [search])
    .then(response => {
      response.rows ? client = response.rows[0] :  client = {}
    })

    return client;
  }

  await pool
  .query('SELECT * from clients WHERE uid = $1', [search])
  .then(response => {
    response.rows ? client = response.rows[0] :  client = {}
  })

  return client;
}

async function insertClientQuery(client){
  // ADD CHECK
  const resp = await pool.query('INSERT INTO clients (name, phone, address, cpf) VALUES ($1,$2,$3,$4)'
          ,[client.name, client.phone, client.address, client.cpf]).then(response => response.rowCount);
  
  return resp ? true : false;
}

async function updateClientQuery(client, uid){
  const response = await pool.query('UPDATE clients SET name = $1, phone = $2, address = $3, cpf = $4 WHERE uid = $4'
                                    , [client.name,client.username,client.password, uid])
                          .then(res => res.rowCount);
  return response ? true : false;
}

async function getAllClientsQuery(showDeleted) {
  if(showDeleted) {
    return await pool.query('SELECT * FROM clients').then(res => res.rows);
  }

  return await pool.query('SELECT * FROM clients WHERE deleted IS NULL').then(res => res.rows);
}

async function getClientByIDQuery(uid) {
  let client = await pool.query('SELECT * FROM clients WHERE uid = $1',[uid]).then(res => res.rows);
  if(client) {
    client[0].dogs = await pool.query('SELECT * FROM dogs WHERE uid_client = $1',[uid]).then(res => res.rows);
  }

  return client;
}

async function setDeletedInDB(uid) {
  const response = await pool.query('UPDATE clients SET deleted = true WHERE uid = $1', [uid])
                          .then(res => res.rowCount);
  return response ? true : false;
}

module.exports = {
  searchClientQuery,
  insertClientQuery,
  updateClientQuery,
  getAllClientsQuery,
  setDeletedInDB,
  getClientByIDQuery
}