import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { List, ListItemText, ListItem, ListItemAvatar, Avatar, Divider, Button, TextField } from "@material-ui/core";
import UserItem from './UserItem';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import classes from './AdminPanel.module.scss';

export default function AdminPanel() {
    const history = useHistory();

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [postApproval, setPostApproval] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        getUsers();
        getCategories();
    }, []);

    const getUsers = async () => {
        const response = await axios.get('/api/profile/');
        setUsers(response.data);
    };

    const getCategories = async () => {
        const response = await axios.get('/api/category');
        setCategories(response.data);
    };
    
    const handleDeleteCategory = id => {
        axios.delete(`/api/category/${id}`);
        history.push('/admin');
    }


    return (
        <div style={{ padding: "2rem" }}>
            <h1>Admin Panel</h1>
            <Divider style={{ margin: "2rem 0" }}/>
            {users?.length && 
                <React.Fragment>
                    <h3>Lista de useri</h3>
                    <List>
                        {users.map((user, index) => (
                            <UserItem
                                user={user}
                                index={index}
                            />
                        ))}
                    </List>
                </React.Fragment>
            }
            
            {postApproval.length ? <h3>Postari in asteptare</h3> : <React.Fragment></React.Fragment>}
            <Divider style={{ margin: "2rem 0" }}/>
            <h3>Lista de subforumuri</h3>
            <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />} 
                onClick={() => history.push('/category/create')}
            >
                Creeaza subforum
            </Button> 
            <List>
                {categories.map((category, index) => (
                    <ListItem 
                        key={index}
                        className={classes.category}
                        button 
                        onClick={() => history.push(`/category/${category._id}`)}
                    >
                        <ListItemText primary={`${category.title}`} />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            style={{ marginRight: 4 }}
                            startIcon={<CreateIcon />}
                        >
                            Redenumeste
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<DeleteIcon />}
                            onClick={e => {e.preventDefault(); e.stopPropagation(); handleDeleteCategory(category._id); }}
                        >
                            Sterge
                        </Button>
                    </ListItem>
                ))}
            </List>
            <Divider style={{ margin: "2rem 0" }}/>
        </div>
    )
}