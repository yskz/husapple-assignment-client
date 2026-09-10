import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@mui/material';

function MatchingReadyBoard(props) {
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
    <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'center', width: '100vw' }}>
      <Button variant="contained" disabled={disableButton} color="primary" onClick={procClickButton}>{buttonText}</Button>
    </Grid>
  );
}

MatchingReadyBoard.propTypes = {
  procSetReady: PropTypes.func,
};

export default MatchingReadyBoard;
