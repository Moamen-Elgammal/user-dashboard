import React, { useState, useEffect } from 'react';

import UsersTable from './UsersTable';
import classes from './Users.module.css';
import LoadingSpinner from '../../layout/LoadingSpinner';

const MyProfile = () => {
  const [idintety, setIdintety] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = 'https://pro-users-manger.herokuapp.com/user/info/allUsers';

  // LOADING ALL USERS TO THE SCREEN WITH useEffect()

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw Error('Failed To Get The Users Idintety');
        }
        return res.json();
      })
      .then((data) => {
        setIdintety(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [url]);

  // HANDLING THE DELET USER INFO METHOD

  const deleteHandeler = (id) => {
    fetch(`https://pro-users-manger.herokuapp.com/user/info/delete/${id}`, {
      method: 'DELETE',
    }).then((res) => res.json());

    alert('User Info Deleted.. The page Will Reload');
    window.location.reload();
    // prompt('Are You Sure You Want To Delete This Account');
    // fetch(`http://localhost:3001/delete/email/${id}`, {
    //   method: 'DELETE',
    // }).then((res) => res.json());
  };
  return (
    <>
      <div className={classes.actions}>
        <h1>All Users</h1>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <UsersTable idintetyInfo={idintety} onDelete={deleteHandeler} />
      )}
    </>
  );
};

export default MyProfile;
