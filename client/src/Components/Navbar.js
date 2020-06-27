import React, { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { fade, makeStyles } from "@material-ui/core/styles";
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
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
  drawer: {
    width: 350,
  },
  smallAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

export default function MenuAppBar() {
  const history = useHistory();
  const { user, handleLogout } = useContext(AuthContext);
  const id = user && user._id;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const logout = () => {
    handleClose();
    handleLogout();
    history.push("/category");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
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
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
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
    </div>
  );
}
