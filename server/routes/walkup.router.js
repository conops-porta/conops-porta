const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const { rejectNonAdmin } = require('../modules/isAdminAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for all walkups
 */
router.get('/badgenumber/:id', (req, res) => {
    console.log('req.params', req.params.id);
    
    let queryText = 
    // Just for testing badge number
    `SELECT "BadgeNumber" FROM "Attendee"
    WHERE "Attendee"."BadgeNumber" = $1;`;

    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log('in api/walkUp/badgeNumber GET router:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in api/walkUp/badgeNumber GET router:', error)
            res.sendStatus(500)
        })
});

// router.get('/badgenumber', (req, res) => {
//     pool.query(`SELECT "BadgeNumber" FROM "Attendee";`)
//         .then((result) => {
//             console.log('Result', result)
//         res.send(result.rows);
//     }).catch((error) => {
//         console.log('Error', error)
//         res.sendStatus(500);
//     });
// });

module.exports = router;