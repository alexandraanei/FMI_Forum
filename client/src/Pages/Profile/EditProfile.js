import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, TextField } from "@material-ui/core";
import FileUpload from '@material-ui/icons/AddPhotoAlternate';
import AuthContext from "../../Contexts/AuthContext";

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
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
        marginRight: 5,
    },
    input: {
        display: 'none',
    }
}));

export default function ShowProfile() {
    const classes = useStyles();
    const history = useHistory();
    const { user } = useContext(AuthContext);
    const id  = user._id;
    const [avatar, setAvatar] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState(null);
 
    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getProfile = async () => {
        const response = await axios.get('/api/profile/' + id);
        setProfile(response.data);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setUsername(response.data.username);
        setEmail(response.data.email);
    };
    
    const handleOnSubmit = async e => {
        e.preventDefault();
        
        const formData = new FormData();
        if(avatar) formData.append('avatar', avatar);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('username', username);
        formData.append('email', email);

        try {
            await axios.put("/api/profile/" + id + "/edit", formData);
            history.push('/profile/' + id);
        } catch (err) {
            console.log(err.response.data.message);
        }
    }
        
    const onChangeHandler = e => {
        setAvatar(e.target.files[0]);
        console.log(e.target.files[0]);
    }
    
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
            {profile && 
                <form className={classes.form} onSubmit={handleOnSubmit}>
                        <Avatar alt={`${firstName}`} src={profile.avatar} className={classes.large} />
                         <input accept="image/*" onChange={onChangeHandler} className={classes.input} id="icon-button-file" type="file" />
                         <label htmlFor="icon-button-file">
                            <Button variant="contained" component="span" className={classes.button}>
                                <FileUpload/>&nbsp;Upload
                            </Button>
                        </label>
                        <span className={classes.filename}>   
                            {avatar ? avatar.name : ''}
                        </span>
                    <TextField
                        required
                        fullWidth
                        label="First Name"
                        autoFocus
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Last Name"
                        autoFocus
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Email Address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        >
                            Update profile
                    </Button>
                </form>
            }
            </div>
        </Container>
    );
}