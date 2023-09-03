import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';

const useStyles = makeStyles((_theme) => ({
  root: {
    width: '100vw',
  },
}));

function MatchingReadyBoard(props) {
  const classes = useStyles();
  const [ready, setReady] = useState(false);
  const procSetReady = props.procSetReady;
  const procClickButton = () => {
    if (!ready && procSetReady) {
      setReady(true);
      procSetReady(true);
    }
  }
  const disableButton = !procSetReady || ready;
  const buttonText = !ready ? "ゲーム開始の準備ができた" : "ゲーム開始待ちです"
  return (
    <Grid className={classes.root} container direction="row" justify="center" alignItems="center">
      <Button variant="contained" disabled={disableButton} color="primary" onClick={procClickButton}>{buttonText}</Button>
    </Grid>
  );
}

MatchingReadyBoard.propTypes = {
  procSetReady: PropTypes.func,
};

export default MatchingReadyBoard;
