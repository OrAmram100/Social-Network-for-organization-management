import axios from "axios";

export const loginCall = async (userCredential, dispatch,setErrorModalOpen) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const organization = await axios.post("/organizations/login/organization", userCredential);
      const user = await axios.post(`/auth/${organization.data._id}/login`, userCredential);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: user.data,
          organization: organization.data,
        },
      });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err });
      setErrorModalOpen(true);
    }
  };

export const logoutCall = (dispatch) => {
    dispatch({ type: "LOGOUT" });
    try {
        localStorage.removeItem("user");
        localStorage.removeItem("organization");
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
};

