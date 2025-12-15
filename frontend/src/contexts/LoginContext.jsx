import { createContext, useState, useEffect } from "react";
import axios from "axios";

//create context object
export const loginContextObj = createContext();
const apiUrl = import.meta.env.VITE_API_URL;

function LoginContext({ children }) {
  //state
  const [loginStatus, setLoginStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginErrMessage, setLoginErrorMessage] = useState("");

  //user login
  const userLogin = async (userCredObj) => {
    try {
      let res = await axios.post(`${apiUrl}/user-api/login`, userCredObj, {
        withCredentials: true,
      });
      //if login success
      if (res.status === 200) {
        //update the user
        setCurrentUser(res.data.payload);
        setLoginStatus(true);
        setLoginErrorMessage("");
      }
    } catch (err) {
      console.log("err is ", err.response.data.message);
      setLoginErrorMessage(err.response.data.message);
    }
  };

  //user logout
  const userLogout = async () => {
    let res = await axios.get(`${apiUrl}/user-api/logout`, { withCredentials: true });
    if (res.status === 200) {
      setLoginStatus(false);
    }
  };

  console.log("Current user is ", currentUser);
  console.log("login err is ", loginErrMessage);

  // const pageRefresh = async () => {
  //   let res = await axios.get("http://localhost:8000/refresh", { withCredentials: true });
  //   console.log("res is ", res);
  //   setCurrentUser(res.data.payload);
  //   setLoginStatus(true);
  //   setLoginErrorMessage("");
  // };
  const pageRefresh = async () => {
    try {
      let res = await axios.get(`${apiUrl}/refresh`, {
        withCredentials: true,
      });

      setCurrentUser(res.data.payload);
      setLoginStatus(true);
      setLoginErrorMessage("");
    } catch (err) {
      // When no token exists OR expired token → refresh fails → user is not logged in.
      if (err.response?.status === 401) {
        setLoginStatus(false);
        setCurrentUser(null);
        // DO NOT show any message during initial load
        return;
      }

      console.error("Unexpected error:", err);
    }
  };

useEffect(() => {
  // define an async function inside the effect
  const refreshUser = async () => {
    await pageRefresh();
  };

  refreshUser();
}, []);


  return (
    <loginContextObj.Provider
      value={{ loginStatus, currentUser, setCurrentUser, loginErrMessage, userLogin, userLogout }}
    >
      {children}
    </loginContextObj.Provider>
  );
}

export default LoginContext;
