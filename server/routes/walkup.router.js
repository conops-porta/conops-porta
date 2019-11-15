const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for showing available shifts to walkups
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
    } catch(error) {
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
 * PUT route for walkups to sign up for shifts
 */
router.put('/shifts', async (req, res) => {
    // console.log('in shifts PUT route', req.body);
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const queryText = ``;
        await connection.query(queryText, [])
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in walkup shifts PUT route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

module.exports = router;