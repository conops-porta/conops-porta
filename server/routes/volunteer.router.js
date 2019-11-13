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
            console.log('in volunteer/shifts GET router:', result.rows);
            // res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer/shifts GET router:', error)
            res.sendStatus(500)
        })
});

/**
 * POST route for new schedule
 */
router.post('/schedule', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    let totalDepartmentList = []

    req.body.data.map(role => {
        totalDepartmentList.push(role.department)
    })
    let uniqueDepartmentList = [...new Set(totalDepartmentList)]
    console.log(uniqueDepartmentList);
    let postDeptQuery = `INSERT INTO "department" ("DepartmentName") VALUES `
    for (let i = 0; i < uniqueDepartmentList.length; i++) {
        if (i == uniqueDepartmentList.length - 1) {
            postDeptQuery += `($${i + 1}) RETURNING "DepartmentID", "DepartmentName";`
        } else {
            postDeptQuery += `($${i + 1}),`
        }
    }
    console.log('Dept', postDeptQuery);

    let postRoleQuery = `INSERT INTO "role" ("DepartmentID", "RoleName") VALUES `
    for (let i = 0; i < req.body.data.length; i++) {
        if (i == req.body.data.length - 1) {
            postRoleQuery += `(${i + 1}, $${i + 1}) RETURNING "RoleID", "RoleName";`
        } else {
            postRoleQuery += `(${i + 1}, $${i + 1}),`
        }
    }
    console.log('Role', postRoleQuery);

    let postShiftQuery = `INSERT INTO "shift" ("RoleID", "ShiftDate", "ShiftTime") VALUES `
    for (let i = 0; i < req.body.data.length; i++) {
        for (let j = 0; j < req.body.data[i].shifts.length; j++) {
            let shift = req.body.data[i].shifts[j];
            for (let k=0; k< shift.numOfVolunteers; k++){
                postShiftQuery += `(RoleID, shift.date, shift.time);`;
            }
        }
    }
    console.log('Shift', postShiftQuery);

    // })
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



router.get('/contacts', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    let queryText = `SELECT "VolunteerID", "VolunteerName", "VolunteerDiscord", "VolunteerEmail", "VolunteerPhone", count("shift") 
                    FROM "volunteer" 
                    JOIN "shift" ON "volunteer"."VolunteerID" = "shift"."VolunteerID"
                    GROUP BY "VolunteerID";`
    pool.query(queryText)
        .then((result) => {
            console.log('in volunteer/contacts GET router:', result.rows);
            // res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer/contacts GET router:', error)
            res.sendStatus(500)
        })
})
module.exports = router;