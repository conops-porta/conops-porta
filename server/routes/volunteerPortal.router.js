const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', rejectUnauthenticated, (req, res) => {
    let queryText = ``
    pool.query(queryText)
        .then((result) => {
            console.log('in volunteer GET router:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer GET router:', error)
            res.sendStatus(500)
        })
})



module.exports = router;