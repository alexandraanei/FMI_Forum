import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { List,  Divider, Button } from "@material-ui/core";
import UserItem from './UserItem';
import CategoryItem from './CategoryItem';
import AddIcon from '@material-ui/icons/Add';

export default function AdminPanel() {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [postApproval, setPostApproval] = useState([]);

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

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Panou Admin</h1>
            <Divider style={{ margin: "2rem 0" }}/>
            {users?.length && 
                <React.Fragment>
                    <h3>Lista de useri</h3>
                    <List>
                        {users.map((user, index) => (
                            <UserItem
                                key={index}
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
                    <CategoryItem
                        key={index}
                        category={category}
                        index={index}
                    />
                ))}
            </List>
            <Divider style={{ margin: "2rem 0" }}/>
        </div>
    )
}