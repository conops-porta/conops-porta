const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
    
});

/**
 * UPDATE route template
 */
router.put('/', (req, res) => {

});

module.exports = router;