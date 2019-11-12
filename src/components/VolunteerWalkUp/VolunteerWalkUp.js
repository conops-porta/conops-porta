import React, { Component } from 'react';
import { connect } from 'react-redux';

class VolunteerWalkUp extends Component {
  state = {
    badgeNumber: ''
  };

  registeredUsers = (event) => {
    console.log('btn click')
    event.preventDefault();

    if (this.state.badgeNumber) {
      // this.props.dispatch({
      //   type: 'REGISTER',
      //   payload: {
      //     badgeNumber: this.state.badgeNumber,
      //   },
      // });
    }
  } // end registeredUsers

  handleInputChange = propertyName => (event) => {
    console.log('happening')
    this.setState({
      [propertyName]: event.target.value,
    });
  } // end handleInputChange

  render() {
    return (
      <div>
        <h1>Walk-Up Volunteer</h1>
        <h2>Sign In</h2>
        <form onSubmit={this.registeredUsers}>
            <p>Badge #
                <br/>
        <input type="number" placeholder="badge number" value={this.state.badgeNumber} onChange={this.handleInputChange('badgeNumber')}></input>
        <button>Go</button>
            </p>
        </form>
      </div>
    );
  }
}

export default connect()(VolunteerWalkUp);

