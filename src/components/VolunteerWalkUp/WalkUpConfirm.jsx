import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';

// let info;

class WalkUpConfirm extends Component {

    componentDidMount() {
        this.loadSelectedShifts();
    }

    selectedShifts = []

    // fetches all shifts marked ok for walk-up 
    loadSelectedShifts = () => {
        this.props.dispatch({
            type: 'FETCH_WALKUP_SHIFTS',
            payload: this.props.match.params
        });
        // checks selected shift id's against all walk-up shifts to push shifts objects to array to be sent with update call on confirm
        this.props.reduxStore.SelectedShiftsReducer.map((selected) => (
            this.props.reduxStore.VolunteerWalkUpReducer.map((shift) => {
                if (selected === shift.ShiftID) {
                    this.selectedShifts.push(shift)
                }
                return true;
            })
        ))
    }

    // send array of selected shift objects to db along with badge number of attendee
    confirm = () => {
        // console.log(this.selectedShifts);
        axios.put(`/api/walkup/selected/${this.props.match.params.id}`, this.selectedShifts)
            .then(response => {
                swal({
                    title: `Thank You`,
                    icon: "success"
                }).then(() => {
                    this.props.history.push(`/volunteer-walk-up/`)
                })
            }).catch(error => {
                console.log(error)
            })
    }

    render() {

        return (
            <div className="WalkUpConfirm">
                <h1>You are signing up for: </h1>
                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Department</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.selectedShifts.map((shift) => (
                            <tr key={shift.ShiftID}>
                                <td>{moment(shift.ShiftDate).format('dddd')}</td>
                                <td>{(shift.ShiftTime).slice(0, -3)}</td>
                                <td>{shift.DepartmentName}</td>
                                <td>{shift.RoleName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h4>Please write this down so you won't forget!</h4>
                <Button variant="contained" color="primary" onClick={this.confirm}>SUBMIT!</Button>
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