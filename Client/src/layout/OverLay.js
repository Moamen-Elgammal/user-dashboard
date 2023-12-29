import classes from './OverLay.module.css';

const BackDrop = (props) => {
  return <div className={classes.backdrop} />;
};

const ModalOverLay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const OverLay = (props) => {
  return (
    <>
      <BackDrop />
      <ModalOverLay>{props.children} </ModalOverLay>
    </>
  );
};

export default OverLay;
