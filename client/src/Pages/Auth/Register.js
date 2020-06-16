import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import validator from "validator";
import axios from "axios";
import { Avatar, Button, TextField, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 170,
        paddingBottom: 170,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Register() {
    const classes = useStyles();
    const history = useHistory();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const handleOnSubmit = async event => {
        event.preventDefault();
        setEmailError(null);
        setPasswordError(null);
        let errors = 0;

        if (!validator.isEmail(email))
        {
            setEmailError("Email must be in correct format");
            errors++;
        }

        if (password !== passwordConfirmation) {
            setPasswordError("Passwords don't match.");
            errors++;
        }

        if (errors) return;

        const data = {
            firstName,
            lastName,
            username,
            email,
            password
        };

        try {
            await axios.post("/api/auth/register", data);
            history.push('/auth/login');
        } catch (e) {
            const message = e.response.data.message;
            if (message === "email_exists") {
                setEmailError("User with this email already exists");
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <form className={classes.form} onSubmit={handleOnSubmit}>
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
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Password Confirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={e => setPasswordConfirmation(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    );
}