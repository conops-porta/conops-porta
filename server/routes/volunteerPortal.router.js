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
            "ShiftsScheduled"."TotalScheduled" AS "HoursScheduled",
            COALESCE("ShiftsWorked"."TotalWorked" + COALESCE("VolunteerContact"."VolunteerHours", 0), 0) AS "HoursWorked"
        FROM "Shift"
        LEFT OUTER JOIN LATERAL (
                SELECT "BadgeNumber", COUNT("ShiftID") AS "TotalScheduled" FROM "Shift"
                WHERE "BadgeNumber" IS NOT NULL
                GROUP BY "BadgeNumber"
            ) AS "ShiftsScheduled" ON "Shift"."BadgeNumber" = "ShiftsScheduled"."BadgeNumber"
        LEFT OUTER JOIN LATERAL (
                SELECT "BadgeNumber", COUNT("ShiftID") AS "TotalWorked" FROM "Shift"
                WHERE "BadgeNumber" IS NOT NULL
                AND "NoShow" IS false
                AND (
                    "Shift"."ShiftDate" < '2020-08-28' --CURRENT_DATE
                    OR (
                        "Shift"."ShiftDate" = '2020-08-28' --CURRENT_DATE
                        AND "Shift"."ShiftTime" < CURRENT_TIME
                    )
                )
                GROUP BY "BadgeNumber"
            ) AS "ShiftsWorked" ON "Shift"."BadgeNumber" = "ShiftsWorked"."BadgeNumber"
        JOIN "Attendee" ON "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
        JOIN "VolunteerContact" ON "Attendee"."VolunteerID" = "VolunteerContact"."VolunteerID"
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


module.exports = router;