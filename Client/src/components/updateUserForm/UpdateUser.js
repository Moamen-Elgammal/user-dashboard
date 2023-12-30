import React, { useRef } from 'react';
import OverLay from '../../layout/OverLay';
import classes from './UpdateUser.module.css';

const UpdateUser = (props) => {
  //  THE VALUES OF THESE INPUTS COMES FROM THE IDINTETY LIST COMPONANET (( IT IS THE CURRENT VALUE OF THE USERS INFO ))
  const nameInputRef = useRef();
  const ageInputRef = useRef();
  const hobbyInputRef = useRef();

  const submitHandeler = async (e) => {
    e.preventDefault();

    // RESONSEBLE FOR SENDING THE UPDATING DATA TO THE BACKEND

    const newName = nameInputRef.current.value;
    const newAge = ageInputRef.current.value;
    const newHobby = hobbyInputRef.current.value;

    fetch('https://pro-users-manger.herokuapp.com/user/info/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: props.id,
        newName: newName,
        newAge: newAge,
        newHobby: newHobby,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    window.location.reload();
    props.onCancel();
  };

  // TO HIDE THE OVERLAY IF YOU WANT TO CANCLE THE UPDATE

  const cancelHandeler = () => {
    props.onCancel();
  };

  return (
    <OverLay>
      <section className={classes.container}>
        <h1>Update The User</h1>
        <form className={classes.auth} onSubmit={submitHandeler}>
          <div className={classes.control}>
            <label>Your Name: </label>
            <input
              type='text'
              defaultValue={props.oldInputsValues.name}
              ref={nameInputRef}
            ></input>
          </div>
          <div className={classes.control}>
            <label>Your Age: </label>
            <input
              type='number'
              defaultValue={props.oldInputsValues.age}
              ref={ageInputRef}
            ></input>
          </div>
          <div className={classes.control}>
            <label>Your Hobbies: </label>
            <input
              type='text'
              defaultValue={props.oldInputsValues.hobbies}
              ref={hobbyInputRef}
            ></input>
          </div>
          <div className={classes.actions}>
            <button onClick={cancelHandeler} className={classes.discard}>
              Discard
            </button>
            <button type='submit' className={classes.submit}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </OverLay>
  );
};

export default UpdateUser;
