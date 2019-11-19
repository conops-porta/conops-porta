import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Dropdown from './Dropdown'
import DateTime from './DateTime'
import NameSearch from './NameSearch'
import PortalCard from './PortalCard'
import './VolunteerPortal.css'
import axios from 'axios';
import moment from 'moment'

class VolunteerPortal extends Component {
    state = {
        dateInput: '',
        timeInput: '',
        departmentInput: '',
        nameInput: ''
    }
    componentDidMount() {
        this.getVolunteerNames();
        this.getShifts();
        this.getDepartments();
    }

    removeVolunteer = (shift) => {
        // console.log('removed volunteer from: ', ShiftID);
        axios.put(`/api/volunteer-portal/remove-volunteer/${shift.ShiftID}`)
            .then(response => {
                console.log(response);
                this.getShifts();
            }).catch(error => {
                console.log(error)
            })
    }

    addVolunteer = (shift, name) => {
        // console.log(`adding ${name.VolunteerName} to shift: ${shift.ShiftID}`);
        axios.put(`/api/volunteer-portal/add-volunteer/${shift.ShiftID}`, name)
            .then(response => {
                console.log(response);
                this.getShifts();
            }).catch(error => {
                console.log(error);
            })
    }

    //-------populates card data -------//
    getShifts = () => {
        axios.get('/api/volunteer-portal/shifts')
            .then(response => {
                this.setState({
                    ...this.state,
                    shiftData: response.data
                })
            }).catch(error => {
                console.log(error)
            })
    }

    //-----set state to filter inputs--------//
    storeNameInState = (name) => {
        // console.log(name)
        this.setState({
            ...this.state,
            nameInput: name
        })
    }
    storeDepartmentInState = (department) => {
        // console.log(department)
        this.setState({
            ...this.state,
            departmentInput: department
        })
    }
    storeShiftDateTimeInState = (d, t) => {
        if (d) {
            let date = moment(d).calendar()
            // console.log(date)
            this.setState({
                ...this.state,
                dateInput: date
            })
        }
        if (t) {
            let time = moment(t).format('H:mm') + ':00'
            // console.log(time)
            this.setState({
                ...this.state,
                timeInput: time
            })
        }
    }

    // ----- populate dropdowns ----//
    getVolunteerNames = () => {
        axios.get('/api/volunteer-portal/volunteer-names')
            .then(response => {
                this.setState({
                    ...this.state,
                    names: response.data
                })
                // console.log(response.data)
            }).catch(error => {
                console.log(error)
            })
    }
    getDepartments = () => {
        axios.get('/api/volunteer-portal/departments')
            .then(response => {
                // console.log(response.data)
                this.setState({
                    ...this.state,
                    departments: response.data
                })
            }).catch(error => {
                console.log(error)
            })
    }

    //-------render------//
    render() {
        return (
            <div className="VolunteerPortal">
                <DateTime
                    storeShiftDateTimeInState={this.storeShiftDateTimeInState}
                />
                <br />
                {this.state.departments ?
                    <Dropdown
                        title='Department'
                        options={this.state.departments}
                        keyName='DepartmentName'
                        storeDropdownInState={this.storeDepartmentInState}
                    />
                    : <Dropdown
                        title='Department'
                        options={[{ DepartmentName: 'Loading . . .' }]}
                        keyName='DepartmentName'
                        storeDropdownInState={this.storeDepartmentInState}
                    />}
                {this.state.names ?
                    <NameSearch
                        nameSuggestions={this.state.names}
                        storeNameInState={this.storeNameInState}
                    />
                    :
                    <NameSearch
                        nameSuggestions={[{ VolunteerName: 'Loading . . .' }]}
                        storeNameInState={this.storeNameInState}
                    />}
                <br />
                <div className='filter-buttons'>
                    <Button variant="outlined" color="inheret">Apply Filters</Button>
                    <Button color="inheret">Clear Filters</Button>
                </div>
                {this.state.shiftData ?
                    this.state.shiftData.map(department => {
                        let shiftAssignments = department.Shifts
                        shiftAssignments.forEach(shift => {
                            if (shift.BadgeNumber) {
                                this.state.names.forEach(name => {
                                    if (name.BadgeNumber === shift.BadgeNumber) {
                                        shift.BadgeNumber = { badgeNumber: shift.BadgeNumber, name: name.VolunteerName }
                                    }
                                })
                            }
                            department.Roles.forEach(role => {
                                if (role.RoleID === shift.RoleID) {
                                    shift.RoleID = { roleID: shift.RoleID, roleName: role.RoleName }
                                }
                            })
                        })
                        return <PortalCard
                            department={department.DepartmentName}
                            date={department.ShiftDate}
                            time={department.ShiftTime}
                            shifts={shiftAssignments}
                            removeVolunteer={this.removeVolunteer}
                            addVolunteer={this.addVolunteer}
                            state={this.state}

                        />
                    }) : null}
            </div>
        );
    }
}

export default VolunteerPortal;
