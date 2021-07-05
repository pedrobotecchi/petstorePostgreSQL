'use-strict'
const config = require('../config.json');
const jwt = require('jsonwebtoken');

const queries = require('../queries/employees');

async function authenticate ({ username, password }) {
  const user = await queries.searchUserQuery(username);
  try {
    if(!user) throw 'User not found';

    const loginAccepted = user.password === password;
  
    if (!loginAccepted) throw 'Password is incorrect';
  
    // UPDATE lastLogin to actual Date
    queries.setLastLogin(user.uid);


    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.uid }, config.secret, { expiresIn: '1d' });
  
    return {
      user,
      token
    }
  } catch (err){
    return err;
  }
}

async function insertUserInDB (user) {
  return queries.insertEmployeeQuery(user) ? user : {};
}

async function setDeletedInDB (uid) {
  // Actually it's not deleted, its marked as deleted in the DB
  return await queries.setDeletedInDB(uid);
}

async function updateUserInDB (user, uid) {
  // UPDATE user with actual infos
  return queries.updateEmployeeQuery(user,uid) ? user : {};
}

async function checkIfUserExistsByIDorUser (username) {
  if(username) {
    return queries.searchUserQuery(username);
  }
  return null;
}

async function getAll (showDeleted) {
  return await queries.getAllUsersQuery(showDeleted);
}

// helper functions

async function getUserInfo (uid) {
  const info = await queries.searchUserQuery(uid);
  return omitPassword(info)
}

function omitPassword (userInfo) {
  // not working :
  // const { password, ...userWithoutPassword } = user;
  const { uid, username, name, lastlogin, deleted } = userInfo
  return { uid: uid, username: username, name: name, lastLogin: lastlogin ? lastlogin : '--', deleted: deleted }
}


module.exports = {
  authenticate,
  getAll,
  omitPassword,
  checkIfUserExistsByIDorUser,
  insertUserInDB,
  updateUserInDB,
  getUserInfo,
  setDeletedInDB
}