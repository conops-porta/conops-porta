const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


/**
 * GET route template
 */
router.get('/order-created', (req, res) => {

});

/**
 * POST route template
 */
router.post('/order-created', async (req, res) => {
    //pull data from the request body and send it over to the database pool
    // const connection = await pool.connect();
    // try {
    //
    // } catch (error){
    //
    // } finally {
    //     connection.release()
    // }


    res.status(201);
    res.send(JSON.stringify(req.body));
});

module.exports = router;