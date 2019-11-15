const SelectedShiftsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_SELECTED_SHIFTS':
            return action.payload
        default:
            return state;
    }
}

export default SelectedShiftsReducer