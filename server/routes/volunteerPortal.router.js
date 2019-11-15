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
        SELECT "Attendee"."BadgeNumber", "Attendee"."FirstName", "Attendee"."LastName", "VolunteerContact"."VolunteerDiscord",
            (
                "VolunteerContact"."VolunteerHours"
                + (
                    SELECT COUNT(*) FROM "Shift"
                    JOIN "Attendee" ON "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
                    WHERE "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
                    AND "Shift"."NoShow" = false
                    AND "Shift"."ShiftDate" < CURRENT_DATE
                    GROUP BY "Shift"."BadgeNumber"
                )
                + (
                    SELECT COUNT(*) FROM "Shift"
                    JOIN "Attendee" ON "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
                    WHERE "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
                    AND "Shift"."NoShow" = false
                    AND "Shift"."ShiftDate" = CURRENT_DATE
                    AND "Shift"."ShiftTime" < CURRENT_TIME
                    GROUP BY "Shift"."BadgeNumber"
                )
            ) AS "HoursWorked",
            (
                SELECT COUNT(*) FROM "Shift"
                JOIN "Attendee" ON "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
                WHERE "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
                GROUP BY "Shift"."BadgeNumber"
            ) AS "HoursScheduled"
        FROM "Shift"
        JOIN "Attendee" ON "Shift"."BadgeNumber" = "Attendee"."BadgeNumber"
        JOIN "VolunteerContact" ON "Attendee"."VolunteerID" = "VolunteerContact"."VolunteerID"
        GROUP BY "Shift"."BadgeNumber";
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