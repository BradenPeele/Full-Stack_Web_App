import React, { useState } from "react";
import axios from "axios";
import {useParams, useNavigate} from "react-router-dom";

/*
  form that allows users to change their password
*/
function ChangePassword() {

  let {id} = useParams(); // user id passed 
  let navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const change_password = () => {
    axios.put("http://localhost:3001/users/changepassword",
      {oldPassword: oldPassword, newPassword: newPassword,},
      {headers: {access_token: localStorage.getItem("access_token")}}
    ).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        navigate(`/profile/${id}`);
      }
    });
  };

  return (
    <div className="change_password_page">
      <div className="form_container">
        <h1 className="title"> Change Password </h1>
        <input className = "text_field"
          type="text"
          placeholder="Old Password..."
          onChange={(event) => {
            setOldPassword(event.target.value);
          }}
        />
        <input className = "text_field"
          type="text"
          placeholder="New Password..."
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
        />
        <button onClick={change_password}> Save Changes</button>
      </div>
    </div>
  );
}

export default ChangePassword;