'use-strict'

const queries = require('../queries/dogs');

async function getDogsByClient (uid) {
  let dogs = null

  await Dog.find({ uid_client: uid })
    .then(results => { dogs = results })

  return dogs
}

async function setDeletedInDB (uid) {
  // Actually it's not deleted, its marked as deleted in the DB
  return await queries.setDeletedInDB(uid);
}

async function insertDogInDB (dog) {
  return queries.insertDogQuery(dog) ? dog : {};
}

async function updateDogInDB (dog, uid) {
  // UPDATE dog with actual infos
  return queries.updateDogQuery(dog,uid) ? dog : {};
}

async function checkIfDogExists (dog, uid_client) {
  return queries.searchDogQuery(dog,uid_client);
}

async function getAll (showDeleted) {
  return await queries.getAllDogsQuery(showDeleted);
}

// helper functions

async function getDogInfo (uid) {
  const info = await queries.searchDogByIDQuery(uid);
  return info;
}

module.exports = {
  getAll,
  checkIfDogExists,
  insertDogInDB,
  updateDogInDB,
  getDogInfo,
  getDogsByClient,
  setDeletedInDB
}