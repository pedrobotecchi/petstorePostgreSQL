'use-strict'
const express = require('express');
const router = express.Router();
const dogService = require('../services/dog.service');
const clientService = require('../services/client.service');

/* GET dogs listing. */
router.get('/', function (req, res, next) {
  const showDeleted = req.body.showDeleted;
  dogService.getAll(showDeleted).then(ret => { res.send(ret) });
})

/* GET especific dog. */
router.get('/:uid', function (req, res, next) {
  const uid = req.params.uid;
  dogService.getDogInfo(uid).then(ret => { res.send(ret) });
})

// Another routes
router.post('/insert', insertDog);
router.patch('/', updateDog);
router.delete('/:uid', removeDog);

async function removeDog (req, res, next) {
  const uid = req.params.uid
  try {
    await dogService.setDeletedInDB(uid)
    res.send('OK')
  } catch (err) {
    res.send(err)
  }
}

async function insertDog (req, res, next) {
  const uid_client = req.body.uid_client;
  // Check DB to see if client exists
  const clientExistsInDB = await clientService.checkIfClientExists(uid_client);

  try {
    if (!clientExistsInDB) throw 'Dog is not in DB'
    const dogInfo = req.body.dog;
    dogInfo.uid_client = uid_client;

    const dogExistsInDB = await dogService.checkIfDogExists(dogInfo, uid_client);
    if (dogExistsInDB) throw 'Dog is already inserted';

    const queryReturn = await dogService.insertDogInDB(dogInfo);
    res.send(queryReturn);
  } catch (err) {
    res.send(err);
  }
}

async function updateDog (req, res, next) {
  const uid = req.body.uid;

  // Check DB to see if user exists
  const dogExistsInDB = await dogService.getDogInfo(uid);

  try {
    if (!dogExistsInDB) throw "Dog don't exist in DB";

    await dogService.updateDogInDB(req.body.newInfos, uid)

    res.send(await dogService.getDogInfo(uid))
  } catch (err) {
    res.send(err)
  }
}

module.exports = router
