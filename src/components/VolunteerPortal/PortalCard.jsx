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

const removeVolunteer = (ShiftID) => {
    console.log('removed volunteer from: ', ShiftID);
    axios.put(`/api/volunteer-portal/remove-volunteer/${ShiftID}`)
        .then(() => {
            
        }).catch(error => {
            console.log(error)
        })
}

function PortalCard(props) {
    return (
        <div className="PortalCard">
            <Paper>
                <Card >
                    <CardContent>
                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell className="card-header-cell">
                                        {/* <Typography variant="h5" component="h2"> */}
                                        <span className='volunteer-portal-department'> 
                                            Department: {props.department}
                                        </span>
                                        {/* </Typography> */}
                                    </TableCell> 
                                    <TableCell className="card-header-cell">
                                    {/* <Typography variant="h5" component="h2"> */}
                                        <span className='volunteer-portal-time'>
                                            {moment(props.date).format('dddd')}, {props.time.slice(0, -3)}
                                        </span>
                                    {/* </Typography> */}
                                </TableCell> 
                                </TableRow>
                            </TableHead>
                        </Table>
                        {/* <Typography variant="h5" component="h2">
                        <span className='.volunteer-portal-title'>
                            <span className="volunteer-portal-department">
                                Department: {props.department}
                            </span>
                            <span className="volunteer-portal-time">
                                {moment(props.date).format('dddd')}, {props.time.slice(0, -3)}
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
                                {props.shifts.map(shift => {
                                    return <TableRow>
                                        <TableCell>
                                            {shift.BadgeNumber ?
                                                <span>
                                                    <IconButton color="primary" aria-label="assign" size="small" onClick={() => removeVolunteer(shift.ShiftID)}>
                                                        <Remove />
                                                    </IconButton> {shift.BadgeNumber.name ?
                                                        shift.BadgeNumber.name
                                                        : shift.BadgeNumber}
                                                </span>
                                                :
                                                <span>
                                                    <IconButton aria-label="assign" size="small">
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
                                                checked={false}
                                                onChange=''
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

export default PortalCard;
