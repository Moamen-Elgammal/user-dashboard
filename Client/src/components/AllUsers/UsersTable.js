import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import classes from './UsersTable.module.css';
import UpdateUser from '../updateUserForm/UpdateUser';

const IdintetyList = (props) => {
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [oldData, setOldData] = useState([]);

  const [id, setId] = useState();

  // APPENDING THE ID TO UPDATE USER COMPONENT TO HANDLE THE DELETE METHOD

  const deleteHandeler = (id) => {
    props.onDelete(id);
  };

  // GET THE OLD USER DATA AND PASS IT TO UPDATE USER COMPONENT TO SHOW IT IN THE UPDATE FORM

  const updateHandeler = async (id) => {
    try {
      const res = await fetch(
        `https://pro-users-manger.herokuapp.com/user/info/oldData/${id}`
      );
      if (!res.ok) {
        throw new Error('Somthing Went Wrong While Getting Data In The Fields');
      }
      const data = await res.json();
      setOldData(data);
    } catch (error) {
      console.log(error);
    }

    setId(id);
    setShowUpdateUser(true);
  };

  //  HANDLING HIDE THE OVERLAY

  const hideUpdateUser = () => {
    setShowUpdateUser(false);
  };

  return (
    <>
      <div className={classes.container}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Hobbies</th>
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.idintetyInfo.map((info) => (
              <tr key={info._id}>
                <td>{info.name}</td>
                <td>{info.age}</td>
                <td>{info.hobbies}</td>
                <td>{info._id}</td>
                <td className={classes.actions}>
                  <FaRegEdit
                    className={classes.primary}
                    onClick={() => updateHandeler(info._id)}
                  />
                  <FaTimes
                    className={classes.danger}
                    onClick={() => deleteHandeler(info._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showUpdateUser && (
        <UpdateUser
          id={id}
          onCancel={hideUpdateUser}
          oldInputsValues={oldData}
        />
      )}
    </>
  );
};

export default IdintetyList;
