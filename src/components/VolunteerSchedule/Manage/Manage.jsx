import React, { Component } from 'react';
import Accordion from './Accordion'
import axios from 'axios'


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
                uniqueShifts: this.findUniqueShifts(row.shifts)
            })
        })
        // console.log(dataToSend)
        return dataToSend;
    }


    render() {
        return (
            <div className="Manage">
                <h1>Manage Volunteer Schedule</h1>
                {this.state.data ? 
                    <div>
                        {this.state.data.map(row => (
                            <Accordion data={row}/>
                        ))}
                    </div>
                    : ''}
            </div >
        );
    }
}

export default Manage;
