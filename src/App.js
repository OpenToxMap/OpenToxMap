import React from 'react';
import logo from './logo.svg';
import './App.scss';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DataPage from './pages/DataPage';
import ServiceStatusPage from './pages/ServiceStatusPage';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <div className="content">
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/map" exact={true} component={MapPage} />
          <Route path="/data" exact={true} component={DataPage} />
          <Route
            path="/service-status"
            exact={true}
            component={ServiceStatusPage}
          />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
