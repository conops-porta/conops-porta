import React, { Component } from 'react';
import moment from 'moment';
import { Checkbox } from '@material-ui/core';

class ShiftCard extends Component {

    state = {
        checked: false
    }

    checkBox = () => {
        this.setState({
            checked: !this.state.checked
        })
        this.props.handleChange(!this.state.checked, this.props.shift.ShiftID)
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
                <button onClick={() => console.log(this.props.shift.ShiftID)}>test</button>
            </div>
        )
    }
}

export default ShiftCard;