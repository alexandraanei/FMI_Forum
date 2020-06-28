import React, { useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../Contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  Button,
  Link,
  IconButton,
  Badge,
  Avatar,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import EventIcon from "@material-ui/icons/Event";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    color: "#fff",
  },
  grow: {
    flexGrow: 1,
  },
  smallAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

export default function MenuAppBar() {
  const history = useHistory();
  const { user, handleLogout } = useContext(AuthContext);
  const id = user && user._id;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorNot, setAnchorNot] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const openNotifications = Boolean(anchorNot);
  const [notifications, setNotifications] = React.useState([]);

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getNotifications = async () => {
    const response = await axios.get("/api/notification/" + id);
    setNotifications(response.data);
    console.log(response.data);
  };

  const logout = () => {
    handleClose();
    handleLogout();
    history.push("/category");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotMenu = (event) => {
    setAnchorNot(event.currentTarget);
  };

  const handleCloseNot = () => {
    setAnchorNot(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    handleClose();
    history.push("/auth/login");
  };

  const handleRegister = () => {
    handleClose();
    history.push("/auth/register");
  };

  const handleProfile = () => {
    handleClose();
    history.push("/profile/" + id);
  };

  const handleSettings = () => {
    handleClose();
    history.push("/settings");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            style={{ paddingLeft: 20 }}
          >
            <Link
              color="inherit"
              underline="none"
              onClick={() => history.push("/category")}
            >
              FMI FORUM
            </Link>
          </Typography>
          <div className={classes.grow} />
          {user && (
            <React.Fragment>
              <IconButton
                color="inherit"
                onClick={() => history.push("/calendar")}
              >
                <EventIcon />
              </IconButton>
              <IconButton onClick={handleNotMenu} color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                id="notifications-menu"
                anchorEl={anchorNot}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={openNotifications}
                onClose={handleCloseNot}
                PaperProps={{
                  style: {
                    maxHeight: 45 * 4.5,
                    width: "20ch",
                  },
                }}
              >
                {notifications.map((option) => (
                  <MenuItem
                    key={notifications._id}
                    onClick={handleClose}
                  >
                    {notifications.content}
                  </MenuItem>
                ))}
              </Menu>
            </React.Fragment>
          )}
          {user?.type === "admin" && (
            <Button color="inherit" onClick={() => history.push("/admin")}>
              Panou Admin
            </Button>
          )}
          {user ? (
            <div>
              <Button onClick={handleMenu} color="inherit">
                <Avatar
                  alt={`${user.firstName}`}
                  src={user.avatar}
                  className={classes.smallAvatar}
                />
                &nbsp;&nbsp;{user.firstName}
              </Button>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={openMenu}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profil</MenuItem>
                <MenuItem onClick={handleSettings}>Setari</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <IconButton onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={openMenu}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogin}>Logare</MenuItem>
                <MenuItem onClick={handleRegister}>Inregistrare</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {}
    </div>
  );
}
