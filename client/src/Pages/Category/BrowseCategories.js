import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import RenderCategory from "./RenderCategory";
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

  // useEffect(() => {
  //     let unmounted = false;
  //     let source = axios.CancelToken.source();

  //     const getCategories = (unmounted, source) => {
  //         axios.get('/api/category',  {
  //             cancelToken: source.token,
  //         })
  //             .then(response => {
  //                 if (!unmounted) {
  //                     // @ts-ignore
  //                     setCategories(response.data);
  //                 }
  //             }).catch(function (e) {
  //             if (!unmounted) {
  //                 if (axios.isCancel(e)) {
  //                     console.log(`request cancelled:${e.message}`);
  //                 } else {
  //                     console.log("another error happened:" + e.message);
  //                 }
  //             }
  //         });
  //     };

  //     getCategories(unmounted, source);

  //     return function () {
  //         unmounted = true;
  //         source.cancel("Cancelling in cleanup");
  //     };
  // }, []);

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
            Subforum nou
          </Button>
          <Divider style={{ margin: "2rem 0" }} />
        </React.Fragment>
      )}
      {categories.map((cat, index) => (
        <RenderCategory key={index} category={cat} index={index} />
      ))}
    </div>
  );
}
