const express = require('express');
const path = require('path');
const router = express.Router();
const { getNames, addName } = require("../controllers/nameController");


// Home route: Displays the list of names
router.get('/names', getNames);

// Handle POST request for adding a new person
router.post('/add', addName);

module.exports = router;
