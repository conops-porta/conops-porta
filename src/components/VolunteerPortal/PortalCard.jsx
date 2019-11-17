import React, { Component } from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';


function PortalCard(props) {
    return (
        <div className="PortalCard">
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

export default PortalCard;
