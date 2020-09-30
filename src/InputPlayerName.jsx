import React, { useState } from 'react';
//import './App.css';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  inputRow: {
  },
  playerNameField: {
  },
  setButton: {
    marginLeft: '1em',
  },
}));

function InputPlayerName(props) {
  const classes = useStyles();
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
      <div className={classes.root}>
        <Grid className={classes.inputRow} container direction="row" justify="center" alignItems="center">
          <Grid item>
            <TextField className={classes.playerNameField} id="player-name" label="プレイヤー名" value={name} margin="none" onChange={procInputPlayerName} />
          </Grid>
          <Grid item>
            <Button className={classes.setButton} variant="contained" color="primary" disabled={name.length <= 0} onClick={procDecidePlayerName}>設定</Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

InputPlayerName.propTypes = {
  setPlayerName: PropTypes.func.isRequired,
};

export default InputPlayerName;
