import React from 'react';
import { Switch, Route } from "react-router-dom";
import Forum from './Forum';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/"> 
        <Forum />
      </Route>
    </Switch>
  );
}

export default App;
