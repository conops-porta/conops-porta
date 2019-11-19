import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';

class WalkUpVerify extends Component {

  state = {
    volunteerFirstName: '',
    discordName: '',
    phoneNumber: '',
    email: ''
  }

  handleInputChange = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  } // end handleInputChange

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
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
      this.props.history.push(`/volunteer-walk-up/submit/${this.props.match.params.id}`)
    }
  }

  cancelButton = () => {
    console.log('cancel btn click')
    this.props.history.push(`/volunteer-walk-up`)
  }

  render() {
    return (
      <div className="WalkUpConfirm" style={{ textAlign: "center" }}>
        <h1>Contact Info</h1>
        <br />
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
        <Button color="secondary" variant="contained" onClick={this.cancelButton}>Cancel</Button>
        <Button color="primary" variant="contained" onClick={this.submitInfo}>Confirm</Button>
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