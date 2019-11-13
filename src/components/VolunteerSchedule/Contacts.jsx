import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios'
import './VolunteerSchedule.css'

class Contacts extends Component {
    state = {};
    componentDidMount() {
        axios.get('/volunteer-contacts')
            .then(response => {
                console.log(response.data)
                // this.setState({
                //     data: response.data
                // })
            }).catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <div className="Contacts">
                < Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Discord</TableCell>
                            <TableCell>Total Hours</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {this.state.data ?
                            this.state.data.map(vol => {
                                return <TableRow key={vol.id}>
                                    <TableCell>
                                        {vol.name}
                                    </TableCell>
                                    <TableCell>
                                        {vol.discord}
                                    </TableCell>
                                    <TableCell>
                                        {vol.totalhours}
                                    </TableCell>
                                    <TableCell>
                                        {vol.phone}
                                    </TableCell>
                                    <TableCell>
                                        {vol.email}
                                    </TableCell>
                                </TableRow>
                            })
                            : ''}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default Contacts;
