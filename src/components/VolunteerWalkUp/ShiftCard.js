import React, { Component } from 'react';
import moment from 'moment';
import { Checkbox } from '@material-ui/core';

class ShiftCard extends Component {

    state = {
        checked: false
    }

    checkBox = () => {
        if (this.state.checked === false) {
            this.props.handleSelect(this.props.shift.ShiftID)
        } else if (this.state.checked === true) {
            this.props.handleRemove(this.props.shift.ShiftID)
        }
        this.setState({
            checked: !this.state.checked
        })
    }

    render() {
        return (
            <div className="ShiftCard" data-weekday={moment(this.props.shift.ShiftDate).format('ddd')}>
                <h3>{moment(this.props.shift.ShiftDate).format('dddd')}, <strong>{(this.props.shift.ShiftTime).slice(0, -3)}</strong></h3>
                <h4>Department: <strong>{this.props.shift.DepartmentName}</strong></h4>
                <label>
                    {<Checkbox
                        checked={this.state.checked}
                        onChange={this.checkBox}
                        value="checked"
                        color="primary"
                    />}
                Role: <strong>{this.props.shift.RoleName}</strong>
                </label>
            </div>
        )
    }
}

export default ShiftCard;