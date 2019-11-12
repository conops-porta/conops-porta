const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const { rejectNonAdmin } = require('../modules/isAdminAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for all open shifts
 */
router.get('/shifts', (req, res) => {
    let queryText = ``
    pool.query(queryText, [req.body.AttendeeID])
        .then((result) => {
            console.log('in volunteer/shifts GET router:', result);
            // res.send(result.rows);
        })
        .catch((error) => {
            // console.log('error in sponsors GET router:', error)
            res.sendStatus(500)
        })
});

/**
 * POST route for new schedule
 */
router.post('/schedule', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    console.log('in new schedule POST route', req.body);
    // const connection = await pool.connect();
    // try {
    //     await connection.query('BEGIN');
    //     const schedule = req.body;
    //     // console.log('creating new schedule:', schedule);
    //     const queryText = ``;
    //     await connection.query(queryText, [])
    //     await connection.query('COMMIT');
    //     res.sendStatus(200);
    // } catch (error) {
    //     await connection.query('ROLLBACK');
    //     // console.log('error in scheudule POST route:', error);
    //     res.sendStatus(500);
    // } finally {
    //     connection.release();
    // }
});

/**
 * UPDATE route template
 */
router.put('/', (req, res) => {

});

module.exports = router;