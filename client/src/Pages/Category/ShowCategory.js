import React, {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { List, ListItemText, ListItem, Button } from "@material-ui/core";

export default function BrowseCategories() {
    const history = useHistory();
    const { id } = useParams();

    const [category, setCategory] = useState(null);
    const [fora, setFora] = useState([]);

    useEffect(() => {
        getCategory();
        getFora();
    });

    const getCategory = async () => {
        const response = await axios.get('/api/category/' + id);
        setCategory(response.data);
    };

    const getFora = async () => {
      const response = await axios.get('/api/forum/category/' + id);
        setFora(response.data);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Button variant="contained" color="primary" onClick={() => history.push("/forum/create/" + id)}>Create Forum</Button>
            {category && <h1>{category.title}</h1>}
            <List>
                {fora.map((forum, index) => (
                    <ListItem button onClick={() => history.push(`/forum/${forum._id}`)}>
                        <ListItemText primary={forum.title} secondary={new Date(forum.createdAt).toUTCString()} />
                    </ListItem>
                ))}
            </List>
        </div>
    )
}