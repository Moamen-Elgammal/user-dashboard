import React, { useState } from 'react';

const AuthContxt = React.createContext({
  token: '',
  isLogenIn: false,
  login: (token) => {},
  logOut: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLogedIn = !!token;

  const loginInHandeler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logOutHandeler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const contextValues = {
    token: token,
    isLogenIn: userIsLogedIn,
    login: loginInHandeler,
    logOut: logOutHandeler,
  };
  return (
    <AuthContxt.Provider value={contextValues}>
      {props.children}
    </AuthContxt.Provider>
  );
};

export default AuthContxt;
