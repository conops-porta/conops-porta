const VolunteerWalkUpReducer = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_WALKUP_BADGE_NUMBER':
            return action.payload
        default:
            return state;
    }
}


export default VolunteerWalkUpReducer;