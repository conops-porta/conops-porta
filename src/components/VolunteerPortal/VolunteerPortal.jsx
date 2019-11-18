import React, { Component } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import Dropdown from './Dropdown'
import NameSearch from './NameSearch'
import PortalCard from './PortalCard'
import './VolunteerPortal.css'
import Axios from 'axios';

class VolunteerPortal extends Component {
    state = {
        names: []
    }
    componentDidMount() {
        this.getVolunteerNames();
        this.getShifts();
    }
    filterByBadgeNumber = (badgeNumber) => {
        //
    }
    filterByDepartment = (department) => {
        //
    }
    filterByShift = (shift) => {
        //
    }

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
    getShifts = () => {
        Axios.get('/api/volunteer-portal/shifts')
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
    render() {
        return (
            <div className="VolunteerPortal">
                <Dropdown
                    title='Department'
                    options={['Games', 'Tear Down']}
                    filterByDropdown={this.filterByDepartment}
                />
                <Dropdown
                    title="Shift Time"
                    options={['10AM Monday', '5pm Tuesday']}
                    filterByDropdown={this.filterByShift}
                />
                <NameSearch
                    nameSuggestions={this.state.names}
                    filterByBadgeNumber={this.filterByBadgeNumber}
                />
                {this.state.departments ?
                    this.state.departments.map(department => {
                        let shiftAssignments = department.Shifts
                        shiftAssignments.forEach(shift => {
                            if (shift.BadgeNumber){
                                this.state.names.forEach(name => {
                                    if (name.BadgeNumber === shift.BadgeNumber){
                                        shift.BadgeNumber = {badgeNumber: shift.BadgeNumber, name: name.VolunteerName}
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
