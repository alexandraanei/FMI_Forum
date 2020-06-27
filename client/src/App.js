import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import AuthContext from "./Contexts/AuthContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import { Container, Paper } from "@material-ui/core";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import CreateCategory from "./Pages/Category/CreateCategory";
import BrowseCategories from "./Pages/Category/BrowseCategories";
import ShowCategory from "./Pages/Category/ShowCategory";
import CreateForum from "./Pages/Forum/CreateForum";
import ShowForum from "./Pages/Forum/ShowForum";
import CreateThread from "./Pages/Thread/CreateThread";
import ShowThread from "./Pages/Thread/ShowThread";
import ShowProfile from "./Pages/Profile/ShowProfile";
import EditProfile from "./Pages/Profile/EditProfile";
import AdminPanel from "./Pages/AdminPage/AdminPanel";
import SettingsPage from "./Pages/Settings/SettingsPage";
import CalendarPage from "./Pages/Calendar/CalendarPage";
import Alert from "./Components/Alert";

function App() {
  const [user, setUser] = useState(null);
  const [isInitiated, setIsInitiated] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const token = localStorage.getItem("token");
    if (token !== "null") {
      const response = await axios.get("/api/auth/init", { params: { token } });
      const { user } = response.data;
      setUser(user);
    }
    setIsInitiated(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.setItem("token", null);
  };

  return (
    <div>
      {isInitiated && (
        <AuthContext.Provider value={{ user, setUser, handleLogout }}>
          <Router>
            <Navbar />
            <Container className="container" fixed maxWidth="xl">
              <Paper>
                <Switch>
                  <Route path="/" exact>
                    <BrowseCategories />
                  </Route>
                  <Route path="/restricted" exact>
                    <Home />
                  </Route>
                  <Route path="/auth/login">
                    {!user ? <Login /> : <Redirect to="/restricted" />}
                  </Route>
                  <Route path="/auth/register">
                    {!user ? <Register /> : <Redirect to="/restricted" />}
                  </Route>
                  <Route path="/category/create">
                    {user ? <CreateCategory /> : <Redirect to="/auth/login" />}
                  </Route>
                  <Route path="/category/:id">
                    <ShowCategory />
                  </Route>
                  <Route path="/category">
                    <BrowseCategories />
                  </Route>
                  <Route path="/forum/create/:id">
                    {user ? <CreateForum /> : <Redirect to="/auth/login" />}
                  </Route>
                  <Route path="/forum/:id">
                    <ShowForum />
                  </Route>
                  <Route path="/thread/create/:id">
                    {user ? <CreateThread /> : <Redirect to="/auth/login" />}
                  </Route>
                  <Route path="/thread/:id">
                    <ShowThread />
                  </Route>
                  <Route path="/profile/:id/edit">
                    {user ? <EditProfile /> : <Redirect to="/restricted" />}
                  </Route>
                  <Route path="/profile/:id">
                    {user ? <ShowProfile /> : <Redirect to="/restricted" />}
                  </Route>
                  <Route path="/settings/">
                    {user ? <SettingsPage /> : <Redirect to="/restricted" />}
                  </Route>
                  <Route path="/admin">
                    {user?.type === "admin" ? (
                      <AdminPanel />
                    ) : (
                      <Redirect to="/restricted" />
                    )}
                  </Route>
                  <Route path="/calendar">
                    {user ? <CalendarPage /> : <Redirect to="/restricted" />}
                  </Route>
                </Switch>
              </Paper>
            </Container>
          </Router>
          <Alert key="alert" />
        </AuthContext.Provider>
      )}
    </div>
  );
}

export default App;
