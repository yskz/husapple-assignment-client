import React from 'react';
//import './App.css';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

const useStyles = makeStyles((_theme) => ({
  root: {
  },
}));

function Error(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Dialog open={true} fullWidth={true} maxWidth="sm" aria-labelledby="error-dialog-title" aria-describedby="error-dialog-description">
        <DialogTitle id="error-dialog-title">エラーが発生しました</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">{props.message}</DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Error;
