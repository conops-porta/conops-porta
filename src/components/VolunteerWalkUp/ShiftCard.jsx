import React, { Component } from 'react';
import moment from 'moment';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
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
            <TableRow className="ShiftCard" data-weekday={moment(this.props.shift.ShiftDate).format('ddd')}>
                <TableCell>
                    <Checkbox
                        checked={this.state.checked}
                        onChange={this.checkBox}
                        value="checked"
                        color="primary"
                    />
                </TableCell>
                <TableCell>{moment(this.props.shift.ShiftDate).format('dddd')}</TableCell>
                <TableCell><strong>{(this.props.shift.ShiftTime).slice(0, -3)}</strong></TableCell>
                <TableCell><strong>{this.props.shift.DepartmentName}</strong></TableCell>
                <TableCell><strong>{this.props.shift.RoleName}</strong></TableCell>
            </TableRow>
        )
    }
}

export default ShiftCard;