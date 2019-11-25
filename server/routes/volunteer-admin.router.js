const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonAdmin } = require('../modules/isAdminAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// GET routes
// GET route for volunteer contacts
router.get('/contacts', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    let queryText = `
        SELECT
            "VolunteerContact"."VolunteerID",
            "VolunteerContact"."VolunteerName",
            "VolunteerContact"."VolunteerDiscord",
            "VolunteerContact"."VolunteerEmail",
            "VolunteerContact"."VolunteerPhone",
            "VolunteerContact"."VolunteerVetted",
            "MainDepartment"."DepartmentName" AS "MainDepartment",
            "SecondaryDepartment"."DepartmentName" AS "SecondaryDepartment",
            "ShiftsScheduled"."TotalScheduled" AS "ScheduledShifts", 
            "VolunteerContact"."VolunteerHours",
            "VolunteerContact"."VolunteerShirtSize",
            "Attendee"."BadgeNumber",
            "VolunteerContact"."VolunteerNotes"
        FROM "VolunteerContact"
        LEFT OUTER JOIN ( SELECT * FROM "Department" ) AS "MainDepartment"
            ON "MainDepartment"."DepartmentID" = "VolunteerContact"."MainDepartmentID"
        LEFT OUTER JOIN ( SELECT * FROM "Department" ) AS "SecondaryDepartment"
            ON "SecondaryDepartment"."DepartmentID" = "VolunteerContact"."SecondaryDepartmentID"
        LEFT OUTER JOIN "Attendee"
            ON "Attendee"."VolunteerID" = "VolunteerContact"."VolunteerID"
        LEFT OUTER JOIN (
                SELECT "BadgeNumber", COUNT("ShiftID") AS "TotalScheduled" FROM "Shift"
                WHERE "BadgeNumber" IS NOT NULL
                GROUP BY "BadgeNumber"
            ) AS "ShiftsScheduled"
            ON "Attendee"."BadgeNumber" = "ShiftsScheduled"."BadgeNumber"
        ORDER BY "VolunteerContact"."VolunteerName";`
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer/contacts GET router:', error)
            res.sendStatus(500)
        })
})

// GET route for all open shifts
router.get('/shifts', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    let queryText = `SELECT 
"Role"."RoleID",
"Department"."DepartmentName" AS department,
"Role"."RoleName" AS role,
"Role"."RoleForWalkUps" AS ok_for_walk_ups,
json_agg("ShiftDetails") AS shifts
FROM "Shift"
LEFT OUTER JOIN (
    SELECT
    "Shift"."ShiftID",
    "Shift"."ShiftDate",
    "Shift"."ShiftTime",
    "Shift"."RoleID",
    "Shift"."BadgeNumber",
    "Shift"."NoShow",
    "VolunteerContact"."VolunteerName"
    FROM "Shift"
    LEFT OUTER JOIN "Attendee" ON "Attendee"."BadgeNumber" = "Shift"."BadgeNumber"
    LEFT OUTER JOIN "VolunteerContact" ON "VolunteerContact"."VolunteerID" = "Attendee"."VolunteerID"
) AS "ShiftDetails" ON "ShiftDetails"."ShiftID" = "Shift"."ShiftID"
JOIN "Role" ON "Role"."RoleID" = "Shift"."RoleID"
JOIN "Department" ON "Department"."DepartmentID" = "Role"."DepartmentID"
GROUP BY "Department"."DepartmentName", "Role"."RoleID", "Role"."RoleName"
ORDER BY "Role"."RoleID";`
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer/shifts GET router:', error)
            res.sendStatus(500)
        })
});

// this checks if a schedule exists for conditional rendering in the 
// schedule manage home screen
router.get('/departments', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    let queryText = `SELECT
    "DepartmentID",
        "DepartmentName"
    FROM "Department"
    LIMIT 1;`
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in admin department GET router:', error)
            res.sendStatus(500)
        })
});
//

// GET route to get all shifts of a particular time slot 
// written as a post to allow sending req.body with time slot info
router.post('/time-slot-shifts', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    let queryText = `SELECT 
"Shift"."ShiftID",
"Shift"."BadgeNumber",
"VolunteerContact"."VolunteerName"
FROM "Shift"
JOIN "Role" ON "Role"."RoleID" = "Shift"."RoleID"
LEFT OUTER JOIN "Attendee" ON "Attendee"."BadgeNumber" = "Shift"."BadgeNumber"
LEFT OUTER JOIN "VolunteerContact" ON "VolunteerContact"."VolunteerID" = "Attendee"."VolunteerID"
WHERE "Role"."RoleID" = $1 AND "Shift"."ShiftDate" = $2 AND "Shift"."ShiftTime" = $3
GROUP BY "Shift"."ShiftID", "VolunteerContact"."VolunteerName";`
    pool.query(queryText, [req.body.RoleID, req.body.date, req.body.time])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer/time-slot-shifts GET router:', error)
            res.sendStatus(500)
        })
});

