import React, { useState, useRef, useContext } from 'react';
import classes from './Registering.module.css';
import { useHistory } from 'react-router';
import AuthContxt from '../../store/auth-context';
import { GoogleLogin } from 'react-google-login';

const Registering = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();
  const ctx = useContext(AuthContxt);

  const switchAuthModeHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const responseSuccessGoogle = (res) => {
    console.log(res);
    fetch('https://pro-users-manger.herokuapp.com/user/googlelogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenId: res.tokenId,
        email: res.profileObj.email,
        name: res.profileObj.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.response === 'GoogleGood') {
          console.log(data);
          ctx.login(data.googleUser.tokenId);
          history.replace('/AllUsers');
        } else {
          ctx.login(data.tokenId);
          history.replace('/identefier');
          console.log(data);
        }
      })
      .catch((error) => console.log(error));
  };

  const responseErrorGoogle = (response) => {
    console.log(response);
  };

  const submitHandeler = (e) => {
    e.preventDefault();
    const entredPassword = passwordRef.current.value;
    const entredEmail = emailRef.current.value;

    if (entredEmail.trim().length === 0 || entredPassword.trim().length === 0) {
      setIsValid(false);
      return;
    }
    if (entredEmail.trim().length > 0 || entredPassword.trim().length > 0) {
      setIsValid(true);
    }
    const loginUrl = 'https://pro-users-manger.herokuapp.com/user/login';
    const signUpUrl = 'https://pro-users-manger.herokuapp.com/user/signup';
    let url;

    if (isLogin) {
      url = loginUrl;

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: entredEmail,
          password: entredPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.response === 'valid') {
            ctx.login(data.user._id);
            history.replace('/AllUsers');
          } else {
            setError(true);
            console.log(error);
          }
        })
        .catch((error) => console.log(error));
    } else {
      url = signUpUrl;

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: entredEmail,
          password: entredPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data._id);
          ctx.login(data._id);
          history.replace('/identefier');
        })
        .catch((error) => {
          setError(true);
          console.log(error);
        });
    }
  };

  return (
    <section className={classes.container}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandeler} className={classes.auth}>
        {/* Google Button */}
        <div className={classes.actions}>
          <GoogleLogin
            clientId='773069387302-d5cih0oc4n17tn3lq9d412dm6tokh8sb.apps.googleusercontent.com'
            buttonText='Continue With Google'
            onSuccess={responseSuccessGoogle}
            onFailure={responseErrorGoogle}
            cookie='SameSite=Strict'
          />
        </div>
        <div className={classes.divider}>
          <hr className={classes.left}></hr>
          <p>OR</p>
          <hr className={classes.right}></hr>
        </div>
        <div className={`${classes.control} ${!isValid && classes.invalid}`}>
          <label htmlFor='email'>Your Email</label>
          <input
            autoComplete='current-email'
            ref={emailRef}
            type='email'
            id='email'
          />
        </div>

        <div className={`${classes.control} ${!isValid && classes.invalid}`}>
          <label htmlFor='password'>Your Password</label>
          <input
            autoComplete='current-password'
            ref={passwordRef}
            type='password'
            id='password'
          />
        </div>
        {/* ERRORS MESSAGS */}
        {!isValid && (
          <div className={classes.message}>These Fields Can't Be Empty</div>
        )}
        {error && (
          <div className={classes.message}>Please Double Check Your Data</div>
        )}
        <div className={classes.actions}>
          {/* Submit Button */}
          <button>{isLogin ? 'Login' : 'Create Account'}</button>

          {/* Switch Button Between ( Login // Singup ) */}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Registering;
