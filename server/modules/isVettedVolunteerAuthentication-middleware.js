const rejectNonVetted = (req, res, next) => {
    //check if user access level is equal with Admin
    if (req.user.authorization == 0 ) {
        //they were authenticated!  User may do the next thing
        //Note!  Admin can do anything!!
        next();
    } else {
        res.sendStatus(403);
    }
};

module.exports = { rejectNonVetted };