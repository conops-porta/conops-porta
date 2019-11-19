import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
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
        this.props.history.push(`/volunteer-walk-up/badge/${this.state.badgeNumber}`)
      }
    })
  }

  handleInputChange = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  } // end handleInputChange

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Walk-Up Volunteer</h1>
        <h2>Sign In</h2>
        <TextField
          label="Badge Number"
          variant="outlined"
          type="number"
          value={this.state.badgeNumber}
          onChange={this.handleInputChange('badgeNumber')}>
        </TextField>
        <br />
        <Button color="primary" variant="contained" onClick={this.confirmBadge}>Go!</Button>
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

