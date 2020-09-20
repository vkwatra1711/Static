const express = require('express');
const { getStores, addStore } = require('../api.js');

const router = express.Router();

router
  .route('/')
  .get(getStores)
  .post(addStore);

module.exports = router;
