import React, { Component } from 'react';
import { Link } from 'react-router-dom'
// import VolunteerContacts from './Contacts.jsx'

class Initial extends Component {

    componentDidMount() {
        // dispatch call for all volunteer contact info
    }

    render() {
        return (
            <div className="Initial">
                <h1>Volunteer Schedules</h1>
                <Link to='/volunteer-schedule/manage'>
                    <button>Manage Existing Schedule</button>
                </Link><br/>
                <Link to='/volunteer-schedule/create'>
                    <button>Create New Schedule</button>
                </Link>
            </div>
        );
    }
}

export default Initial;
