import React, { Component } from 'react';
import Contacts from './Contacts'

class Initial extends Component {

    componentDidMount() {
        // dispatch call for all volunteer contact info
    }

    render() {
        return (
            <div className="Initial">
                <h1>Volunteer Schedules</h1>
                <button onClick={()=> {
                    this.props.history.push('/volunteer-schedule/create')
                }}>CREATE A NEW SCHEDULE</button>
                <Contacts/>
            </div>
        );
    }
}

export default Initial;
