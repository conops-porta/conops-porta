import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';

class VolunteerWalkUp extends Component {
  state = {
    badgeNumber: ''
  }

  confirmBadge = () => {
    swal({
      title: `Your badge # is ${this.state.badgeNumber}`,
      text: 'Proceed to shifts?',
      buttons: ['Cancel', 'Yes!']
    }).then((value) => {
      if (value === true) {
        this.walkUpBadgeNumberSubmit();
      }
    })
  }

  walkUpBadgeNumberSubmit = async (event) => {
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
        <h1>Walk-Up Volunteer</h1>
        <h2>Sign In</h2>
        <form onSubmit={this.confirmBadge}>
          <p>Badge #
              <br />
            <input
              type="number"
              placeholder="badge number"
              value={this.state.badgeNumber}
              onChange={this.handleInputChange('badgeNumber')}>
            </input>
            <button>Go</button>
            <br />
            {JSON.stringify(this.props.reduxStore.VolunteerWalkUpReducer)}
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

