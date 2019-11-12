const rejectNonVetted = (req, res, next) => {
    //check if user access level is equal or greater than vetted status
    if (req.user.authorization >= 0 ) {
        //they were authenticated!  User may do the next thing
        next();
    } else {
        res.sendStatus(403);
    }
};

module.exports = { rejectNonVetted };