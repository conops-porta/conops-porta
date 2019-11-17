import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';

// let info;

class WalkUpConfirm extends Component {

    confirm = () => {
        console.log('btn click')
        this.props.history.push(`/volunteer-walk-up/`)
    }

      render() {

        return (
            <div className="WalkUpConfirm">
                Confirm
                <br />

            <table>
                <thead>
                    <tr>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.reduxStore.SelectedShiftsReducer.map((info) =>(
                    <tr>
                        <td>{info}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

{/* {JSON.stringify(this.props.reduxStore.SelectedShiftsReducer)} */}

            <button onClick={this.confirm}>Confirm</button>
            </div>
        )
    }
}

const mapStateToProps = reduxStore => {
    return {
        reduxStore
    };
};

export default connect(mapStateToProps)(WalkUpConfirm);