import React, { Component } from 'react';
import axios from 'axios';
import {
    Card, CardActions, CardContent, Button, Typography,
    TableBody, Table, TableCell, TableHead, TableRow, Paper,
    Checkbox, IconButton
} from '@material-ui/core';
import { Remove, Add } from '@material-ui/icons';
import moment from 'moment'
import './VolunteerPortal.css'

class PortalCard extends Component {

    state = {
        noShow: false
    }

    noShow = (ShiftID) => {
        this.setState({
            ShiftID: ShiftID,
            noShow: !this.state.noShow
        })
        console.log(ShiftID);
    }

    removeVolunteer = (ShiftID) => {
        console.log('removed volunteer from: ', ShiftID);
        axios.put(`/api/volunteer-portal/remove-volunteer/${ShiftID}`)
            .then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error)
            })
    }

    addVolunteer = (ShiftID) => {
        console.log('adding volunteer to shift: ', ShiftID);
    }

    render() {

        return (
            <div className="PortalCard">
                <Paper>
                    <Card >
                        <CardContent>
                            <Table size="small" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="h5" component="h2">
                                                Department: {this.props.department}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5" component="h2">
                                                <span className='volunteer-portal-time'>
                                                    {moment(this.props.date).format('dddd')}, {this.props.time.slice(0, -3)}
                                                </span>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                            {/* <Typography variant="h5" component="h2">
                        <span className='.volunteer-portal-title'>
                            <span className="volunteer-portal-department">
                                Department: {this.props.department}
                            </span>
                            <span className="volunteer-portal-time">
                                {moment(this.props.date).format('dddd')}, {this.props.time.slice(0, -3)}
                            </span>
                        </span>
                    </Typography> */}
                            <Table size="small" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Volunteer
                                    </TableCell>
                                        <TableCell>
                                            Role
                                    </TableCell>
                                        <TableCell>
                                            No Show?
                                    </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.props.shifts.map(shift => {
                                        return <TableRow>
                                            <TableCell>
                                                {shift.BadgeNumber ?
                                                    <span>
                                                        <IconButton color="primary" aria-label="assign" size="small" onClick={() => this.removeVolunteer(shift.ShiftID)}>
                                                            <Remove />
                                                        </IconButton> {shift.BadgeNumber.name ?
                                                            shift.BadgeNumber.name
                                                            : shift.BadgeNumber}
                                                    </span>
                                                    :
                                                    <span>
                                                        <IconButton aria-label="assign" size="small" onClick={() => this.addVolunteer(shift.ShiftID)}>
                                                            <Add />
                                                        </IconButton> Unclaimed
                                                </span>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {shift.RoleID.roleName}
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={this.state.noShow}
                                                    onChange={() => this.noShow(shift.ShiftID)}
                                                    value="checkedA"
                                                    inputProps={{
                                                        'aria-label': 'checkbox',
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Paper>
            </div >
        );
    }
}

export default PortalCard;
