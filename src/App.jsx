import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ISessionManager from './SessionManager';
import AppStateId from './AppState';
import InputPlayerName from './InputPlayerName';
import Matching from './Matching';
import Game from './Game';
import Error from './Error';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100vw',
    height: '100vh',
  },
}));

function App() {
  const classes = useStyles();
  const [stateId, _setStateId] = useState(AppStateId.inputPlayerName);
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, _setErrorMessage] = useState(null);
  const [transferGameInfo, setTransferGameInfo] = useState(null);
  const setErrorMessage = (msg) => {
    _setErrorMessage(msg);
    if (msg !== null) {
      setStateId(AppStateId.error);
    }
  }
  const setStateId = (id) => {
    if (id === stateId) return;
    switch(id) {
    case AppStateId.matching: {
      const sessionManager = ISessionManager.getInstance();
      const curSession = sessionManager.getSession();
      if (curSession) {
        sessionManager.removeSession(curSession);
      }
      const session = sessionManager.createSession(setErrorMessage, playerName);
      session.start();
      break;
    }
    default: {
      break;
    }}
    _setStateId(id);
  }
  const refLatestSetStateId = useRef();
  refLatestSetStateId.current = setStateId;

  useEffect(() => {
    const setStateId = refLatestSetStateId.current;
    setStateId((playerName.length > 0) ? AppStateId.matching : AppStateId.inputPlayerName);
  }, [playerName]);

  let content;
  switch(stateId) {
  case AppStateId.inputPlayerName: {
    content = <InputPlayerName setPlayerName={setPlayerName} />
    break;
  }
  case AppStateId.matching: {
    content = <Matching playerName={playerName} setStateId={setStateId} setErrorMessage={setErrorMessage} setGameInfo={setTransferGameInfo} />
    break;
  }
  case AppStateId.game: {
    content = <Game playerName={playerName} setStateId={setStateId} setErrorMessage={setErrorMessage} gameInfo={transferGameInfo} />
    break;
  }
  default: {
    content = <Error message={(errorMessage !== null) ? errorMessage : 'エラーが発生しました'} />
    break;
  }}
  return (
    <div className="App">
      <Grid className={classes.container} container direction="row" justify="center" alignItems="center">
        {content}
      </Grid>
    </div>
  );
}

export default App;
