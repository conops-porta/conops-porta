const VolunteerWalkUpReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_WALKUP_SHIFTS':
            return action.payload
        default:
            return state;
    }
}

export default VolunteerWalkUpReducer