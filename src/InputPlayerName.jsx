import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Button } from '@mui/material';

function InputPlayerName(props) {
  const [name, setName] = useState("");
  const procInputPlayerName = (ev) => {
    setName(ev.target.value.trim());
  }
  const procDecidePlayerName = () => {
    if (name.length > 0) { // 念のため
      props.setPlayerName(name);
    }
  }
  return (
    <div className="InputPlayerName">
      <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'center' }}>
        <Grid item>
          <TextField id="player-name" label="プレイヤー名" value={name} margin="none" onChange={procInputPlayerName} />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" disabled={name.length <= 0} onClick={procDecidePlayerName} sx={{ marginLeft: '1em' }}>設定</Button>
        </Grid>
      </Grid>
    </div>
  );
}

InputPlayerName.propTypes = {
  setPlayerName: PropTypes.func.isRequired,
};

export default InputPlayerName;
