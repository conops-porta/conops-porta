import React, { Component } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core/';


class Manage extends Component {
    state ={ open: false }
    handleClickOpen = () => { this.setOpen(true); };
    handleClose = () => { this.setOpen(false); };
    setOpen = (bool) => {
        this.setState({ open: bool })
    }

    render() {
        return (
            <div className="Manage">
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    {this.props.numOfShifts}
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send updates
                            occasionally.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Subscribe
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}

export default Manage;
