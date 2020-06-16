import React, { useState, useEffect, Fragment, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItemText,
  ListItem,
  Avatar,
  Button,
  TextField,
} from "@material-ui/core";
import AuthContext from "../../Contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  large: {
    width: theme.spacing(17),
    height: theme.spacing(17),
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
  },
}));

export default function SettingsPage() {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const id = user._id;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUserData();
  });

  const getUserData = async () => {
    const response = await axios.get("/api/profile/" + id);
    setUserData(response.data);
    //todo: fix multiple requests
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    console.log(id);

    setPasswordError(null);
    let errors = 0;

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      errors++;
    }

    if (errors) return;

    const data = { oldPassword, newPassword }

    try {
        await axios.put("/api/user/" + id + "/editPassword", data);
        history.push('/profile/' + id);
    } catch (err) {
        console.log(err.response.data.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleOnSubmit}>
          <TextField
            type="password"
            required
            fullWidth
            label="Old password"
            autoFocus
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            type="password"
            required
            fullWidth
            label="New password"
            autoFocus
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText={passwordError}
            error={!!passwordError}
          />
          <TextField
            type="password"
            required
            fullWidth
            label="Confirm new password"
            autoFocus
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText={passwordError}
            error={!!passwordError}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            className={classes.button}
          >
            Update profile
          </Button>
        </form>
      </div>
    </Container>
  );
}
