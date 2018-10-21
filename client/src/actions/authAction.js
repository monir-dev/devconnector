import axios from "axios";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from "../utils/setAuthToken";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(user => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login - Get user Token
export const loginUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // console.log(res);

      // save to loacal storage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // set token to auth header
      setAuthToken(token);
      // decode token to get user
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storeage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future request
  setAuthToken(false);
  // set current to {} which will set isAuthenticate to false
  dispatch(setCurrentUser({}));
};
