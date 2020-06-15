import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

export default function RenderCategory(props) {
    const history = useHistory();
    const [fora, setFora] = useState([]);
    const { id } = props;

    useEffect(() => {
        getFora();
    });

    const getFora = async () => {
      const response = await axios.get('/api/forum/category/' + id);
        setFora(response.data);
    };

    return (
        <List>
            {fora.map((forum) => (
                <ListItem key={forum._id} button onClick={() => history.push(`/forum/${forum._id}`)}>
                    <ListItemText primary={forum.title} />
                </ListItem>
            ))}
        </List>
    )
}