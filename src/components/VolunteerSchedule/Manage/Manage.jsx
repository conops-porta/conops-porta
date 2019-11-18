import React, { Component } from 'react';
import Accordion from './Accordion'
import axios from 'axios'
import '../VolunteerSchedule.css'
import swal from 'sweetalert';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';


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
                title: `Everything will be deleted`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(function(willDelete) {
            if (willDelete) {
                axios.delete(`/api/volunteer-admin/delete-schedule/`)
                swal("Poof! Your file has been deleted!", {
                icon: "success"
                }).then(function() {
                    window.location.href = '/#/volunteer-schedule'
                });
                } else {
                swal("Your file is safe!");
                }
            });
        }

        previousPage = () => {
            this.props.history.push('/volunteer-schedule')
        }

    render() {
        return (
            <div className="Manage">
                <button onClick={this.previousPage}>Back</button>
                <h1>Manage Volunteer Schedule</h1>
                {this.state.data ? 
                    <div>
                        {this.state.data.map(row => (
                            <Accordion data={row}/>
                        ))}
                    </div>
                    : ''}
                    <div className="delteAll">
                        <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.deleteAll}
                        startIcon={<DeleteIcon />}
                        >
                        Delete
                        </Button>
                    </div>
            </div >
        );
    }
}

export default Manage;
