import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Dropdown from './Dropdown'
import DateTime from './DateTime'
import PortalCard from './PortalCard'
import './VolunteerPortal.css'
import axios from 'axios';
import moment from 'moment'

class VolunteerPortal extends Component {
    state = { 
        updatedShifts: [] 
    }

    componentDidMount() {
        this.getVolunteerNames();
        this.getShifts();
        this.getDepartments();
    }

    removeVolunteer = (shift) => {
        axios.put(`/api/volunteer-portal/remove-volunteer/${shift.ShiftID}`)
            .then(response => {
                this.getSingleShift(shift.ShiftID);
            }).catch(error => {
                console.log(error)
            })
    }

    addVolunteer = (shift, name) => {
        axios.put(`/api/volunteer-portal/add-volunteer/${shift.ShiftID}`, name)
            .then(response => {
                this.getSingleShift(shift.ShiftID);
            }).catch(error => {
                console.log(error);
            })
    }

    // populates card data 
    getShifts = () => {
        axios.get('/api/volunteer-portal/shifts')
            .then(response => {
                this.setState({
                    ...this.state,
                    allData: response.data
                })
            }).catch(error => {
                console.log(error)
            })
    }

    // set state to filter inputs
    storeNameInState = (name) => {
        this.setState({
            ...this.state,
            nameInput: name
        })
    }

    storeDepartmentInState = (department) => {
        this.setState({
            ...this.state,
            departmentInput: department
        })
    }

    storeShiftDateTimeInState = (d, t) => {
        if (d) {
            let date = moment(d).format('YYYY-MM-DD')
            this.setState({
                ...this.state,
                dateInput: date
            })
        }
        if (t) {
            let time = moment(t).format('HH:mm') + ':00'
            this.setState({
                ...this.state,
                timeInput: time
            })
        }
    }

    // populate dropdowns 
    getVolunteerNames = () => {
        axios.get('/api/volunteer-portal/volunteer-names')
            .then(response => {
                this.setState({
                    ...this.state,
                    names: response.data
                })
            }).catch(error => {
                console.log(error)
            })
    }

    getDepartments = () => {
        axios.get('/api/volunteer-portal/departments')
            .then(response => {
                this.setState({
                    ...this.state,
                    departments: response.data
                })
            }).catch(error => {
                console.log(error)
            })
    }
    
    getSingleShift = (id) => {
        axios.get('/api/volunteer-portal/single-shift/' + id)
            .then(response => {
                // console.log(response.data)
                this.setState({
                    ...this.state,
                    updatedShifts: [...this.state.updatedShifts, response.data[0]]
                })
            }).catch(error => {
                console.log(error)
            })
    }

    // apply filters
    applyFilters = (date, time, dept, name) => {
        const allData = this.state.allData;
        if (!date && !time && !dept && !name) {
            this.setState({
                ...this.state,
                displayData: null
            })
            return;
        }
        let filteredData = [...allData];
        if (date) {
            let filteredByDate = []
            filteredData.forEach(data => {
                if (moment(data.ShiftDate).format('YYYY-MM-DD') === date) {
                    filteredByDate.push(data)
                }
            })
            filteredData = filteredByDate;

        }
        if (time) {
            let filteredByTime = []
            filteredData.forEach(data => {
                if (data.ShiftTime === time) {
                    filteredByTime.push(data)
                }
            })
            filteredData = filteredByTime
        }
        if (name) {
            let filteredByName = []
            filteredData.forEach(data => {
                data.Shifts.forEach(shift => {
                    if (shift.BadgeNumber === name.BadgeNumber) {
                        filteredByName.push(data)
                    }
                    if (shift.BadgeNumber && shift.BadgeNumber.badgeNumber === name.BadgeNumber) {
                        filteredByName.push(data)
                    }
                })
            })
            filteredData = filteredByName
        }
        if (dept) {
            let filteredByDept = []
            filteredData.forEach(data => {
                if (data.DepartmentName === dept.DepartmentName) {
                    filteredByDept.push(data)
                }
            })
            filteredData = filteredByDept

        }
        this.setState({
            ...this.state,
            displayData: filteredData
        })
    }

    clearFilters = () => {
        this.setState({
            ...this.state,
            nameInput: null,
            departmentInput: null,
            dateInput: null,
            timeInput: null,
            displayData: null
        })
    }

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
                        input={this.state.departmentInput}
                    />
                    : <Dropdown
                        title='Department'
                        options={[{ DepartmentName: 'Loading . . .' }]}
                        keyName='DepartmentName'
                        storeDropdownInState={this.storeDepartmentInState}
                        input={this.state.departmentInput}
                    />}
                {this.state.names ?
                    <Dropdown
                        title='Name'
                        options={this.state.names}
                        keyName='VolunteerName'
                        storeDropdownInState={this.storeNameInState}
                        idKeyName='BadgeNumber'
                        input={this.state.nameInput}
                    />
                    : <Dropdown
                        title='Name'
                        options={[{ DepartmentName: 'Loading . . .' }]}
                        keyName='VolunteerName'
                        storeDropdownInState={this.storeNameInState}
                        idKeyName='BadgeNumber'
                        input={this.state.nameInput}
                    />}
                <br />
                <div className='filter-buttons'>
                    <Button
                        onClick={() => this.applyFilters(this.state.dateInput, this.state.timeInput, this.state.departmentInput, this.state.nameInput)}
                        variant="outlined"
                        color="inheret">
                        Apply Filters
                    </Button>
                    <Button
                        onClick={this.clearFilters}
                        color="inheret">
                        Clear Filters
                    </Button>
                </div>
                {this.state.displayData && this.state.displayData.length === 0 ? <p>No results</p> : null}
                {this.state.displayData ?
                    this.state.displayData.map(department => {
                        let shiftAssignments = department.Shifts
                        shiftAssignments.forEach(shift => {
                            this.state.updatedShifts.forEach(updatedShift => {
                                if (updatedShift.ShiftID === shift.ShiftID) {
                                    shift.BadgeNumber = updatedShift.BadgeNumber;
                                }
                            })
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
                            updatedShifts={this.state.updatedShifts}
                        />
                    }) : <p>Please apply at least one filter</p>}
            </div>
        );
    }
}

export default VolunteerPortal;
