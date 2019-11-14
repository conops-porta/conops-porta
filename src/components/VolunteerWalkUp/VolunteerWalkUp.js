// import Button from "@material-ui/core/Button";
// import TextField from "@material-ui/core/TextField";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// import InputLabel from "@material-ui/core/InputLabel";
// import Grid from "@material-ui/core/Grid";
// import DateFnsUtils from "@date-io/date-fns";
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker
// } from "@material-ui/pickers";
// import { withStyles } from "@material-ui/core/styles";
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Paper from '@material-ui/core/Paper';
// import Draggable from 'react-draggable';
// import { createMuiTheme } from '@material-ui/core/styles';
// import { ThemeProvider } from '@material-ui/styles';
// import SimpleReactValidator from 'simple-react-validator';

import React, { Component } from 'react';
import { connect } from 'react-redux';

// const theme = createMuiTheme({
//   palette: {
//     primary: {main: "#19375f"}
//   }
// });
// // adds these styles to anything with a class name of root
// const styles = {
//   root: {
//     margin: "15px"
//   }
// };

// // makes the dialog boxes draggable
// function PaperComponent(props) {
//   return (
//     <Draggable>
//       <Paper {...props} />
//     </Draggable>
//   );
// }


class VolunteerWalkUp extends Component {
  // componentDidMount = () => {
  //   this.props.dispatch({ type: 'FETCH_WALKUP_BADGE_NUMBER'});
  // }
  componentWillMount = () => {
    this.props.dispatch({
      type: 'FETCH_WALKUP_BADGE_NUMBER',
      payload: this.state.badgeNumber
    });
    // this.validator = new SimpleReactValidator();
  }

  state = {
    badgeNumber: ''
  };

  walkUpBadgeNumberSubmit = (event) => {
    console.log('btn click', this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer)
    event.preventDefault();

    // if(this.props.reduxStore.VolunteerWalkUpReducer === this.state){
      this.props.dispatch({
        type: 'FETCH_WALKUP_BADGE_NUMBER',
        payload: this.state
      });
      if ( this.state !== this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer ) {
        alert('You submitted right stuff!');
      } else {
        alert('You submitted wrong stuff!');
        // this.validator.showMessages();
        // this.forceUpdate();

      }
      // if(this.props.reduxStore.VolunteerWalkUpReducer === this.state){
      //   return window.confirm("hello")
      // };
    
  } // end registeredUsers

  handleInputChange = propertyName => (event) => {
    console.log('happening')
    this.setState({
      [propertyName]: event.target.value,
    });
  } // end handleInputChange

  render() {
    return (
      <div>
        {JSON.stringify(this.props.reduxStore.VolunteerWalkUpReducer.VolunteerWalkUpReducer)}
        {JSON.stringify(this.state)}
        <h1>Walk-Up Volunteer</h1>
          <h2>Sign In</h2>
            <form onSubmit={this.walkUpBadgeNumberSubmit}>
              <p>Badge #
              <br/>
                <input value={this.state.badgeNumber} type="number" placeholder="badge number" value={this.state.badgeNumber} onChange={this.handleInputChange('badgeNumber')}></input>
                {/* {this.validator.message('badgeNumber', this.state.badgeNumber, 'required|numeric')} */}

                <button>Go</button>
              </p>
            </form>

            {/* <Dialog
          open={this.state.openPromptTwo}
          onClose={this.handleClosePromptTwo}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
        <DialogTitle style={{ cursor: 'move', color: 'white' }} id="draggable-dialog-title" className="Dialog">
          Check In
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: 'black' }}>
            Are you sure you want to check this attendee in!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClosePromptTwo} variant="contained" color="secondary">
            Cancel
          </Button>
          <ThemeProvider theme={theme}>
            <Button onClick={this.handlePaid} variant="contained" color="primary">
              Confirm
          </Button>
          </ThemeProvider>
        </DialogActions>
        </Dialog> */}
      </div>
    );
  }
}

const mapStateToProps = reduxStore => {
  return {
    reduxStore
  };
};

export default connect(mapStateToProps)(VolunteerWalkUp);

