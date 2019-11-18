import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
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
      <div className="WalkUpConfirm">
        <h1>Contact Info</h1>
        <br />
        <form>
          <p>Badge #{this.props.match.params.id}</p>
          <p>First Name
            <br />
            <input
              required
              type="text"
              placeholder="First name"
              value={this.state.volunteerFirstName}
              onChange={this.handleInputChange('volunteerFirstName')}>
            </input>
          </p>
          <p>Discord Name
              <br />
            <input
              required
              type="text"
              placeholder="Discord name"
              value={this.state.discordName}
              onChange={this.handleInputChange('discordName')}>
            </input>
          </p>
          <p>Phone Number
            <br />
            <input
              required
              type="tel"
              placeholder="Phone number"
              value={this.state.phoneNumber}
              onChange={this.handleInputChange('phoneNumber')}>
            </input>
          </p>
          <p>Email
            <br />
            <input
              required
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleInputChange('email')}>
            </input>
          </p>
          <br />
        </form>
        <button onClick={this.cancelButton}>Cancel</button>
        <button onClick={this.submitInfo}>Confirm</button>
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