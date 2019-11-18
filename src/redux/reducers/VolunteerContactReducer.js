const VolunteerContactReducer = (state = [], action) => {
  switch (action.type) {
      case 'SET_VOLUNTEER_CONTACTS':
          return action.payload
      default:
          return state;
  }
}

export default VolunteerContactReducer