// Functions for new schedule POST
// create query and data for role post
const postRole = (departments, data) => {
    let rolesToPost = []
    let rolesToSend = []
    data.forEach(row => {
        let walkUp = false
        if (row.okForWalkUp == 'x' || row.okForWalkUp == 'X') {
            walkUp = true
        }
        departments.forEach(dept => {
            if (dept.DepartmentName === row.department) {
                rolesToPost.push({
                    departmentID: dept.DepartmentID,
                    roleName: row.role,
                    okForWalkUp: walkUp
                })
                rolesToSend.push(row.role)
            }
        })
    })
    //department is an object with departments.name and departments.id
    let queryText = `INSERT INTO "Role" ("DepartmentID", "RoleName", "RoleForWalkUps") VALUES `
    for (let i = 0; i < rolesToPost.length; i++) {
        if (i == rolesToPost.length - 1) {
            queryText += `(${rolesToPost[i].departmentID}, $${i + 1}, ${rolesToPost[i].okForWalkUp}) RETURNING "RoleID", "RoleName", "DepartmentID";`
        } else {
            queryText += `(${rolesToPost[i].departmentID}, $${i + 1}, ${rolesToPost[i].okForWalkUp}),`
        }
    }
    return {
        queryText: queryText,
        data: rolesToSend
    };
}

// create query and data for shift post
const postShift = (departments, roles, data) => {
    let shifts = []
    data.forEach(row => {
        let id = 0;
        departments.forEach(dept => {
            if (dept.DepartmentName === row.department) {
                roles.forEach(role => {
                    if (role.DepartmentID == dept.DepartmentID && role.RoleName === row.role) {
                        id = role.RoleID
                    }
                })
            }
        })
        row.shifts.forEach(shift => {
            for (let i = 0; shift.numOfVolunteers > i; i++) {
                shifts.push({
                    roleID: id,
                    date: shift.date,
                    time: shift.time
                })
            }
        })
    })
    //department is an object with departments.name and departments.id
    let queryText = `INSERT INTO "Shift" ("RoleID", "ShiftDate", "ShiftTime") VALUES `
    for (let i = 0; i < shifts.length; i++) {
        if (i == shifts.length - 1) {
            queryText += `(${shifts[i].roleID}, '${shifts[i].date}', '${shifts[i].time}');`
        } else {
            queryText += `(${shifts[i].roleID}, '${shifts[i].date}', '${shifts[i].time}'),`
        }
    }
    return queryText;
} // end functions for new schedule POST route

// POST routes
// POST route for new schedule
router.post('/schedule', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    let totalDepartmentList = []
    req.body.data.map(role => {
        totalDepartmentList.push(role.department)
    })
    let uniqueDepartmentList = [...new Set(totalDepartmentList)]
    let postDeptQuery = `INSERT INTO "Department" ("DepartmentName") VALUES `
    for (let i = 0; i < uniqueDepartmentList.length; i++) {
        if (i == uniqueDepartmentList.length - 1) {
            postDeptQuery += `($${i + 1}) RETURNING "DepartmentID", "DepartmentName";`
        } else {
            postDeptQuery += `($${i + 1}),`
        }
    }
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const departments = await connection.query(postDeptQuery, uniqueDepartmentList);
        const postRoles = postRole(departments.rows, req.body.data);
        const roles = await connection.query(postRoles.queryText, postRoles.data);
        const postShiftQuery = postShift(departments.rows, roles.rows, req.body.data);
        await connection.query(postShiftQuery);
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in scheudule POST route:', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

// POST route for new shifts
router.post('/shifts', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    let postShiftQuery = `INSERT INTO "Shift" ("ShiftDate", "ShiftTime", "RoleID") VALUES ($1, $2, $3);`
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        await connection.query(postShiftQuery, [req.body.date, req.body.time, req.body.roleID]);
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in shift POST route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
})

// POST route for new roles
router.post('/roles', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    let postRoleQuery = ``
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        await connection.query(postRoleQuery);
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in roles POST route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
})

// POST route for new departments
router.post('/departments', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    let postDeptQuery = ``
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        await connection.query(postDeptQuery);
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in roles POST route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
})

// PUT routes 
// *** PLACEHOLDER *** UPDATE route for edit roles
router.put('/roles', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    // console.log('in edit roles route', req.body);
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const queryText = ``;
        await connection.query(queryText, [])
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in edit roles PUT route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

// *** PLACEHOLDER *** UPDATE route for edit departments
router.put('/departments', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        const queryText = ``;
        await connection.query(queryText, [])
        await connection.query('COMMIT');
        res.sendStatus(200);
    } catch (error) {
        await connection.query('ROLLBACK');
        console.log('error in edit departments PUT route', error);
        res.sendStatus(500);
    } finally {
        connection.release();
    }
});

// DELETE routes
// DELETE shift route
router.delete('/shifts/:id', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    const id = req.params.id
    const queryText = 'DELETE FROM "Shift" WHERE "ShiftID" = $1;';
    pool.query(queryText, [id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error in Delete shift router', error);
            res.sendStatus(500);
        })
})

// DELETE role route
router.delete('/roles/:id', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    const id = req.params.id
    const queryText = 'DELETE FROM "Role" WHERE "RoleID" = $1;';
    pool.query(queryText, [id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error in Delete role router', error);
            res.sendStatus(500);
        })
})

// DELETE department route
router.delete('/departments/:id', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    const id = req.params.id
    const queryText = 'DELETE FROM "Department" WHERE "DepartmentID" = $1;';
    pool.query(queryText, [id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error in Delete department router', error);
            res.sendStatus(500);
        })
})

// DELETE ENTIRE SCHEDULE ........
router.delete('/delete-schedule', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    const queryText = 'DELETE FROM "Department";';
    pool.query(queryText)
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error in Delete entire schedule router', error);
            res.sendStatus(500);
        })
})

module.exports = router;