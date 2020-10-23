import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import AddUser from './components/chat/user/add';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/addUser' component={AddUser}></Route>
      </Switch>
    </Router>
  );
}

export default App;
