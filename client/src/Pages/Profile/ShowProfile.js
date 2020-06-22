import React, { useState, useEffect, Fragment, useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItemText, ListItem, Avatar, Button } from "@material-ui/core";
import AuthContext from "../../Contexts/AuthContext";
import CreateIcon from "@material-ui/icons/Create";

const useStyles = makeStyles(theme => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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

export default function ShowProfile() {
    const classes = useStyles();
    const history = useHistory();
    const { user } = useContext(AuthContext);
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
 
    useEffect(() => {
        getProfile();
    });

    const getProfile = async () => {
        const response = await axios.get('/api/profile/' + id);
        setProfile(response.data);
        //todo: fix multiple requests
    };

    const handleEditProfile = () => {
        history.push('/profile/'+ id + '/edit');
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
            {profile && 
                <Fragment>
                    <Avatar alt={`${profile.firstName}`} src={profile.avatar} className={classes.large} />
                    <List>
                        <ListItem>
                            <ListItemText primary={`Nume intreg: ${profile.firstName} ${profile.lastName}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Username: ${profile.username}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`E-mail: ${profile.email}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Rol utilizator: ${profile.type.charAt(0).toUpperCase() + profile.type.slice(1)}`} />
                        </ListItem>
                    </List>
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
                </Fragment>
            }
            </div>
        </Container>
    );
}