const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// GET routes
// GET route for total volunteer hours
router.get('/hours', rejectUnauthenticated, rejectNonVetted, (req, res) => {
    let queryText = `
        SELECT
            "Shift"."BadgeNumber",
            "Attendee"."FirstName",
            "Attendee"."LastName",
            "VolunteerContact"."VolunteerDiscord",
        -- the ShiftsScheduled and ShiftsWorked tables are aliases created by the joins below
            "ShiftsScheduled"."TotalScheduled" AS "HoursScheduled",
        -- coalesce to make sure NULL values are converted to zero --
            COALESCE("ShiftsWorked"."TotalWorked", 0) + COALESCE("VolunteerContact"."VolunteerHours", 0) AS "HoursWorked"
        FROM "Shift"
        -- create a table from a subquery with the counts of total shifts containing distinct badge numbers --
        INNER JOIN (
                SELECT "BadgeNumber", COUNT("ShiftID") AS "TotalScheduled" FROM "Shift"
                WHERE "BadgeNumber" IS NOT NULL
                GROUP BY "BadgeNumber"
            ) AS "ShiftsScheduled"
            ON "Shift"."BadgeNumber" = "ShiftsScheduled"."BadgeNumber"
        -- create another table counting only shifts that have already happened (or at least started)
        -- where the user has not been flagged as a no-show
        -- (outer join in case all someone's shifts are in the future)
        LEFT OUTER JOIN (
                SELECT "BadgeNumber", COUNT("ShiftID") AS "TotalWorked" FROM "Shift"
                WHERE "BadgeNumber" IS NOT NULL
                AND "NoShow" IS false
                AND (
                    "Shift"."ShiftDate" < CURRENT_DATE
                    OR (
                        "Shift"."ShiftDate" = CURRENT_DATE
                        AND "Shift"."ShiftTime" < CURRENT_TIME
                    )
                )
                GROUP BY "BadgeNumber"
            ) AS "ShiftsWorked"
            ON "Shift"."BadgeNumber" = "ShiftsWorked"."BadgeNumber"
        -- bring in attendee data for all shift volunteers
        INNER JOIN "Attendee" ON "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
        -- bring in volunteer data for everyone in the volunteer table
        -- (outer join in case so nobody who isn't in there yet)
        LEFT OUTER JOIN "VolunteerContact" ON "Attendee"."VolunteerID" = "VolunteerContact"."VolunteerID"
        GROUP BY "Shift"."BadgeNumber", "Attendee"."FirstName", "Attendee"."LastName", "VolunteerContact"."VolunteerDiscord", "VolunteerContact"."VolunteerHours", "ShiftsScheduled"."TotalScheduled", "ShiftsWorked"."TotalWorked";
    `;
    pool.query(queryText)
        .then((result) => {
            // console.log('in volunteer hours GET router:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer hours GET router:', error)
            res.sendStatus(500)
        })
})

// GET route for filtering shifts by volunteer name
router.get('/volunteer-names', rejectUnauthenticated, rejectNonVetted, (req, res) => {
    let queryText = `SELECT "VolunteerContact"."VolunteerID", "Attendee"."BadgeNumber", "VolunteerContact"."VolunteerName"
  FROM "VolunteerContact" 
  JOIN "Attendee" ON "VolunteerContact"."VolunteerID" = "Attendee"."VolunteerID"
 GROUP BY "VolunteerContact"."VolunteerID", "Attendee"."BadgeNumber", "VolunteerContact"."VolunteerName"
  ORDER BY "VolunteerName" ASC;`
    pool.query(queryText)
        .then((result) => {
            // console.log('in volunteer/contacts GET router:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer/contacts GET router:', error)
            res.sendStatus(500)
        })
})

// GET route for all volunteer portal shifts
router.get('/shifts', rejectUnauthenticated, rejectNonVetted, async (req, res) => {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const getShiftsQuery = `SELECT 
        "Shift"."ShiftDate",
        "Shift"."ShiftTime",
        json_agg("Shift") AS "Shifts",
        "Department"."DepartmentName",
        json_agg(DISTINCT "Role") AS "Roles"
        FROM "Shift"
        JOIN "Role" ON "Role"."RoleID" = "Shift"."RoleID"
        JOIN "Department" ON "Department"."DepartmentID" = "Role"."DepartmentID"
        GROUP BY "Department"."DepartmentName", "Shift"."ShiftDate", "Shift"."ShiftTime"
        ORDER BY "Shift"."ShiftDate", "Shift"."ShiftTime";`;
        const shiftResults = await connection.query(getShiftsQuery);
        await connection.query('COMMIT');
        res.send(shiftResults.rows);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in volunteer-portal shifts GET route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

// GET route for single shifts so page can re-render on assigning/removing volunteer from shift
router.get('/single-shift/:id', rejectUnauthenticated, rejectNonVetted, async (req, res) => {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const getShiftsQuery = `SELECT * FROM "Shift" WHERE "ShiftID" = $1;`;
        const shiftResults = await connection.query(getShiftsQuery, [req.params.id]);
        await connection.query('COMMIT');
        res.send(shiftResults.rows);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in volunteer-portal shifts GET route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

// GET route for all departments to populate dropdown
router.get('/departments', rejectUnauthenticated, rejectNonVetted, async (req, res) => {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const getDepartmentsQuery = `SELECT
        "DepartmentID",
        "DepartmentName"
        FROM "Department"
        ORDER BY "DepartmentName" ASC;`;
        const shiftResults = await connection.query(getDepartmentsQuery);
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

// PUT route for removing a badge number from a shift
router.put('/remove-volunteer/:id', rejectUnauthenticated, rejectNonVetted, async (req, res) => {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const queryText = `UPDATE "Shift" SET "BadgeNumber" = NULL WHERE "ShiftID" = $1;`;
        await connection.query(queryText, [req.params.id]);
        await connection.query('COMMIT');
        await res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in volunteer-portal PUT route', error);
        await res.sendStatus(500);
    } finally {
        connection.release();
    }
})

// PUT route for adding a badge number to a shift
router.put('/add-volunteer/:id', rejectUnauthenticated, rejectNonVetted, async (req, res) => {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const queryText = `UPDATE "Shift" SET "BadgeNumber" = $1 WHERE "ShiftID" = $2;`;
        await connection.query(queryText, [req.body.BadgeNumber, req.params.id]);
        await connection.query('COMMIT');
        await res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in volunteer-portal PUT route', error);
        await res.sendStatus(500);
    } finally {
        connection.release();
    }
})


module.exports = router;