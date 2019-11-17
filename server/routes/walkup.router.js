const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

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
 * POST route to add attendee to volunteer table
 */
router.post('/info/:id', async (req, res) => {
    // console.log('in walk up info POST route', req.body, req.params);
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const queryText = `INSERT INTO "VolunteerContact" ("VolunteerName", "VolunteerDiscord", "VolunteerPhone", "VolunteerEmail", "BadgeNumber")
            VALUES ($1, $2, $3, $4, $5);`;
        await connection.query(queryText, [req.body.volunteerFirstName, req.body.discordName, req.body.phoneNumber, req.body.email, req.params.id])
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
    console.log('in selected shifts put route', req.body, req.params);
    let shiftID = []
    req.body.forEach(id => (shiftID.push(id.ShiftID)))
    console.log('in shiftID array:', shiftID);
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