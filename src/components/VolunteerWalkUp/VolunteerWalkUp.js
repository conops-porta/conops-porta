import React, { Component } from 'react';
import { connect } from 'react-redux';

class VolunteerWalkUp extends Component {
      state = {
        badgeNumber: ''
      }

  walkUpBadgeNumberSubmit = async(event) => {
    console.log('btn click', this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer)
    event.preventDefault();

      this.props.dispatch({
        type: 'FETCH_WALKUP_SHIFTS',
        payload: {
          badgeNumber: this.state.badgeNumber
        }
      });
  } // end registeredUsers

  handleInputChange = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  } // end handleInputChange

  render() {
    return (
      <div>
        {JSON.stringify(this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer)}
        {/* {JSON.stringify(this.state)} */}
        <h1>Walk-Up Volunteer</h1>
          <h2>Sign In</h2>
            <form onSubmit={this.walkUpBadgeNumberSubmit}>
              <p>Badge #
              <br/>
                <input 
                  value={this.state.badgeNumber} 
                  type="number" 
                  placeholder="badge number" 
                  value={this.state.badgeNumber} 
                  onChange={this.handleInputChange('badgeNumber')}>
                </input>
                <button>Go</button>
              </p>
            </form>
      </div>
    );
  }
}

const mapStateToProps = reduxStore => {
  return {
    reduxStore
  };
};

export default connect(mapStateToProps)(VolunteerWalkUp);

