const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for attendee badge numbers
 */
router.get('/badgenumbers', async (req, res) => {
    // console.log(req.params.id);
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const checkBadgesQuery = 'SELECT "Attendee"."BadgeNumber" FROM "VolunteerContact" JOIN "Attendee" ON "Attendee"."VolunteerID" = "VolunteerContact"."VolunteerID";';
        const existingBadges = await connection.query(checkBadgesQuery)
        await connection.query('COMMIT');
        res.send(existingBadges.rows)
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in walkup attendee badges GET route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
})

/**
 * GET route for verifying attendee eligibility for shifts
 */
router.get('/validatebadge/:id', async (req, res) => {
    // console.log(req.params.id);
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const validateQuery = `SELECT "DateOfBirth", "FlaggedNoVolunteer" FROM "Attendee" WHERE "BadgeNumber" = $1;`
        const validateBadge = await connection.query(validateQuery, [req.params.id]);
        await connection.query('COMMIT');
        res.send(validateBadge.rows[0]);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in validate walkup GET route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
})

/**
 * GET route for showing available shifts to walkups
 */
router.get('/shifts/:id', async (req, res) => {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const getShiftsQuery = `SELECT 
        "Shift"."ShiftDate",
        "Shift"."ShiftTime",
        "Shift"."ShiftID",
        "Role"."RoleName",
        "Department"."DepartmentName",
        "Department"."DepartmentDescription"
        FROM "Shift"
        JOIN "Role" ON "Role"."RoleID" = "Shift"."RoleID"
        JOIN "Department" ON "Department"."DepartmentID" = "Role"."DepartmentID"
        WHERE "Role"."RoleForWalkUps" = true AND "Shift"."BadgeNumber" IS NULL
        ORDER BY "Shift"."ShiftDate", "Shift"."ShiftTime";`;
        const shiftResults = await connection.query(getShiftsQuery);
        await connection.query('COMMIT');
        res.send(shiftResults.rows);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in walkup shifts GET route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

/**
 * POST route to add attendee to volunteer table and tag volunteer ID to attendee in Attendee table
 */
router.post('/info/:id', async (req, res) => {
    // console.log('in walk up info POST route', req.body, req.params.id);
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const postInfoQuery = `INSERT INTO "VolunteerContact" ("VolunteerName", "VolunteerDiscord", "VolunteerPhone", "VolunteerEmail")
            VALUES ($1, $2, $3, $4) RETURNING "VolunteerID";`;
        const result = await connection.query(postInfoQuery, [req.body.volunteerFirstName, req.body.discordName, req.body.phoneNumber, req.body.email])
        const volunteerIDQuery = `UPDATE "Attendee" SET "VolunteerID" = $1 WHERE "Attendee"."BadgeNumber" = $2;`;
        await connection.query(volunteerIDQuery, [result.rows[0].VolunteerID, req.params.id])
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in volunteer POST route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

/**
 * PUT route to tag attendee badge # to selected shifts
 */
router.put('/selected/:id', async (req, res) => {
    // console.log('in selected shifts put route', req.body, req.params);
    let shiftID = []
    req.body.forEach(id => (shiftID.push(id.ShiftID)))
    // console.log('in shiftID array:', shiftID);
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        // SHIFT ID ARRAY STILL NEEDS TO BE SANITIZED!
        const queryText = `UPDATE "Shift" SET "BadgeNumber" = $1 WHERE "ShiftID" IN (${shiftID});`;
        await connection.query(queryText, [req.params.id])
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in selected shifts PUT route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

module.exports = router;