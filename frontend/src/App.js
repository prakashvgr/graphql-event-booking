import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'
import MainNavigation from './components/Navigation/MainNavigation'

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact ></Redirect>
              <Route path="/auth" component={AuthPage}></Route>
              <Route path="/events" component={EventsPage}></Route>
              <Route path="/bookings" component={BookingsPage}></Route>
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;
