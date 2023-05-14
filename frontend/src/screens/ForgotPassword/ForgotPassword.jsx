import React, { useState } from "react";
import "./ForgotPassword.css";
import { useHistory} from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const history = useHistory();

  const submitHandler = (e) => {
    // e.preventDefault();
    
    axios.post("/api/users/forgot-password", { email }).then((data) => {
      console.log(data)
      if (data.data.status == 0) {
    alert("ERROR")
        
      } else {
    alert("Login with the new password sent to your email id")
        
      }
    })
    // alert("Login with the new password sent to your email id")
    history.push(`/login`);
  };

  return (
      <div className="forgot-main"> 
      <div className="forgot-container">
          <p className="email-pas">Enter your email:</p>
      <form action="" onSubmit={submitHandler}>
        <input className="input-pass" type="email" name="email" id="email"
              onChange={(e) => setEmail(e.target.value)}
        />
        {/* <br /> */}
        <button className="forgot-btn" type="submit">Send verification mail</button>
          </form>
      </div>
      </div>
          
  );
}

export default ForgotPassword;
