import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';

class WalkUpVerify extends Component {

    state = {
        volunteerFirstName: '',
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
        this.props.history.push(`/volunteer-walk-up/submit/${this.props.match.params.id}`)

        // swal({
        //   title: `Thank You`,
        //   text: 'You sign up for:',
        //   icon: "success",
        //   // text: `Please write this down so you don't forget!`,
        // })
        // .then((value) => {
        //   if (value === true) {
        //     this.props.history.push(`/volunteer-walk-up`)
        //   }
        // })
      //   this.props.dispatch({
      //     type: 'POST_WALKUP_INFO',
      //     payload: this.props.match.params
      // });
      }

      cancelButton = () => {
        console.log('cancel btn click')
        this.props.history.push(`/volunteer-walk-up/${this.props.match.params.id}`)
    }

    render() {
        return (
            <div className="WalkUpConfirm">
                Verify your info
                <br />
        {/* <h1>{this.props.badgeNumber}</h1> */}
        {/* <h2>{this.props.match.params.id}</h2> */}
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
              type="number"
              placeholder="Phone number"
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

export default connect(mapStateToProps)(WalkUpVerify);