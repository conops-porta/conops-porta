import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core/';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import moment from 'moment'
import axios from 'axios'
import swal from 'sweetalert'


class EditShiftsModal extends Component {
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
    handleDeleteShift = (id, numOfShifts, department, role, day, time) => {
        if (numOfShifts === 1){
            swal({
                title: "Are you sure you want to delete the last shift?",
                text: `Once deleted, you will not be able to assign any more shifts to ${department}: ${role} on ${day} at ${time}`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        this.deleteShift(id);
                    } else {
                        return;
                    }
                });
        } else {
            this.deleteShift(id);
        }
        
    }
    deleteShift = (id) => {
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
            <div className="EditShiftsModal">
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    {this.state.shifts ? this.state.shifts.length : this.props.numOfShifts}
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        {this.props.roleInfo.department}: {this.props.roleInfo.role} <br />
                        {moment(this.props.shiftInfo.date).format('dddd')} at {this.props.shiftInfo.time}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Manage Shifts
                        </DialogContentText>
                        <ul className="ShiftList">
                            {this.state.shifts ? 
                                <div>
                                    {this.state.shifts.map(shift => (
                                        <li>
                                            {shift.BadgeNumber ? <><span>{shift.VolunteerName}</span> <span className="subtle">({shift.BadgeNumber})</span></> : <span className="subtle">Unfilled</span>}
                                            <Button
                                                size="small"
                                                startIcon={<DeleteOutlinedIcon />}
                                                onClick={() => this.handleDeleteShift( shift.ShiftID, this.state.shifts.length, this.props.roleInfo.department, this.props.roleInfo.role, moment(this.props.shiftInfo.date).format('dddd'), this.props.shiftInfo.time )}
                                            >Remove Shift</Button>
                                        </li>
                                    ))}
                                </div>
                            :  
                                <div>
                                    {this.props.uniqueShifts.map(shift => (
                                        <li>
                                            {shift.BadgeNumber ? <><span>{shift.VolunteerName}</span> <span className="subtle">({shift.BadgeNumber})</span></> : <span className="subtle">Unfilled</span>}
                                            {/* {JSON.stringify(shift)} */}
                                            <Button
                                                size="small"
                                                startIcon={<DeleteOutlinedIcon />}
                                                onClick={() => this.handleDeleteShift(shift.ShiftID)}
                                            >Remove Shift</Button>
                                        </li>
                                    ))}
                                </div>
                            }
                        </ul>
                        <Button
                            onClick={() => this.handleAddShift(this.props.roleInfo.RoleID, this.props.shiftInfo.date, this.props.shiftInfo.time + ':00')}
                            variant="outlined"
                            startIcon={<AddBoxOutlinedIcon />}
                            >
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

export default EditShiftsModal;
