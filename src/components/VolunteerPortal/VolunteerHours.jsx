import React, { Component } from 'react';
import MaterialTable from "material-table";
import { connect } from "react-redux";

class VolunteerHours extends Component {
    state = {
        columns: [
            { title: "First Name", field: "FirstName" },
            { title: "Last Name", field: "LastName" },
            { title: "Discord", field: "VolunteerDiscord" },
            { title: "Hours Scheduled", field: "HoursScheduled" },
            { title: "Hours Worked", field: "HoursWorked" },
            { title: "Badge Number", field: "BadgeNumber" },
        ]
    };

    //calls these functions on page load
    componentDidMount() {
        this.props.dispatch({
            type: 'FETCH_CONVENTION'
        });
        this.fetchLeaderboard();
    }

    //Sends a GET request to saga
    fetchLeaderboard = () => {
        this.props.dispatch({
            type: "FETCH_VOLUNTEER_HOURS"
        });
    }

    render() {
        return (
            <div className="VolunteerHours">
                <h1 style={{ textAlign: "center" }}>Current Convention: {this.props.convention.ConventionName}</h1>
                <h2 style={{ textAlign: "center" }}>Volunteer Leaderboard</h2>
                {(this.props.reduxStore.user.authorization === 4 ||
                this.props.reduxStore.user.authorization === 0)
                && (
                    <MaterialTable
                        title="Volunteer Hours"
                        columns={this.state.columns}
                        options={{
                            columnsButton: true,
                            // headerStyle: { backgroundColor: 'blue', color: 'white' },
                            pageSize: 10,
                            pageSizeOptions: [10, 20, 50],
                            toolbarButtonAlignment: "right",
                            searchFieldAlignment: "left",
                            showTitle: false
                        }}
                        data={this.props.reduxStore.VolunteerHoursReducer}
                    />
                )}

            </div>
        );
    }
}

const mapStateToProps = reduxStore => {
    return {
        reduxStore,
        convention: reduxStore.ConventionsReducer,
    };
};
export default connect(mapStateToProps)(VolunteerHours);
