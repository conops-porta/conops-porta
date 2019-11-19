import React, { Component } from 'react';
import { Checkbox } from '@material-ui/core';

class PortalCard extends Component {

    state = {
        noShow: false
    }

    // currently not doing anything other than changing local state
    noShow = (shift) => {
        this.setState({
            noShow: !this.state.noShow
        })
        // console.log(shift.ShiftID, shift.BadgeNumber.badgeNumber);
    }

    render() {

        return (
            <div className="PortalCardCheckbox">
                <Checkbox
                    checked={this.state.noShow}
                    onChange={() => this.noShow(this.props.shift)}
                    value="checkedA"
                    inputProps={{
                        'aria-label': 'checkbox',
                    }}
                />
            </div >
        );
    }
}

export default PortalCard;