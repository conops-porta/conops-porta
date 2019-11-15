import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert';

import ShiftCard from './ShiftCard';

class WalkUpShifts extends Component {

    componentDidMount() {
        this.validateBadgeNumber();
    }

    currentSelection = []

    validateBadgeNumber = () => {
        axios.get(`/api/walkup/validatebadge/${this.props.match.params.badgenumber}`)
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

    verifyInfo = () => {
        this.props.history.push(`/volunteer-walk-up/verify/${this.props.match.params.badgenumber}`)
    }

    walkUpBadgeNumberSubmit = () => {
        this.props.dispatch({
            type: 'FETCH_WALKUP_SHIFTS',
            payload: this.props.match.params
        });
    } // end registeredUsers

    // removes the shift ID from array of selected shifts
    handleRemove = (id) => {
        for(let i = 0; i < this.currentSelection.length; i++){
            if(this.currentSelection[i] === id){
                this.currentSelection.splice(i, 1)
            }
        }
    }

    // adds selected shift ID to array of shifts
    handleSelect = (id) => {
        this.currentSelection.push(id)
    }

    // sends current selection of shift ID's to SelectedShiftsReducer
    sendSelectedShifts = () => {
        this.props.dispatch({
            type: 'SET_SELECTED_SHIFTS',
            payload: this.currentSelection
        })
        this.props.history.push(`/volunteer-walk-up/verify/${this.props.match.params.badgenumber}`)
    }

    render() {
        return (
            <div className="WalkUpShifts">
                <h1>Available shifts:</h1>
                <button onClick={this.sendSelectedShifts}>Submit</button>
                {this.props.reduxStore.VolunteerWalkUpReducer.map(shift => (
                    <ShiftCard shift={shift} handleSelect={this.handleSelect} handleRemove={this.handleRemove} key={shift.ShiftID} />
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