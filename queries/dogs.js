'use-strict'
const pool = require('../schema/DBConnection');

async function searchDogQuery(dogInfo,uid_client){
  let dog = null;

  await pool
  .query('SELECT * from dogs WHERE uid_client = $1 and name = $2', [uid_client, dogInfo.name])
  .then(response => {
    response.rows ? dog = response.rows[0] :  dog = {}
  })

  return dog;
}

async function searchDogByIDQuery(uid){
  let dog = null;

  await pool
  .query('SELECT * from dogs WHERE uid = $1', [uid])
  .then(response => {
    response.rows ? dog = response.rows[0] :  dog = {}
  })

  return dog;
}

async function insertDogQuery(dog){
  // ADD CHECK
  const resp = await pool.query('INSERT INTO dogs (name, breed, furr, uid_client, size) VALUES ($1,$2,$3,$4,$5)'
          ,[dog.name, dog.breed, dog.furr, dog.uid_client, dog.size]).then(response => response.rowCount);
  
  return resp ? true : false;
}

async function updateDogQuery(dog, uid){
  const response = await pool.query('UPDATE dogs SET name = $1, breed = $2, furr = $3, uid_client = $4, size = $5, deleted = $6 WHERE uid = $7'
                                    , [dog.name,dog.breed,dog.furr, dog.uid_client, dog.size, dog.deleted, uid ])
                          .then(res => res.rowCount);
  return response ? true : false;
}

async function getAllDogsQuery(showDeleted) {
  if(showDeleted) {
    return await pool.query('SELECT * FROM dogs').then(res => res.rows);
  }

  return await pool.query('SELECT * FROM dogs WHERE deleted IS NULL').then(res => res.rows);
}


async function setDeletedInDB(uid) {
  const response = await pool.query('UPDATE dogs SET deleted = true WHERE uid = $1', [uid])
                          .then(res => res.rowCount);
  return response ? true : false;
}

module.exports = {
  searchDogQuery,
  insertDogQuery,
  updateDogQuery,
  getAllDogsQuery,
  setDeletedInDB,
  searchDogByIDQuery
}