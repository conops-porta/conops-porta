import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';

import ShiftCard from './ShiftCard';

class WalkUpShifts extends Component {

    componentDidMount() {
        this.validateBadgeNumber();
    }

    validateBadgeNumber = () => {
        axios.get(`/api/walkup/validatebadge/${this.props.match.params.badgenumber}`)
            .then(response => {
                // check to see if attendee is over 16 years old
                let today = new Date();
                let birthDate = new Date(response.data.DateOfBirth);
                let age = today.getFullYear() - birthDate.getFullYear();
                let month = today.getMonth() - birthDate.getMonth()
                if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                console.log(age);
                
                // make sure attendee is over 16 and NOT flagged as no volunteer
                if (response.data.FlaggedNoVolunteer === false && age >= 16 ) {
                    this.walkUpBadgeNumberSubmit();
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

    walkUpBadgeNumberSubmit = () => {
        this.props.dispatch({
            type: 'FETCH_WALKUP_SHIFTS',
            payload: this.props.match.params
        });
    } // end registeredUsers

    render() {
        return (
            <div className="WalkUpShifts">
                <h1>Available shifts:</h1>
                {/* {JSON.stringify(this.props.reduxStore.VolunteerWalkUpReducer)} */}
                {this.props.reduxStore.VolunteerWalkUpReducer.map(shift => (
                    <ShiftCard shift={shift} />
                ))}
            </div>
        )
    }
}

const mapStateToProps = reduxStore => {
    return {
        reduxStore
    };
};

export default connect(mapStateToProps)(WalkUpShifts);