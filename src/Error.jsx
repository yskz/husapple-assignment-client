import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';

function Error(props) {
  return (
    <Dialog open={true} fullWidth={true} maxWidth="sm" aria-labelledby="error-dialog-title" aria-describedby="error-dialog-description">
      <DialogTitle id="error-dialog-title">エラーが発生しました</DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-description">{props.message}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Error;
