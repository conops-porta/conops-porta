import React, { Component } from 'react';
import { connect } from 'react-redux';

class VolunteerWalkUp extends Component {
  state = {
    badgeNumber: ''
  };

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <h1>Walk-Up Volunteer</h1>
        <h2>Sign Up</h2>
        <form>
          <p>Badge #
            <br />
            <input placeholder="badge number"></input>
            <button>Go</button>
          </p>
        </form>
      </div>
    );
  }
}

export default connect()(VolunteerWalkUp);

