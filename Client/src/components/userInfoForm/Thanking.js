import React from 'react';
import classes from './UserInfo.module.css';
import { useHistory } from 'react-router';
import Wave from '../../layout/Wave';
const Thanking = () => {
  const history = useHistory();

  const timeOut = setTimeout(() => {
    history.replace('/AllUsers');
    clearTimeout(timeOut);
  }, 3000);

  return (
    <section className={classes.container}>
      <h1>Thank You For Registering</h1>
      <Wave />
    </section>
  );
};

export default Thanking;
