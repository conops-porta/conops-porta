import React, {Component} from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import {connect} from 'react-redux';
import Nav from '../Nav/Nav';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import Home from '../Home/Home';

import CheckIn from '../V1/CheckIn/CheckIn';
import Details from '../V1/Details/Details';

import OrderId from '../V1/OrderId/OrderId';
import PreRegister from '../V1/PreRegister/PreRegister';

import Events from '../V1/Events/Events';
import EventDetails from '../V1/EventDetails/EventDetails';
import CreateEvent from '../V1/Events/CreateEvent';

import Locations from '../V1/Locations/Locations';
import LocationDetails from '../V1/LocationDetails/LocationDetails';
import CreateLocation from '../V1/Locations/CreateLocation';

import Tags from '../V1/Tags/Tags';
import EditTag from '../V1/Tags/EditTag';
import CreateTag from '../V1/Tags/CreateTag';

import Conventions from '../V1/Conventions/Conventions';
import GameLibrary from '../V1/GameLibrary/GameLibrary';
import News from '../V1/News/News';

import Sponsors from '../V1/Sponsors/Sponsors';
import SponsorDetails from '../V1/Sponsors/SponsorDetails';
import CreateSponsor from  '../V1/Sponsors/CreateSponsor';

import RegisterPage from '../RegisterPage/RegisterPage';

import VolunteerSchedule from '../VolunteerSchedule/Initial';
import VolunteerScheduleCreate from '../VolunteerSchedule/Create';
import VolunteerScheduleManage from '../VolunteerSchedule/Manage';
import VolunteerWalkUp from '../VolunteerWalkUp/VolunteerWalkUp';
import WalkUpShifts from '../VolunteerWalkUp/WalkUpShifts';
import WalkUpConfirm from '../VolunteerWalkUp/WalkUpConfirm';

import VolunteerPortal from '../VolunteerPortal/VolunteerPortal'
import VolunteerHours from '../VolunteerPortal/VolunteerHours'


import './App.css';

class App extends Component {
  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
            {/* <Route
              exact
              path="/home"
              component={Home}
            /> */}
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
           {/* Need to attach to logo */}
            <ProtectedRoute
              exact
              path="/home"
              component={Home}
            />

            {/* Attendee Tab */}
            <ProtectedRoute
              exact
              path="/check-in"
              component={CheckIn}
            />
            <ProtectedRoute
              exact
              path="/preregister"
              component={PreRegister}
            />
              <Route
              exact path ="/register"
              component = {RegisterPage}
              />
              
            {/* Events Tab */}
            <ProtectedRoute
              exact
              path="/events"
              component={Events}
            />
            <ProtectedRoute
              exact
              path="/locations"
              component={Locations}
            />

            {/* VolunteerWalkUp */}
            <Route
              exact
              path="/volunteer-walk-up"
              component={VolunteerWalkUp}
            />
            <Route
              exact
              path="/volunteer-walk-up/:badgenumber"
              component={WalkUpShifts}
            />
            <Route
            exact
            path="/volunteer-walk-up/verify/:id"
            component={WalkUpConfirm}
          />

            {/* Admin */}
            <ProtectedRoute
              exact
              path="/tags"
              component={Tags}
            />
            <ProtectedRoute
              exact
              path="/edittag/:id"
              component={EditTag}
            />
            <ProtectedRoute
              exact
              path="/createTag"
              component={CreateTag}
            />
            <ProtectedRoute
              exact
              path="/conventions"
              component={Conventions}
            />
            <ProtectedRoute
              exact
              path="/volunteer-schedule"
              component={VolunteerSchedule}
            /> 
            <ProtectedRoute
              exact
              path="/volunteer-schedule/create"
              component={VolunteerScheduleCreate}
            /> 
            <ProtectedRoute
              exact
              path="/volunteer-schedule/manage"
              component={VolunteerScheduleManage}
            /> 
            <ProtectedRoute
              exact
              path="/gamelibrary"
              component={GameLibrary}
            />
            <ProtectedRoute
              exact
              path="/news"
              component={News}
            />
            <ProtectedRoute
              exact
              path="/sponsors"
              component={Sponsors}
            /> 
            <ProtectedRoute
              exact
              path="/details/:id"
              component={Details}
            />      
            <ProtectedRoute
              exact
              path="/orderId/:id"
              component={OrderId}
            />      
            <ProtectedRoute
              exact
              path="/eventdetails/:id"
              component={EventDetails}
            />        
            <ProtectedRoute
              exact
              path="/location/details/:id"
              component={LocationDetails}
            />      
            <ProtectedRoute
              exact
              path="/locations/create"
              component={CreateLocation}
            />
            <ProtectedRoute
              exact
              path="/events/create"
              component={CreateEvent}
            />
            <ProtectedRoute
              exact
              path="/sponsor/details/:id"
              component={SponsorDetails}  
            />     
            <ProtectedRoute
              exact
              path="/sponsors/create"
              component={CreateSponsor}
            />
            <ProtectedRoute
              exact
              path="/volunteer-portal"
              component={VolunteerPortal}
            />
            <ProtectedRoute
              exact
              path="/volunteer-portal/hours"
              component={VolunteerHours}
            /> 
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
          {/* <Footer /> */}
        </div>
      </Router>
  )}
}

export default connect()(App);
