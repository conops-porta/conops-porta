import React, { Component } from 'react';
import { Checkbox } from '@material-ui/core';
// child of portal card
class PortalCard extends Component {

    state = {
        noShow: false
    }

    // currently not doing anything other than changing local state
    noShow = (shift) => {
        this.setState({
            noShow: !this.state.noShow
        })
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