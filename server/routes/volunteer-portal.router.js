const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', rejectUnauthenticated, rejectNonVetted, (req, res) => {
    let queryText = ``;
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
            console.log('in volunteer hours GET router:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer hours GET router:', error)
            res.sendStatus(500)
        })
})

/**
 * GET route volunteers for filtering shifts
 */
router.get('/volunteer-names', rejectUnauthenticated, (req, res) => {
    let queryText = `SELECT "VolunteerContact"."VolunteerID", "Attendee"."BadgeNumber", "VolunteerContact"."VolunteerName"
  FROM "VolunteerContact" 
  JOIN "Attendee" ON "VolunteerContact"."VolunteerID" = "Attendee"."VolunteerID"
 GROUP BY "VolunteerContact"."VolunteerID", "Attendee"."BadgeNumber", "VolunteerContact"."VolunteerName";`
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

/**
 * GET route for all volunteer portal shifts
 */
router.get('/shifts', async (req, res) => {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const getShiftsQuery = `  SELECT 
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
        console.log('error in walkup shifts GET route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

/**
 * PUT route for removing a badge number from a shift
 */
router.put('/remove-volunteer/:id')

module.exports = router;