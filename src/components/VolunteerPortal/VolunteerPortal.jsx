import React, { Component } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import Dropdown from './Dropdown'
import NameSearch from './NameSearch'
import './VolunteerPortal.css'
import Axios from 'axios';

class VolunteerPortal extends Component {
    state={
        nameSuggestions: []
    }
    componentDidMount(){
        this.getVolunteerNames();
    }
    getVolunteerNames = () => {
        Axios.get('./api/volunteer-portal/volunteer-names')
        .then(response => {
            this.setState({
                ...this.state,
                nameSuggestions: response.data
            })
            console.log(response.data)
        }).catch(error => {
            console.log(error)
        })
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
                <Card >
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Word of the Day
                        </Typography>
                        <Typography variant="h5" component="h2">
                            Edith
                        </Typography>
                        <Typography color="textSecondary">
                            adjective
                        </Typography>
                        <Typography variant="body2" component="p">
                            well meaning and kindly.
                        <br />
                            {'"a benevolent smile"'}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default VolunteerPortal;
