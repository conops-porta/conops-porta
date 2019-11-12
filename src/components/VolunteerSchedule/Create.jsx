import React, { Component } from 'react';
import CSVReader from 'react-csv-reader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { objectTypeSpreadProperty } from '@babel/types';

class CreateNewSchedule extends Component {
    state = {};
    splat = (data) => {
        this.setState({
            data: this.buildDataStructure(data)
        })
    }

    submitSchedule = () => {
        if (this.state.data) {
            console.log(this.state.data)
            // axios.post('/api/voluteer/schedule', this.state.data)
            //     .then(response => {
            //         console.log(response.data)
            //     }).catch(error => {
            //         console.log(error)
            //     })
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
    render() {
        return (
            <div className="CreateNewSchedule">
                <CSVReader
                    onFileLoaded={data => this.splat(data)}
                // parserOptions={this.state.papaparseOptions}
                />
                <button onClick={this.submitSchedule}>SUBMIT</button>

                {this.state.data ?
                    <div>
                        {/* {JSON.stringify(this.state.data)} */}
    
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
        );
    }
}

export default CreateNewSchedule;
