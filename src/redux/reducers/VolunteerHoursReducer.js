const VolunteerHoursReducer = (state = [], action) => {
  switch (action.type) {
      case 'SET_VOLUNTEER_HOURS':
          return action.payload
      default:
          return state;
  }
}

export default VolunteerHoursReducer