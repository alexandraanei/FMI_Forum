import React, {useState, useContext} from 'react';
import axios from "axios";
import { useHistory } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import { Avatar, Button, TextField, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import AlertStore from '../../Stores/AlertStore';

const useStyles = makeStyles(theme => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 266,
        paddingBottom: 266,
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

export default function SignIn() {
    const history = useHistory();
    const { setUser } = useContext(AuthContext);
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);

    const handleOnSubmit = async e => {
        e.preventDefault();
        setEmailError(null);
        setPasswordError(null);

        const data = {
            email,
            password
        };

        try {
            const response = await axios.post('/api/auth/login', data);
            const {token, user} = response.data;
            localStorage.setItem("token", token);
            setUser(user);
            AlertStore.showSnackbar({
                message: "Logarea a fost efectuata cu succes",
                type: "success",
              });
            history.push('/category');
        } catch (e) {
            const message = e.response.data.message;
            if (message === 'user_not_found') {
                setEmailError('Nu s-au gasit membri cu acest e-mail');
            } else if (message === 'wrong_password') {
                setPasswordError('Parola gresita')
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
                    Login
                </Typography>
                <form className={classes.form} onSubmit={handleOnSubmit}>
                    <TextField
                        required
                        fullWidth
                        label="Adresa e-mail"
                        autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Parola"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </Container>
    );
}