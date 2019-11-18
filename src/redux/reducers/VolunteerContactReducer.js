const VolunteerContactReducer = (state = [], action) => {
  switch (action.type) {
      case 'SET_VOLUNTEER_CONTACT':
          return action.payload
      default:
          return state;
  }
}

export default VolunteerContactReducer