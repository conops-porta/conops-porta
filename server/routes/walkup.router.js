const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const { rejectNonAdmin } = require('../modules/isAdminAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for all walkups
 */
router.get('/badgeNumber', (req, res) => {
    let queryText = ``
    pool.query(queryText, [req.body.BadgeNumber])
        .then((result) => {
            console.log('in api/walkUp/badgeNumber GET router:', result.rows);
            // res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in api/walkUp/badgeNumber GET router:', error)
            res.sendStatus(500)
        })
});

module.exports = router;