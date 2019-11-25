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
import moment from 'moment'
import EditShiftsModal from './EditShiftsModal'

class Accordion extends Component {

    state = {
        expanded: false
    }

    numberOfShiftsAt = (date, time) => {
        let count = 0;
        let uniqueShifts = [];
        let shiftInfo = {}
        this.props.data.allShifts.forEach(shift => {
            if (shift.ShiftTime == time + ':00' && shift.ShiftDate == date) {
                count++;
                uniqueShifts.push(shift);
                shiftInfo = {
                    date: date,
                    time: time
                }
            }
        })
        return {
            count: count,
            uniqueShifts: uniqueShifts,
            shiftInfo: shiftInfo
        };
    }

    handleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }
    
    render() {
        return (
            <div className="Accordion">
                <ExpansionPanel expanded={this.state.expanded} onChange={this.handleExpand}>
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
                                        <TableCell key={shift.ShiftID}>
                                            {moment(shift.ShiftDate).format('dddd')}, {shift.ShiftTime}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    <TableCell>{this.props.data.role}</TableCell>
                                    <TableCell>{this.props.data.okForWalkUps ? <span className="emoji-icon" role="img" aria-label="yes">✅</span> : <span className="emoji-icon" role="img" aria-label="no">❌</span>}</TableCell>
                                    {this.props.data.uniqueShifts.map(shift => (
                                        <TableCell key={shift.ShiftID}>
                                            <EditShiftsModal
                                                numOfShifts={this.numberOfShiftsAt(shift.ShiftDate, shift.ShiftTime).count}
                                                uniqueShifts={this.numberOfShiftsAt(shift.ShiftDate, shift.ShiftTime).uniqueShifts}
                                                shiftInfo={this.numberOfShiftsAt(shift.ShiftDate, shift.ShiftTime).shiftInfo}
                                                roleInfo={{ department: this.props.data.department, role: this.props.data.role, RoleID: this.props.data.RoleID }}
                                            />
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
