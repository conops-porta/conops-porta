import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Axios from 'axios';

class Initial extends Component {

    state = { loaded: false }

    componentDidMount = () => {
        Axios.get('/api/volunteer-admin/departments')
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({
                        ...this.state,
                        existingSchedule: true,
                        loaded: true
                    })
                } else {
                    this.setState({
                        ...this.state,
                        existingSchedule: false,
                        loaded: true
                    })
                    return
                }
            }).catch(error => {
                console.log(error)
            })
    }

    linkToManage = () => {
        this.props.history.push('/volunteer-schedule/manage')
    }

    linkToCreate = () => {
        this.props.history.push('/volunteer-schedule/create')
    }

    render() {
        return (
            <div className="Initial">
                <h1 className="center">Volunteer Schedule</h1>
                {this.state.loaded ?
                    <div className="center">
                        {this.state.existingSchedule ?
                            <Button color="inherit" variant="outlined" onClick={this.linkToManage}>
                                Manage Schedule
                            </Button>
                            :
                            <Button color="inherit" variant="outlined" onClick={this.linkToCreate}>
                                Create Schedule
                            </Button>
                        }
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}

export default Initial;
