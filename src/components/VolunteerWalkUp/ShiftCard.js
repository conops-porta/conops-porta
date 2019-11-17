import React, { Component } from 'react';
import moment from 'moment';
import { Checkbox } from '@material-ui/core';

class ShiftCard extends Component {

    state = {
        checked: false
    }

    checkBox = () => {
        if (this.state.checked === false) {
            // this.props.handleSelect(this.props.shift.ShiftID)
            this.props.handleSelect(this.props.shift.DepartmentName)
            this.props.handleSelect(this.props.shift.RoleName)
        } else if (this.state.checked === true) {
            this.props.handleRemove(this.props.shift.ShiftID)
        }
        this.setState({
            checked: !this.state.checked
        })
    }

    render() {
        return (
            <div className="ShiftCard" style={{ border: "1px solid black" }}>
                <h3>{moment(this.props.shift.ShiftDate).format('dddd')}@{(this.props.shift.ShiftTime).slice(0, -3)}</h3>
                <h3>Department: {this.props.shift.DepartmentName}</h3>
                <h3>Role: {this.props.shift.RoleName}</h3>
                {<Checkbox
                    checked={this.state.checked}
                    onChange={this.checkBox}
                    value="checked"
                    color="primary"
                />}
            </div>
        )
    }
}

export default ShiftCard;