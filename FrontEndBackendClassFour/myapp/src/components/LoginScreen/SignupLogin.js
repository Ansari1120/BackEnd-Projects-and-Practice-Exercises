import axios from "axios";
import React, { useState } from "react";

const SignupLogin = () => {
  const [Cridentials, setCridentials] = useState({});
  const [Switch, setSwitch] = useState(false);
  const Login = () => {
    axios
      .post("http://localhost:5000/api/user/login", Cridentials)
      .then((res) => {
        localStorage.setItem("token", res.data.data.token);
        console.log("user logged in sucessfully!", res);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const Signup = () => {};
  const LogOut = () => {
    localStorage.removeItem("token");
    console.log("User Logged Out SucessFully");
  };
  return (
    <>
      {Switch ? (
        <input
          aria-label="username"
          type="text"
          onChange={(e) =>
            setCridentials({ ...Cridentials, username: e.target.value })
          }
        />
      ) : (
        ""
      )}
      <input
        aria-label="email"
        type="text"
        onChange={(e) =>
          setCridentials({ ...Cridentials, email: e.target.value })
        }
      />
      <input
        aria-label="password"
        type="text"
        onChange={(e) =>
          setCridentials({ ...Cridentials, password: e.target.value })
        }
      />
      <button onClick={() => setSwitch(!Switch)}>Switch to Signup</button>
      <button onClick={Login}>Login</button>
      <button onClick={Signup}>Signup</button>
      <button onClick={LogOut}>LogOut</button>
    </>
  );
};

export default SignupLogin;
