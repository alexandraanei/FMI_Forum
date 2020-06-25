import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import AuthContext from "../../Contexts/AuthContext";
import CreateIcon from "@material-ui/icons/Create";
import AlertStore from "../../Stores/AlertStore";

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

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    let errors = 0;

    if (newPassword !== confirmPassword) {
      setPasswordError("Parole diferite");
      AlertStore.showSnackbar({
        message: "Parolele nu sunt identice.",
        type: "error",
      });
      errors++;
    }

    if (errors) return;

    const data = { oldPassword, newPassword };

    try {
      await axios.put("/api/user/" + id + "/editPassword", data);
      history.push("/profile/" + id);
      AlertStore.showSnackbar({
        message: "Parola modificata cu succes.",
        type: "success",
      });
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
            label="Parola veche"
            autoFocus
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            type="password"
            required
            fullWidth
            label="Parola noua"
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
            label="Confirmare parola noua"
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
            startIcon={<CreateIcon />}
            className={classes.button}
          >
            Modifica
          </Button>
        </form>
      </div>
    </Container>
  );
}
