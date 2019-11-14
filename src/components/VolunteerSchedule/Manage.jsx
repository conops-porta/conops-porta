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


const findLongestListOfShifts = (arrayOfRoles) => {
    let longestList = 0
    let arrayOfTimesToReturn = [];
    arrayOfRoles.forEach(role => {
        let allShiftTimes = [];
        // pushes all shifts date/time into array
        role.shifts.forEach(shift => { allShiftTimes.push(`${shift.ShiftDate}|${shift.ShiftTime}`) })
        // filters out duplicates
        let unique = allShiftTimes.filter((item, i, ar) => ar.indexOf(item) === i);
        // if the unique shifts are longest, we'll use their date/times as a 
        if (unique.length > longestList) {
            longestList = unique.length;
            unique.forEach(shift => {
                var arr = shift.split('|'); // breaks apart time and date to be used in an object instead of array
                let time = arr[1].slice(0, -3) // removes "seconds" section from the time formatting
                arrayOfTimesToReturn.push({ ShiftDate: arr[0], ShiftTime: time })
            })
        }
    })
    console.log(arrayOfTimesToReturn)
    return arrayOfTimesToReturn
}


class Manage extends Component {
    state = {}
    componentDidMount() {
        axios.get('/api/volunteer/shifts')
            .then(response => {
                console.log(response.data)
                this.setState({
                    ...this.state,
                    data: response.data,
                    shiftTimes: findLongestListOfShifts(response.data)
                })
            }).catch(error => {
                console.log(error)
            })
    }



    render() {
        return (
            <div className="Manage">
                <h1>MANAGE</h1>
                {this.state.data ?
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Department</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Walk-up approved?</TableCell>
                                {this.state.shiftTimes.map(shift => (
                                    <TableCell>
                                        {moment(shift.ShiftDate).format('dddd')}, {shift.ShiftTime}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow >
                                <ExpansionPanel>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography >Expansion Panel 1</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                            sit amet blandit leo lobortis eget.
                                    </Typography>

                                        <TableCell>
                                        </TableCell>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </TableRow>
                        </TableBody>
                    </Table>
                    : ''}


            </div >
        );
    }
}

export default Manage;
