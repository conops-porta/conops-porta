import React, { Component } from 'react';
import { connect } from 'react-redux';

class VolunteerWalkUp extends Component {
      state = {
        badgeNumber: ''
      }

  walkUpBadgeNumberSubmit = async(event) => {
    console.log('btn click', this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer)
    event.preventDefault();

    if(this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer){
      this.props.dispatch({
        type: 'FETCH_WALKUP_SHIFTS',
        payload: {
          badgeNumber: this.state.badgeNumber
        }
      });
      alert ('correct')
    } else {
      alert ('wrong')
      this.props.dispatch({type: 'BADGE_ERROR'});
    }
  } // end registeredUsers

  handleInputChange = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  } // end handleInputChange

  render() {
    return (
      <div>
        {/* <h1>Hats are cool</h1>
        {this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer}
          </h2>
        )} */}
        {JSON.stringify(this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer)}
        {JSON.stringify(this.state)}
        <h1>Walk-Up Volunteer</h1>
          <h2>Sign In</h2>
            <form onSubmit={this.walkUpBadgeNumberSubmit}>
              <p>Badge #
              <br/>
                <input value={this.state.badgeNumber} type="number" placeholder="badge number" value={this.state.badgeNumber} onChange={this.handleInputChange('badgeNumber')}></input>
                {/* {this.validator.message('badgeNumber', this.state.badgeNumber, 'required|numeric')} */}

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

