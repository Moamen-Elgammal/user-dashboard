import React, { useRef } from 'react';
import classes from './UserInfo.module.css';
import { useHistory } from 'react-router';

const Identety = () => {
  const history = useHistory();
  const nameInputRef = useRef();
  const ageInputRef = useRef();
  const hobbyInputRef = useRef();

  const submitHandeler = (e) => {
    e.preventDefault();
    const entredName = nameInputRef.current.value;
    const entredAge = ageInputRef.current.value;
    const entredHobby = hobbyInputRef.current.value;

    fetch('https://pro-users-manger.herokuapp.com/user/info/userInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: entredName,
        age: entredAge,
        hobbies: entredHobby,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    history.replace('/Thank');
  };

  return (
    <section className={classes.container}>
      <h1>Tell Us More About Yourself</h1>
      <form className={classes.auth} onSubmit={submitHandeler}>
        <div className={classes.control}>
          <label>Your Name: </label>
          <input type='text' ref={nameInputRef}></input>
        </div>
        <div className={classes.control}>
          <label>Your Age: </label>
          <input type='number' min='10' max='99' ref={ageInputRef}></input>
        </div>
        <div className={classes.control}>
          <label>Your Hobbies: </label>
          <input type='text' ref={hobbyInputRef}></input>
        </div>
        <div className={classes.actions}>
          <button type='submit'>Subbmit</button>
        </div>
      </form>
    </section>
  );
};

export default Identety;
