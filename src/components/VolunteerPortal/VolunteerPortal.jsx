import React, { Component } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import Dropdown from './Dropdown'
import NameSearch from './NameSearch'
import PortalCard from './PortalCard'
import './VolunteerPortal.css'
import Axios from 'axios';

class VolunteerPortal extends Component {
    state={
        nameSuggestions: []
    }
    componentDidMount(){
        this.getVolunteerNames();
        this.getShifts();
    }
    filterByBadgeNumber = (badgeNumber) => {
        //
    }
    filterDepartment = (department) => {
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
                    nameSuggestions: response.data
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
                    nameSuggestions={this.state.nameSuggestions}
                    filterByBadgeNumber={this.filterByBadgeNumber}
                />
                <PortalCard />
            </div>
        );
    }
}

export default VolunteerPortal;
