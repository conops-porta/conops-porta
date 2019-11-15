import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core/';
import moment from 'moment'
import axios from 'axios'


class Manage extends Component {
    state = {
        open: false
    }
    //modal control
    handleClickOpen = () => { this.setOpen(true); };
    handleClose = () => { this.setOpen(false); };
    setOpen = (bool) => {
        this.setState({ ...this.state, open: bool })
    }
    getShiftsByTimeSlot = () => {
        const dataToSend = { 
            date: this.props.shiftInfo.date, 
            time: this.props.shiftInfo.time, 
            RoleID: this.props.roleInfo.RoleID 
        }
        //written as a post to send req.body
        axios.post('/api/volunteer-admin/time-slot-shifts', dataToSend)
        .then(response => {
            console.log(response.data)
            this.setState({
                ...this.state,
                shifts: response.data
            })
        }).catch(error => {
            console.log(error)
        })
    }
    handleAddShift = (roleID, date, time) => {
        console.log('click', roleID, date, time)
        axios.post('./api/volunteer-admin/shifts', {roleID: roleID, date: date, time: time})
        .then(response => {
            console.log(response)
            this.getShiftsByTimeSlot()
        }).catch(error => {
            console.log(error)
        })
    }
    handleDeleteShift = (id) => {
        console.log('click', id)
        axios.delete(`./api/volunteer-admin/shifts/${id}`)
        .then(response => {
            console.log(response)
            this.getShiftsByTimeSlot()
        }).catch(error => {
            console.log(error)
        })
    }
    render() {
        return (
            <div className="Manage">
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    {this.state.shifts ? this.state.shifts.length : this.props.numOfShifts}
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        {this.props.roleInfo.department} Department: {this.props.roleInfo.role} <br />
                        {moment(this.props.shiftInfo.date).format('dddd')} at {this.props.shiftInfo.time}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Manage Shifts
                        </DialogContentText>
                        <ul>
                            {this.state.shifts ? 
                                <div>
                                    {this.state.shifts.map(shift => (
                                        <li>
                                            {shift.BadgeNumber ? shift.BadgeNumber : 'Unfilled'}
                                            {/* {JSON.stringify(this.state.shifts)} */}
                                            <Button onClick={() => this.handleDeleteShift(shift.ShiftID)}>X</Button>
                                        </li>
                                    ))}
                                </div>
                            :  
                                <div>
                                    {this.props.uniqueShifts.map(shift => (
                                        <li>
                                            {shift.BadgeNumber ? shift.BadgeNumber : 'Unfilled'}
                                            {/* {JSON.stringify(shift)} */}
                                            <Button onClick={() => this.handleDeleteShift(shift.ShiftID)}>X</Button>
                                        </li>
                                    ))}
                                </div>
                            }
                        </ul>
                        <Button
                            onClick={() => this.handleAddShift(this.props.roleInfo.RoleID, this.props.shiftInfo.date, this.props.shiftInfo.time + ':00')}
                            variant="outlined">
                            Add Shift
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}

export default Manage;
