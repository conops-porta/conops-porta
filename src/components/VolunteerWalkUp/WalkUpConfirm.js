import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert';

let info;

class WalkUpConfirm extends Component {

    // state = {
    //     volunteerFirstName: '',
    //     discordName: '',
    //     phoneNumber: ''
    //   }

      render() {
        // let infoDetails = this.props.reduxStore.SelectedShiftsReducer.map((details, id) => {
        //     if( id == 0){
        // info = <p >{details.id}</p>
        //     }
        //     })
        return (
            <div className="WalkUpConfirm">
                Confirm
                <br />
                <table>
        <thead>
          <tr>
            <th>
            </th>
          </tr>
        </thead>
    <tbody>
      {this.props.reduxStore.SelectedShiftsReducer.map((info) =>(
        <tr key={info.id}>
          <td>{info.id}</td>
            <td>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                {/* {info}
                {infoDetails} */}

        {JSON.stringify(this.props.reduxStore.SelectedShiftsReducer)}
        
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