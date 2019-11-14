const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const { rejectNonAdmin } = require('../modules/isAdminAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for showing available shifts to walkups
 */
router.get('/shifts/:id', async (req, res) => {
    console.log('req.param', req.params);
    
    let queryText = ``;

    pool.query(queryText, [req.params.id])
        .then((result) => {
            // console.log('in api/walkUp/shifts GET router:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in api/walkUp/badgeNumber GET router:', error)
            res.sendStatus(500)
        })
});

module.exports = router;

/**
 * PUT route for walkups to sign up for shifts
 */
router.put('/shifts', async (req, res) => {
    // console.log('in attendee checkInAndPay PUT route');
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        // console.log(req.body);
        

        const queryText = ``;
        
        await connection.query(queryText, [])

        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        // console.log('error in walkup shifts PUT route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});