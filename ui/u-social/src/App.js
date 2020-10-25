import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import AddUser from "./components/user/registrer/add";
import ProfileUser from "./components/user/profile/profile";
import Login from "./components/user/login/login";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/registrer" component={AddUser}></Route>
        <Route exact path="/user/:_id" component={ProfileUser}></Route>
        <Route exact path="/" component={Login}></Route>
      </Switch>
    </Router>
  );
}

export default App;
