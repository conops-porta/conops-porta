import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@material-ui/core/';
import { Add } from '@material-ui/icons';
import Dropdown from '../VolunteerPortal/Dropdown';

class AddVolunteerModal extends Component {
    state = {
        open: false,
        name: ''
    }

    storeNameInState = (name) => {
        this.setState({ ...this.state, name: name })
    }

    //modal control
    handleClickOpen = () => { this.setOpen(true); };
    handleClose = () => { this.setOpen(false); };
    setOpen = (bool) => {
        this.setState({ ...this.state, open: bool })
    }

    addVolunteer = (shift, name) => {
        this.props.addVolunteer(shift, name);
        this.handleClose();
    }

    render() {
        return (
            <div className="AddVolunteer">
                <IconButton aria-label="assign" size="small" onClick={this.handleClickOpen}>
                    <Add />
                </IconButton>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        Select volunteer to add to shift:
                    </DialogTitle>
                    <DialogContent>
                        <Dropdown
                            title='Volunteers'
                            options={this.props.names}
                            keyName='VolunteerName'
                            storeDropdownInState={this.storeNameInState}

                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="secondary">
                            Close
                        </Button>
                        <Button onClick={() => this.addVolunteer(this.props.shift, this.state.name)} variant="contained" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        )
    }
}

export default AddVolunteerModal;