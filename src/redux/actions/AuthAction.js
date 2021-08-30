const setUser = (mode) => {
  return {
    type: "SET_USER",
    payload: mode,
  };
};

const setToken = (color) => {
  return {
    type: "SET_TOKEN",
    payload: color,
  };
};

const setAuth = () => {
  return {
    type: "SET_AUTH",
  };
};

const getToken = () => {
  return {
    type: "GET_TOKEN",
  };
};
const getUser = () => {
  return {
    type: "GET_USER",
  };
};
const getAuth = () => {
  return {
    type: "GET_AUTH",
  };
};

const exportDefault = {
  setUser,
  setToken,
  setAuth,
  getAuth,
  getToken,
  getUser,
};

export default exportDefault;
