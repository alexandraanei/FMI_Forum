import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CategoryItem from "./CategoryItem";
import {
  Divider,
  Button,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AuthContext from "../../Contexts/AuthContext";

export default function BrowseCategories() {
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    await axios.get("/api/category").then((response) => {
      setCategories(response.data);
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      {user?.type === "admin" && (
        <React.Fragment>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => history.push("/category/create")}
          >
            Forum nou
          </Button>
          <Divider style={{ margin: "2rem 0" }} />
        </React.Fragment>
      )}
      {categories.map((cat, index) => (
        <CategoryItem key={index} category={cat} index={index} />
      ))}
    </div>
  );
}
