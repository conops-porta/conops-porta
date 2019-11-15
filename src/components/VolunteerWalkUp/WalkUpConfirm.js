import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';

class WalkUpConfirm extends Component {

    state = {
        volunteerFirstName: '',
        volunteerLastName: '',
        discordName: '',
        phoneNumber: ''
      }

      handleInputChange = propertyName => (event) => {
        this.setState({
          [propertyName]: event.target.value,
        });
      } // end handleInputChange

      verifyInfo = () => {
          console.log('confirm btn click')
        // swal({
        //   title: `Your badge # is ${this.state.badgeNumber}`,
        //   text: 'Proceed to shifts?',
        //   buttons: ['Cancel', 'Yes!']
        // }).then((value) => {
        //   if (value === true) {
        //     this.props.history.push(`/volunteer-walk-up/${this.state.badgeNumber}`)
        //   }
        // })
      }

      cancelButton = () => {
        console.log('cancel btn click')
      // swal({
      //   title: `Your badge # is ${this.state.badgeNumber}`,
      //   text: 'Proceed to shifts?',
      //   buttons: ['Cancel', 'Yes!']
      // }).then((value) => {
      //   if (value === true) {
      //     this.props.history.push(`/volunteer-walk-up/${this.state.badgeNumber}`)
      //   }
      // })
    }

    render() {
        return (
            <div className="WalkUpConfirm">
                Verify your info
                <br />
        {/* <h1>{this.props.badgeNumber}</h1> */}
        {/* <h2>{this.props.match.params.id}</h2> */}
        {/* {JSON.stringify(this.props.match.params.id)} */}

        <form>
        <p>Badge #{this.props.match.params.id}</p>
            <p>First Name
            <br />
              <input
              type="text"
              placeholder="First name"
              value={this.state.volunteerFirstName}
              onChange={this.handleInputChange('volunteerFirstName')}>
            </input> 
            </p>
            <p>Last Name
            <br/>
              <input
              type="text"
              placeholder="Last name"
              value={this.state.volunteerLastName}
              onChange={this.handleInputChange('volunteerLastName')}>
            </input> 
            </p>
            <p>Discord Name
              <br/>
              <input
              type="text"
              placeholder="Discord name"
              value={this.state.discordName}
              onChange={this.handleInputChange('discordName')}>
            </input>
            </p>
            <p>Phone Number
            <br/>     
             <input
              type="tel"
              name="phone"
              placeholder="Phone number"
            //   pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"required
              value={this.state.phoneNumber}
              onChange={this.handleInputChange('phoneNumber')}>
            </input>
            </p>
            <br/>
            <br />
        </form>
            <button onClick={this.cancelButton}>Cancel</button>
            <button onClick={this.verifyInfo}>Confirm</button>
            </div>
        )
    }
}

const mapStateToProps = reduxStore => {
    return {
        reduxStore
    };
};

export default connect(mapStateToProps)(WalkUpConfirm);