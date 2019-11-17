import React, { Component } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import Dropdown from './Dropdown'
import NameSearch from './NameSearch'
import './VolunteerPortal.css'

class VolunteerPortal extends Component {
    

    render() {
        return (
            <div className="VolunteerPortal">
                <Dropdown
                    title='Department'
                    options={['Games', 'Tear Down']}
                />
                <Dropdown 
                    title="Shift Time"
                    options={['10AM Monday', '5pm Tuesday']}
                />
                <NameSearch />
                <Card >
                    <CardContent>
                        <Typography  color="textSecondary" gutterBottom>
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
