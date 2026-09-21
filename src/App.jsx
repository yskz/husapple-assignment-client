import React, { useState } from 'react';
import './App.css';
import { Grid } from '@mui/material';
import ISessionManager from './SessionManager';
import AppStateId from './AppState';
import InputPlayerName from './InputPlayerName';
import Matching from './Matching';
import Game from './Game';
import Error from './Error';

function App() {
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
  const setStateId = (id, playerNameForSession) => {
    if (id === stateId) return;
    switch(id) {
    case AppStateId.matching: {
      const sessionManager = ISessionManager.getInstance();
      const curSession = sessionManager.getSession();
      if (curSession) {
        sessionManager.removeSession(curSession);
      }
      const name = playerNameForSession || playerName;
      const session = sessionManager.createSession(setErrorMessage, name);
      session.start();
      break;
    }
    default: {
      break;
    }}
    _setStateId(id);
  }
  const decidePlayerName = (name) => {
    setPlayerName(name);
    setStateId(AppStateId.matching, name);
  }

  let content;
  switch(stateId) {
  case AppStateId.inputPlayerName: {
    content = <InputPlayerName setPlayerName={decidePlayerName} />
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
      <Grid container direction="row" alignItems="center" sx={{ width: '100vw', height: '100vh', justifyContent: 'center' }}>
        {content}
      </Grid>
    </div>
  );
}

export default App;
