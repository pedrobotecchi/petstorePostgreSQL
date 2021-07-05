'use-strict'
const express = require('express');
const router = express.Router();
const clientService = require('../services/client.service');
const dogService = require('../services/dog.service');

/* GET users listing. */
router.get('/', function (req, res, next) {
  clientService.getAll().then(ret => { res.send(ret) });
})

/* GET a especific client. */
router.get('/:uid', function (req, res, next) {
  const uid = req.params.uid;
  clientService.getClientByID(uid).then(ret => { res.send(ret) });
})

// POST to insert Clients
router.post('/insert', insertClient);
router.patch('/', updateClient);
router.delete('/:uid', removeClient);

async function insertClient (req, res, next) {
  const cpf = req.body.cpf;

  // Check DB to see if client exists
  const clientExistsInDB = await clientService.checkIfClientExists(cpf);

  try {
    if (clientExistsInDB) throw 'Client already inserted';

    const insertedInDBFlag = await clientService.insertClientInDB(req.body);

    res.send(insertedInDBFlag);
  } catch (err) {
    res.send(err);
  }
}

async function updateClient (req, res, next) {
  const uid = req.body.uid;

  // Check DB to see if user exists
  const clientExistsInDB = await clientService.checkIfClientExists(uid);

  try {
    if (!clientExistsInDB) throw "Client don't exist in DB"

    await clientService.updateClientInDB(req.body.newInfos, uid);

    res.send(await clientService.getClientInfo(uid));
  } catch (err) {
    res.send(err)
  }
}

async function removeClient (req, res, next) {
  const uid = req.params.uid

  try {
    await clientService.setDeletedInDB(uid);

    res.send('OK');
  } catch (err) {
    res.send(err);
  }
}

module.exports = router
