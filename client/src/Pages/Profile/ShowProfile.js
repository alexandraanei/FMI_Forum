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
  Grid,
  Paper,
} from "@material-ui/core";
import AuthContext from "../../Contexts/AuthContext";
import CreateIcon from "@material-ui/icons/Create";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    padding: 20,
  },
  large: {
    width: theme.spacing(42),
    height: theme.spacing(42),
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: "#c2c7e4",
    marginTop: 20,
    marginBottom: 20,
    boxShadow: "0px 0px 3px",
  },
  button: {
    marginTop: 40,
    marginLeft: 20,
  },
  grid: {
    background: "#f0f2ff", //#c2c7e4
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  listRoot: {
    marginLeft: '14vh',
  },
  primary: {
    color: "#3f51b5",
    textShadow: "0.3px 0.3px",
  },
}));

export default function ShowProfile() {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const response = await axios.get("/api/profile/" + id);
    setProfile(response.data);
    //todo: fix multiple requests
  };

  const handleEditProfile = () => {
    history.push("/profile/" + id + "/edit");
  };

  return (
    <Container component="main" maxWidth="xl">
      {user?._id === id && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<CreateIcon />}
          onClick={handleEditProfile}
        >
          Editeaza profil
        </Button>
      )}
      <div className={classes.paper}>
        {profile && (
          <Fragment>
            <Grid
              container
              spacing={0}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid xs={3} item className={classes.avatar}>
                <Avatar
                  variant="square"
                  component="div"
                  alt={`${profile.firstName}`}
                  src={profile.avatar}
                  className={classes.large}
                />
              </Grid>
              <Grid xs={9} item>
                <Paper className={classes.grid}>
                  <List className={classes.listRoot}>
                    <ListItem>
                      <ListItemText
                        classes={{ primary: classes.primary }}
                        primary="Nume intreg"
                        secondary={`${profile.firstName} ${profile.lastName}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        classes={{ primary: classes.primary }}
                        primary="Username"
                        secondary={profile.username}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        classes={{ primary: classes.primary }}
                        primary="E-mail"
                        secondary={profile.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        classes={{ primary: classes.primary }}
                        primary="Rol utilizator"
                        secondary={
                          profile.type === "admin"
                            ? "Administrator"
                            : profile.type === "mod"
                            ? "Moderator"
                            : "Membru"
                        }
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Fragment>
        )}
      </div>
    </Container>
  );
}
