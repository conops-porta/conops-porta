import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';

class WalkUpVerify extends Component {

  componentDidMount() {
    this.checkExistingBadges();
    this.validateBadgeNumber();
  }

  state = {
    volunteerFirstName: '',
    discordName: '',
    phoneNumber: '',
    email: '',
  }

  // validate attendee eligibility to pick up walk up shifts
  validateBadgeNumber = () => {
    axios.get(`/api/walkup/validatebadge/${this.props.match.params.id}`)
      .then(response => {
        // calculate age of attendee
        let today = new Date();
        let birthDate = new Date(response.data.DateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        let month = today.getMonth() - birthDate.getMonth()
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        // make sure attendee is over 16 and NOT flagged as no volunteer
        if (response.data.FlaggedNoVolunteer === false && age >= 16) {
          return;
        } else {
          swal({
            title: `No shifts available at this time`,
            text: 'Please check with registration if you have questions',
          })
          this.props.history.push('/volunteer-walk-up');
        }
      }).catch(error => {
        console.log(error)
      })
  }

  // check badge number against all badges associated with volunteers to route attendee to shifts page if already in volunteer table
  checkExistingBadges = () => {
    this.props.reduxStore.ExistingBadgesReducer.map(badge => {
      if ((badge.BadgeNumber) === this.props.match.params.id) {
        this.props.history.push(`/volunteer-walk-up/badge/${this.props.match.params.id}`)
      }
      return true;
    })
  }

  handleInputChange = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  } // end handleInputChange

  // posts attendee info to volunteer table and routes to shift selection page
  submitInfo = () => {
    // console.log(this.state);
    if (this.state.volunteerFirstName === '' || this.state.discordName === '' || this.state.phoneNumber === '' || this.state.email === '') {
      swal({
        text: 'Please fill out all fields',
        icon: 'warning'
      })
    } else {
      axios.post(`/api/walkup/info/${this.props.match.params.id}`, this.state)
        .then(response => {
          // console.log(response)
        }).catch(error => {
          console.log(error)
        })
      this.props.history.push(`/volunteer-walk-up/badge/${this.props.match.params.id}`)
    }
  }

  cancelButton = () => {
    // console.log('cancel btn click')
    this.props.history.push(`/volunteer-walk-up`)
  }

  render() {
    return (
      <div className="WalkUpConfirm" style={{ textAlign: "center" }}>
        <h1>Contact Info</h1>
        <p>Badge #{this.props.match.params.id}</p>
        <TextField
          required
          style={{ margin: "5px" }}
          type="text"
          variant="outlined"
          label="First name"
          value={this.state.volunteerFirstName}
          onChange={this.handleInputChange('volunteerFirstName')}>
        </TextField>
        <br />
        <TextField
          required
          style={{ margin: "5px" }}
          type="text"
          variant="outlined"
          label="Discord name"
          value={this.state.discordName}
          onChange={this.handleInputChange('discordName')}>
        </TextField>
        <br />
        <TextField
          required
          style={{ margin: "5px" }}
          type="tel"
          variant="outlined"
          label="Phone number"
          value={this.state.phoneNumber}
          onChange={this.handleInputChange('phoneNumber')}>
        </TextField>
        <br />
        <TextField
          required
          style={{ margin: "5px" }}
          type="email"
          variant="outlined"
          label="Email"
          value={this.state.email}
          onChange={this.handleInputChange('email')}>
        </TextField>
        <br />
        <Button color="secondary" variant="contained" onClick={this.cancelButton} style={{ margin: "5px" }}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={this.submitInfo} style={{ margin: "5px" }}>
          Confirm
        </Button>
      </div>
    )
  }
}

const mapStateToProps = reduxStore => {
  return {
    reduxStore
  };
};

export default connect(mapStateToProps)(WalkUpVerify);