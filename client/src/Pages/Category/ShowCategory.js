import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import ForumItem from "./ForumItem";
import { List, Button } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import classes from "./ShowCategory.module.scss";

export default function BrowseCategories() {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [fora, setFora] = useState([]);
  // const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getCategory();
    getFora();
  });

  const getCategory = async () => {
    const response = await axios.get("/api/category/" + id);
    setCategory(response.data);
  };

  const getFora = async () => {
    const response = await axios.get("/api/forum/category/" + id);
    setFora(response.data);
    // setMounted(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ marginRight: 5 }}
        onClick={() => history.push("/category")}
      >
        Inapoi
      </Button>
      {(user?.type === "admin" || user?.type === "mod") && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => history.push("/forum/create/" + id)}
        >
          Subforum nou
        </Button>
      )}
      <div className={classes.panel}>
        <React.Fragment>
          {category && <h1>{category.title}</h1>}
          <div className={classes.border} />
          <List>
            {fora.map((forum, index) => (
              <ForumItem key={index} forum={forum} index={index} />
            ))}
          </List>
        </React.Fragment>
      </div>
    </div>
  );
}
