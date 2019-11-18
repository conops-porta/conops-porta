import React, { Component } from 'react';
import MaterialTable from "material-table";
import { connect } from "react-redux";

class VolunteerContact extends Component {
    state = {
        columns: [
            { title: "Name", field: "VolunteerName" },
            { title: "Discord", field: "VolunteerDiscord" },
            { title: "Email", field: "VolunteerEmail" },
            { title: "Phone", field: "VolunteerPhone" },
            { title: "Vetted?", field: "VolunteerVetted" },
            { title: "Main Department", field: "MainDepartment" },
            { title: "Secondary Department", field: "SecondaryDepartment" },
            { title: "Additional Hours", field: "VolunteerHours" },
            { title: "Shirt Size", field: "VolunteerShirtSize" },
            { title: "Badge Number", field: "BadgeNumber" },
            { title: "Notes", field: "VolunteerNotes" },
        ]
    };

    //calls these functions on page load
    componentDidMount() {
        this.props.dispatch({
            type: 'FETCH_CONVENTION'
        });
        this.fetchVolunteerContacts();
    }

    //Sends a GET request to saga
    fetchVolunteerContacts = () => {
        this.props.dispatch({
            type: "FETCH_VOLUNTEER_CONTACTS"
        });
    }

    render() {
        return (
            <div className="VolunteerContacts">
                <h1 style={{ textAlign: "center" }}>Current Convention: {this.props.convention.ConventionName}</h1>
                <h2 style={{ textAlign: "center" }}>Volunteer Contacts</h2>
                {(this.props.reduxStore.user.authorization === 4 ||
                this.props.reduxStore.user.authorization === 0)
                && (
                    <MaterialTable
                        title="Volunteer Contacts"
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
export default connect(mapStateToProps)(VolunteerContact);
