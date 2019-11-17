import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';

// let info;

class WalkUpConfirm extends Component {

    componentDidMount() {
        this.loadSelectedShifts();
    }

    selectedShifts = []

    loadSelectedShifts = () => {
        this.props.dispatch({
            type: 'FETCH_WALKUP_SHIFTS',
            payload: this.props.match.params
        });
        this.props.reduxStore.SelectedShiftsReducer.map((selected) => (
            this.props.reduxStore.VolunteerWalkUpReducer.map((shift) => {
                if (selected === shift.ShiftID) {
                    this.selectedShifts.push(shift)
                }
            })
        ))
    }


    confirm = () => {
        console.log(this.selectedShifts);
        axios.put(`/api/walkup/selected/${this.props.match.params.id}`, this.selectedShifts)
            .then(response => {
                console.log(response)
                // swal({
                //     title: `Thank You`,
                //     icon: "success"
                // }).then(() => {
                //     this.props.history.push(`/volunteer-walk-up/`)
                // })
            }).catch(error => {
                console.log(error)
            })
    }

    render() {

        return (
            <div className="WalkUpConfirm">
                <h1>Thank You</h1>
                <h2>You signed up for: </h2>
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
                <button onClick={this.confirm}>OKAY</button>
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