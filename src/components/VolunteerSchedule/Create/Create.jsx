import React, { Component } from 'react';
import axios from 'axios';
import CSVReader from 'react-csv-reader';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
import './Create.css'

class CreateNewSchedule extends Component {

    state = {};
    
    splat = (data) => {
        this.setState({
            ...this.state,
            preview: true
        })
        this.setState({
            ...this.state,
            data: this.buildDataStructure(data)
        })
    }

    submitSchedule = () => {
        if (this.state.data) {
            // console.log(this.state.data)
            axios.post('/api/volunteer-admin/schedule', { data: this.state.data })
                .then(response => {
                    // console.log(response.data)
                    this.props.history.push('/volunteer-schedule/manage')
                }).catch(error => {
                    console.log(error)
                })
        }
    }

    buildDataStructure = (csvAsArr) => {
        let data = [];
        for (let i = 2; i < csvAsArr.length; i++) {
            let shiftsByDept = []
            for (let j = 3; j < csvAsArr[0].length; j++) {
                shiftsByDept.push({
                    time: csvAsArr[1][j],
                    numOfVolunteers: Number(csvAsArr[i][j]) || 0,
                    date: csvAsArr[0][j]
                })
            }
            data.push({
                department: csvAsArr[i][0],
                role: csvAsArr[i][1],
                okForWalkUp: csvAsArr[i][2],
                shifts: shiftsByDept
            })
        }
        return data;
    }

    linkToVolHome = () => {
        this.props.history.push('/volunteer-schedule')
    }

    render() {
        return (
            <div className="CreateNewSchedule">
                <div className="button-container-create">
                    <Button variant="outlined" onClick={this.linkToVolHome}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={this.submitSchedule}>Submit</Button>
                </div>
                <p className="upload-text">Please upload a CSV file</p><br />
                <div className="upload">
                    <CSVReader
                        onFileLoaded={data => this.splat(data)}
                    />
                </div>
                <h2>Schedule Preview:</h2>
                <div className="preview">
                    {this.state.data ?
                        <div>
                            < Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell> </TableCell>
                                        <TableCell> </TableCell>
                                        <TableCell></TableCell>
                                        {this.state.data[0].shifts.map(obj => {
                                            return <TableCell>{obj.date}</TableCell>
                                        })}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell> </TableCell>
                                        <TableCell>Walk Up</TableCell>
                                        {this.state.data[0].shifts.map(obj => {
                                            return <TableCell>{obj.time}</TableCell>
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.data.map(obj => (
                                        <TableRow key={obj.department}>
                                            <TableCell component="th" scope="row">
                                                {obj.department}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {obj.role}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {obj.okForWalkUp}
                                            </TableCell>
                                            {obj.shifts.map(shift => {
                                                return <TableCell>
                                                    {shift.numOfVolunteers}
                                                </TableCell>
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        : ''
                    }
                </div>
            </div>
        );
    }
}

export default CreateNewSchedule;
