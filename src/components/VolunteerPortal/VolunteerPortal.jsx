import React, { Component } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import Dropdown from './Dropdown'
import DateTime from './DateTime'
import NameSearch from './NameSearch'
import PortalCard from './PortalCard'
import './VolunteerPortal.css'
import Axios from 'axios';

class VolunteerPortal extends Component {
    state = {
        dateInput: '',
        departmentInput: '',
        nameInput: ''
    }
    componentDidMount() {
        this.getVolunteerNames();
        // this.getShifts();
        this.getDepartments();
    }
    //-------populates card data -------//
    getShifts = () => {
        Axios.get('/api/volunteer-portal/shifts')
            .then(response => {
                console.log(response.data)
                this.setState({
                    ...this.state,
                    shiftData: response.data
                })
            }).catch(error => {
                console.log(error)
            })
    }
    //-----filter results--------//
    filterByBadgeNumber = (badgeNumber) => {
        console.log(badgeNumber)
    }
    filterByDepartment = (department) => {
        console.log(department)
    }
    filterByShift = (datetime) => {
        console.log(datetime)
    }

    // ----- populate dropdowns ----//
    getVolunteerNames = () => {
        Axios.get('/api/volunteer-portal/volunteer-names')
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
        Axios.get('/api/volunteer-portal/departments')
            .then(response => {
                console.log(response.data)
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
                    filterByShift={this.filterByShift}
                />
                <br />
                {this.state.departments ?
                    <Dropdown
                        title='Department'
                        options={this.state.departments}
                        keyName='DepartmentName'
                        filterByDropdown={this.filterByDepartment}
                    />
                    : <Dropdown
                        title='Department'
                        options={[{ DepartmentName: 'Loading . . .' }]}
                        keyName='DepartmentName'
                        filterByDropdown={this.filterByDepartment}
                    />}
                {this.state.names ?
                    <NameSearch
                        nameSuggestions={this.state.names}
                        filterByBadgeNumber={this.filterByBadgeNumber}
                    />
                    :
                    <NameSearch
                        nameSuggestions={[{ VolunteerName: 'Loading . . .' }]}
                        filterByBadgeNumber={this.filterByBadgeNumber}
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

                        />
                    }) : null}
            </div>
        );
    }
}

export default VolunteerPortal;
