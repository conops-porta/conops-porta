import React, { Component } from 'react';
import PortalCardCheckbox from './PortalCardCheckbox';
import AddVolunteerModal from './AddVolunteerModal';
import {
    Card, CardContent, Typography,
    TableBody, Table, TableCell, TableHead, TableRow, Paper,
    IconButton
} from '@material-ui/core';
import { Remove } from '@material-ui/icons';
import moment from 'moment'
import './VolunteerPortal.css'

class PortalCard extends Component {

    render() {
        return (
            <div className="PortalCard">
                <Paper>
                    <Card >
                        <CardContent>
                            <div className="cardHeading">
                                <h3 className="cardDepartment">Department: <strong>{this.props.department}</strong></h3>
                                <h2 className="cardDateTime">{moment(this.props.date).format('dddd')}, <strong>{this.props.time.slice(0, -3)}</strong></h2>
                            </div>
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
                                                        <IconButton color="primary" aria-label="assign" size="small" onClick={() => this.props.removeVolunteer(shift)}>
                                                            <Remove />
                                                        </IconButton> {shift.BadgeNumber.name ?
                                                            shift.BadgeNumber.name
                                                            : shift.BadgeNumber}
                                                    </span>
                                                    :
                                                    <span>
                                                        <AddVolunteerModal
                                                            addVolunteer={this.props.addVolunteer}
                                                            shift={shift}
                                                            names={this.props.state.names}
                                                            key={shift.ShiftID}
                                                        />
                                                    </span>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {shift.RoleID.roleName}
                                            </TableCell>
                                            <TableCell>
                                                {shift.BadgeNumber === null ?
                                                    '' :
                                                    <PortalCardCheckbox
                                                        shift={shift}
                                                        state={this.props.state}
                                                        removeVolunteer={this.props.removeVolunteer}
                                                        key={shift.ShiftID}
                                                    />
                                                }
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
