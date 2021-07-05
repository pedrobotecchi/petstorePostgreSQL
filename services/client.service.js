'use-strict'

const queries = require('../queries/clients');

async function insertClientInDB (client) {
  return queries.insertClientQuery(client) ? client : {};
}

async function updateClientInDB (client, uid) {
  // UPDATE client with actual infos
  return queries.updateClientQuery(client,uid) ? client : {};
}

async function checkIfClientExists (cpf) {
  if(cpf) {
    return queries.searchClientQuery(cpf);
  }
  return null;
}

async function getAll (showDeleted) {
  return await queries.getAllClientsQuery(showDeleted);
}

async function getClientByID (uid) {
  const info = await queries.getClientByIDQuery(uid);
  return info;
}

async function setDeletedInDB (uid) {
  // Actually it's not deleted, its marked as deleted in the DB
  return await queries.setDeletedInDB(uid);
}
// helper functions

async function getClientInfo (uid) {
  const info = await queries.searchClientQuery(uid);
  return info;
}

module.exports = {
  getAll,
  checkIfClientExists,
  insertClientInDB,
  updateClientInDB,
  getClientInfo,
  getClientByID,
  setDeletedInDB
}