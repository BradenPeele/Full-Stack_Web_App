import React, {useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../helpers/AuthContext";

/*
    uses formik, yup
    if username doesnt already exist
        put signed token in local storage and set authstate to update the navbar
*/
function Register() {

    let navigate = useNavigate();
    const {setAuthState} = useContext(AuthContext);

    // setup form
    const initialValues = {
        username: "",
        password: ""
    };
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    // register then auto log in 
    const onSubmit = (data) => {
        axios.post("http://localhost:3001/users", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                axios.post("http://localhost:3001/users/login", data).then((response) => {
                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        localStorage.setItem("access_token", response.data.token);
                        setAuthState({username: response.data.username, id: response.data.id, status: true});
                        navigate("/");
                    }
                });
            }
        });
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
            <Form className="formContainer">
                <label>Username: </label>
                <ErrorMessage name="username" component="span" />
                <Field
                    id="inputCreatePost"
                    name="username"
                    placeholder="(Ex. John123...)"
                />
  
                <label>Password: </label>
                <ErrorMessage name="password" component="span" />
                <Field
                    type="password"
                    id="inputCreatePost"
                    name="password"
                    placeholder="Your Password..."
                />
                <button type="submit"> Register</button>
            </Form>
        </Formik>
      </div>
    );
}

export default Register;