import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button } from '@material-ui/core';

import ShiftCard from './ShiftCard';

import './Volunteer.css';

class WalkUpShifts extends Component {

    componentDidMount() {
        this.getWalkUpShifts();
    }

    currentSelection = []

    // fetches walk up shifts once attendee is validated
    getWalkUpShifts = () => {
        this.props.dispatch({
            type: 'FETCH_WALKUP_SHIFTS',
            payload: this.props.match.params
        });
    }

    // removes the shift ID from array of selected shifts
    handleRemove = (id) => {
        for (let i = 0; i < this.currentSelection.length; i++) {
            if (this.currentSelection[i] === id) {
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
        // console.log('In state: ', this.state);
        this.props.history.push(`/volunteer-walk-up/submit/${this.props.match.params.id}`)
    }

    render() {
        return (
            <div className="WalkUpShifts">
                <div className="WalkUpShifts-header">
                    <h1>Available shifts:</h1>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.sendSelectedShifts}>
                        Volunteer for Checked Shifts
                    </Button>
                </div>
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell> </TableCell>
                                <TableCell>Day</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.reduxStore.VolunteerWalkUpReducer.map(shift => (
                                <ShiftCard shift={shift} handleSelect={this.handleSelect} handleRemove={this.handleRemove} key={shift.ShiftID} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
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