import React, { Component } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core/';
import moment from 'moment'


class Manage extends Component {
    state ={ 
        open: false
    }
    //modal control
    handleClickOpen = () => { this.setOpen(true); };
    handleClose = () => { this.setOpen(false); };
    setOpen = (bool) => {
        this.setState({ ...this.state, open: bool })
    }
    handleAddShift = () => {
        console.log('click')
    }
    handleDeleteShift = (id) => {
        console.log('click', id)
    }
    render() {
        return (
            <div className="Manage">
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    {this.props.numOfShifts}
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        {this.props.roleInfo.department} Department: {this.props.roleInfo.role} <br/>
                        {moment(this.props.shiftInfo.date).format('dddd')} at {this.props.shiftInfo.time}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Manage Shifts
                        </DialogContentText>
                        <ul>
                            {this.props.uniqueShifts.map(shift => (
                                <li>
                                    {shift.BadgeNumber ? shift.BadgeNumber : 'Unfilled'}
                                    {/* {JSON.stringify(shift)} */}
                                    <Button onClick={() => this.handleDeleteShift(shift.ShiftID)}>X</Button>
                                </li>
                            ))}
                        </ul>
                        <Button onClick={this.handleAddShift} variant="outlined">Add Shift</Button>
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
