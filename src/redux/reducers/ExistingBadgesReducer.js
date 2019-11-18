const ExistingBadgesReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_EXISTING_BADGES':
            return action.payload
        default:
            return state;
    }
}

export default ExistingBadgesReducer