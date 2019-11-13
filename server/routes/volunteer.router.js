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
                queryText += `(${rolesToPost[i].departmentID}, $${i + 1}, ${rolesToPost[i].okForWalkUp}) RETURNING "RoleID", "RoleName";`
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
const postShift = (roles, data) => {
    let shifts = []
    data.forEach(row => {
        let id = 0;
        roles.forEach(role => {
            if (role.RoleName === row.role) {
                id = role.RoleID
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
    // console.log('Role', shifts);
    return queryText;
}

/**
 * POST route for new schedule
 */
router.post('/schedule', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
    console.log(req.body.data);
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
        const postShiftQuery = postShift(roles.rows, req.body.data);
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