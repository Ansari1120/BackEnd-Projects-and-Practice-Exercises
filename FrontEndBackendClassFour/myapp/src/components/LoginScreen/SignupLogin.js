import React, { useState } from "react";

const SignupLogin = () => {
  const [Cridentials, setCridentials] = useState({});
  const [Switch, setSwitch] = useState(false);
  const Login = () => {};
  const Signup = () => {};
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
    </>
  );
};

export default SignupLogin;
