import React, { Component } from 'react';
import Accordion from './Accordion'
import axios from 'axios'
import '../VolunteerSchedule.css'
import swal from 'sweetalert';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';

import './Manage.css';

class Manage extends Component {

    state = {}

    componentDidMount() {
        axios.get('/api/volunteer-admin/shifts')
            .then(response => {
                // console.log(response.data)
                this.setState({
                    data: this.processDataToSend(response.data)
                })
            }).catch(error => {
                console.log(error)
            })
    }

    findUniqueShifts = (shifts) => {
        let allShiftTimes = [];
        // pushes all shifts date/time into array
        shifts.forEach(shift => { allShiftTimes.push(`${shift.ShiftDate}|${shift.ShiftTime}`) })
        // filters out duplicates
        let unique = allShiftTimes.filter((item, i, ar) => ar.indexOf(item) === i);
        let arrayOfTimesToReturn = [];
        unique.forEach(shift => {
            var arr = shift.split('|'); // breaks apart time and date to be used in an object instead of array
            let time = arr[1].slice(0, -3) // removes "seconds" section from the time formatting
            arrayOfTimesToReturn.push({ ShiftDate: arr[0], ShiftTime: time })
        })
        // console.log(arrayOfTimesToReturn)
        return arrayOfTimesToReturn
    }

    processDataToSend = (data) => {
        let dataToSend = [];
        data.forEach(row => {
            dataToSend.push({
                department: row.department,
                role: row.role,
                okForWalkUps: row.ok_for_walk_ups,
                allShifts: row.shifts,
                uniqueShifts: this.findUniqueShifts(row.shifts),
                RoleID: row.RoleID
            })
        })
        // console.log(dataToSend)
        return dataToSend;
    }

    deleteAll = () => {
        swal({
            title: `Are you sure? This will delete all shifts and associated volunteer hours.`,
            text: `After deletion you will be able to create a new schedule by uploading a CSV file. If you are resetting after an event, you may want to create a separate record of total volunteer hours. These can be found under Volunteer Contacts.`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                axios.delete(`/api/volunteer-admin/delete-schedule/`)
                    .then(response => {
                        // console.log(response)
                        swal("Your schedule has been deleted!", {
                            icon: "success"
                        }).then(() => {
                            window.location.href = '/#/volunteer-schedule'
                        });
                    }).catch(error => {
                        console.log(error)
                    })
            } else {
                swal("Your schedule is safe!");
            }
        });
    }

    previousPage = () => {
        this.props.history.push('/volunteer-schedule')
    }

    render() {
        return (
            <div className="Manage">
                <div className="back-button">
                    <Button variant="contained" onClick={this.previousPage}>Back</Button>
                </div>
                <h1>Manage Volunteer Schedule</h1>
                {this.state.data ?
                    <div>
                        {this.state.data.map(row => (
                            <Accordion
                                data={row}
                                key={row.allShifts[0].RoleID}
                            />
                        ))}
                    </div>
                    : 'loading…'}
                <div className="deleteAll">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.deleteAll}
                        startIcon={<DeleteIcon />}
                    >
                        Delete Entire Schedule
                        </Button>
                </div>
            </div >
        );
    }
}

export default Manage;
