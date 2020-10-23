import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import AddUser from './components/user/registrer/add';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/registrer' component={AddUser}></Route>
      </Switch>
    </Router>
  );
}

export default App;
