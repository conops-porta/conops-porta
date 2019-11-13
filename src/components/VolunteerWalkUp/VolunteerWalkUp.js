import React, { Component } from 'react';
import { connect } from 'react-redux';

class VolunteerWalkUp extends Component {
  // componentDidMount = () => {
  //   this.props.dispatch({ type: 'FETCH_WALKUP_BADGE_NUMBER' });
  // }

  state = {
    badgeNumber: ''
  };

  walkUpBadgeNumberSubmit = (event) => {
    console.log('btn click')
    event.preventDefault();

    // if (this.state.badgeNumber) {
      this.props.dispatch({
        type: 'FETCH_WALKUP_BADGE_NUMBER',
        payload: this.state
      });
      // if(this.props.reduxStore.VolunteerWalkUpReducer === this.state.badgeNumber){
      //   return window.confirm("hello")
      // };
    // }
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
        {JSON.stringify(this.props.reduxStore.VolunteerWalkUpReducer)}
        <h1>Walk-Up Volunteer</h1>
          <h2>Sign In</h2>
            <form onSubmit={this.walkUpBadgeNumberSubmit}>
              <p>Badge #
              <br/>
                <input type="number" placeholder="badge number" value={this.state.badgeNumber} onChange={this.handleInputChange('badgeNumber')}></input>
                <button>Go</button>
              </p>
            </form>
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

