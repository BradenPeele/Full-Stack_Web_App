import React, {useEffect} from "react";
import axios from "axios";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";

/*
  form to create posts - title, text
*/
function CreatePost() {

  let navigate = useNavigate();

  // setup form
  const initialValues = {
    title: "",
    text: ""
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a title"),
    text: Yup.string().required()
  });

  // must be logged in to post
  useEffect(() => {
    if(!localStorage.getItem("access_token")) {
      navigate("/login");
    }
  }, []);

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/posts", data, {
      headers: {access_token: localStorage.getItem("access_token")}
      })
      .then(() => {
        navigate('/');
    });
  };

  return (
    <div className="create_post_page">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="form_container">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="input_create_post"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Text: </label>
          <ErrorMessage name="text" component="span" />
          <Field
            id="input_create_post"
            name="text"
            placeholder="(Ex. Post...)"
          />
          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;