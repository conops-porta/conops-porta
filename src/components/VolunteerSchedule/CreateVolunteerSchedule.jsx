import React, { Component } from 'react';
// import CSVReader from 'react-csv-reader';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import { objectTypeSpreadProperty } from '@babel/types';

class CreateNewSchedule extends Component {
    // state = {
    //     // papaparseOptions: {
    //     //   header: true,
    //     //   dynamicTyping: true,
    //     //   skipEmptyLines: false,
    //     //   transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
    //     // }
    // };
    // splat = (data) => {
    //     this.setState({
    //         data: this.buildDataStructure(data)
    //     })
    // }
    // buildDataStructure = (csvAsArr) => {
    //     let data = [];
    //     for (let i = 2; i < csvAsArr.length; i++) {
    //         let shiftsByDept = []
    //         for (let j = 1; j < csvAsArr[0].length; j++) {
    //             shiftsByDept.push({
    //                 time_slot: csvAsArr[1][j],
    //                 numOfVolunteers: csvAsArr[i][j] || 0,
    //                 day: csvAsArr[0][j]
    //             })
    //         }
    //         data.push({
    //             department: csvAsArr[i][0],
    //             shifts: shiftsByDept
    //         })
    //     }
    //     return data;
    // }
    render() {
        return (
            <div className="CreateNewSchedule">
                {/* <CSVReader
                    onFileLoaded={data => this.splat(data)}
                // parserOptions={this.state.papaparseOptions}
                />
                {this.state.data ?

                    // JSON.stringify(this.state.data)

                    < Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell> </TableCell>
                                {this.state.data[0].shifts.map(obj => {
                                    return <TableCell>{obj.day}</TableCell>
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell> </TableCell>
                                {this.state.data[0].shifts.map(obj => {
                                    return <TableCell>{obj.time_slot}</TableCell>
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.data.map(obj => (
                                <TableRow key={obj.department}>
                                    <TableCell component="th" scope="row">
                                        {obj.department}
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

                    : ''
                } */}
            </div>
        );
    }
}

export default CreateNewSchedule;
