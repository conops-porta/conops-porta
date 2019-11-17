import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';

// let info;

class WalkUpConfirm extends Component {

    confirm = () => {
        swal({
            title: `Thank You`,
            icon: "success"
          }).then(() => {
             {
                this.props.history.push(`/volunteer-walk-up/`)
            }
        })
    }

      render() {

        return (
            <div className="WalkUpConfirm">
                {/* Confirm */}
                <br />
                <h1>Thank You</h1>
                <h2>You sign up for: </h2>

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
            <h4>Please write this down so you won't forget!</h4>

{/* {JSON.stringify(this.props.reduxStore.SelectedShiftsReducer)} */}

            <button onClick={this.confirm}>OKAY</button>
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