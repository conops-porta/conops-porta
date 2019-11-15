const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const { rejectNonVetted } = require('../modules/isVettedVolunteerAuthentication-middleware');
const { rejectNonAdmin } = require('../modules/isAdminAuthentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// GET routes
/**
 * GET route for contacts
 */
router.get('/contacts', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    let queryText = `SELECT "VolunteerID", "VolunteerName", "VolunteerDiscord", "VolunteerEmail", "VolunteerPhone", count("Shift"."ShiftID") 
                    FROM "VolunteerContact" 
                    JOIN "Shift" ON "VolunteerContact"."BadgeNumber" = "Shift"."BadgeNumber"
                    GROUP BY "VolunteerID";`
    pool.query(queryText)
        .then((result) => {
            console.log('in volunteer/contacts GET router:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer/contacts GET router:', error)
            res.sendStatus(500)
        })
})

/**
 * GET route for all open shifts
 */
router.get('/shifts', rejectUnauthenticated, rejectNonVetted, (req, res) => {
    let queryText = `SELECT 
"Role"."RoleID",
"Department"."DepartmentName" AS department,
"Role"."RoleName" AS role,
"Role"."RoleForWalkUps" AS ok_for_walk_ups,
json_agg("Shift") AS shifts
FROM "Shift"
JOIN "Role" ON "Role"."RoleID" = "Shift"."RoleID"
JOIN "Department" ON "Department"."DepartmentID" = "Role"."DepartmentID"
GROUP BY "Department"."DepartmentName", "Role"."RoleID", "Role"."RoleName"
ORDER BY "Role"."RoleID";`
    pool.query(queryText)
        .then((result) => {
            // console.log('in volunteer/shifts GET router:', result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error in volunteer/shifts GET router:', error)
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
                    // if (role.RoleName === row.role && dept.DepartmentName === row.department) {
                    if (role.DepartmentID == dept.DepartmentID && role.RoleName === row.role) {
                        id = role.RoleID
                    }
                })
            }
        })
        console.log('ID', id)
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
    // console.log('Role', shifts);
    return queryText;
}

// POST routes
/**
 * POST route for new schedule
 */
router.post('/schedule', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    // console.log(req.body.data);
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
        // console.log('DEPARTMENT IDS', departments.rows)
        const postRoles = postRole(departments.rows, req.body.data);
        // console.log('ROLE STUFF', postRoles)
        const roles = await connection.query(postRoles.queryText, postRoles.data);
        // console.log('ROLE IDs', roles.rows)
        const postShiftQuery = postShift(departments.rows, roles.rows, req.body.data);
        // console.log('SHIFT STUFF', postShiftQuery)
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

/**
 * POST route for new shifts
 */
router.post('/shifts', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    let postShiftQuery = ``
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN');
        await connection.query(postShiftQuery);
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

/**
 * POST route for new roles
 */
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

/**
 * POST route for new departments
 */
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
/**
 * UPDATE route for edit roles
 */
router.put('/roles', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    console.log('in edit roles route', req.body);
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

/**
 * UPDATE route for edit departments
 */
router.put('/departments', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    console.log('in edit departments route', req.body);
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
/**
 * DELETE shift route
 */
router.delete('/shifts/:id', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    const id = req.params.id
    const queryText = 'DELETE FROM "Shift" WHERE "ShiftID" = $1;';
    console.log('in delete shift id', id);
    pool.query(queryText, [id])
        .then((result) => {
            console.log('in Delete shift router', result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('in Delete shift router', error);
            res.sendStatus(500);
        })
})

/**
 * DELETE role route
 */
router.delete('/roles/:id', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    const id = req.params.id
    const queryText = 'DELETE FROM "Role" WHERE "RoleID" = $1;';
    console.log('in delete role id', id);
    pool.query(queryText, [id])
        .then((result) => {
            console.log('in Delete role router', result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('in Delete role router', error);
            res.sendStatus(500);
        })
})

/**
 * DELETE department route
 */
router.delete('/departments/:id', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    const id = req.params.id
    const queryText = 'DELETE FROM "Department" WHERE "DepartmentID" = $1;';
    console.log('in delete department id', id);
    pool.query(queryText, [id])
        .then((result) => {
            console.log('in Delete department router', result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('in Delete department router', error);
            res.sendStatus(500);
        })
})

module.exports = router;