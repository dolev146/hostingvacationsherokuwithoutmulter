import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Vacations from './components/Vacations';
import Login from './components/Login';
import Signup from './components/Signup';
import AddVacation from './components/AddVacation';
import EditVacation from './components/EditVacation';
import Reports from './components/Reports';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      <div>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/add" component={AddVacation} />
        <Route path="/edit/:id" component={EditVacation} />
        <Route path="/reports" component={Reports} />
        <Route path="/" exact component={Vacations} />
      </div>
    </Router>
  );
}

export default App;
