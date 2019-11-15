import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios'
import moment from 'moment'


class Accordion extends Component {
    state={}

    numberOfShiftsAt = (date, time) => {
        let count = 0;
        this.props.data.allShifts.forEach(shift => {
            if (shift.ShiftTime == time + ':00' && shift.ShiftDate == date) {
                count++;
            }
        })
        return count;
    }
    render() {
        return (
            <div className="Accordion">
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography >{this.props.data.department} – {this.props.data.role}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Role: </TableCell>
                                    <TableCell>Walk Ups?</TableCell>
                                    {this.props.data.uniqueShifts.map(shift => (
                                        <TableCell>
                                            {moment(shift.ShiftDate).format('dddd')}, {shift.ShiftTime}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    <TableCell>{this.props.data.role}</TableCell>
                                    <TableCell>{this.props.data.okForWalkUps ? '√' : 'X'}</TableCell>
                                    {this.props.data.uniqueShifts.map(shift => (
                                        <TableCell>
                                            <button>{this.numberOfShiftsAt(shift.ShiftDate, shift.ShiftTime)}</button>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>

                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div >
        );
    }
}

export default Accordion;
