import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import swal from 'sweetalert';

class ShiftCard extends Component {

    state = {
        checked: false
    }

    handleChange = event => {
        this.setState({ checked: !this.state.checked });
    };

    render() {
        return (
            <div className="ShiftCard" style={{ border: "1px solid black" }}>
                <h3>{moment(this.props.shift.ShiftDate).format('dddd')}@{this.props.shift.ShiftTime}</h3>
                <h3>Department: {this.props.shift.DepartmentName}</h3>
                <h3>Role: {this.props.shift.RoleName}</h3>
                <Checkbox
                    checked={this.state.checked}
                    onChange={() => this.handleChange('checked')}
                    value="checked"
                    color="primary"
                />
            </div>
        )
    }
}

export default ShiftCard;