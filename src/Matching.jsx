import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ReadyBoard from './MatchingReadyBoard';
import PlayerListBoard from './MatchingPlayerListBoard';
import ISessionManager from './SessionManager';
import { MatchingInterface } from './Session';
import AppStateId from './AppState';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  readyBoard: {
    marginTop: '1em',
    marginBottom: '1em',
  },
}));

function convPlayerList(msgPlayerInfos) {
  return msgPlayerInfos.map(v => {
    return {
      id: v.id,
      name: v.name,
      isSelf: v.isSelf,
    };
  });
}

function Matching(props) {
  const classes = useStyles();
  const [procSetGameReady, setProcSetGameReady] = useState(null);
  const [playerList, setPlayerList] = useState([]);

  const setStateId = props.setStateId;
  const setErrorMessage = props.setErrorMessage;
  const setGameInfo = props.setGameInfo;

  const procSessionJoined = (setGameReady, playerList) => {
    setProcSetGameReady(() => setGameReady);
    setPlayerList(playerList);
  }
  const procSessionJoinFailed = () => {
    setErrorMessage('セッション参加に失敗しました');
  }
  const procUpdatePlayerList = (playerList) => {
    setPlayerList(playerList);
  }
  const procGameStart = (gameInfo) => {
    setGameInfo(gameInfo); // ステート変更よりも前に設定する必要があります
    setStateId(AppStateId.game);
  }

  useEffect(() => {
    const sessionManager = ISessionManager.getInstance();
    const curSession = sessionManager.getSession();
    if (!curSession) {
      console.error("error : not found session.");
      setErrorMessage('想定外のエラーが発生しました');
      return; // cleanupするべきリソースが存在しない
    }
    curSession.setMatchingInterface(new MatchingInterface(procSessionJoined, procSessionJoinFailed, procUpdatePlayerList, procGameStart));
    return () => {
      curSession.setMatchingInterface();
    }
  });

  const procSetReady = procSetGameReady ? () => { procSetGameReady(); } : null;
  return (
    <Grid className={classes.root} container direction="column-reverse" justify="center" alignItems="center">
      <Grid className={classes.readyBoard} item>
        <ReadyBoard className={classes.readyBoard} procSetReady={procSetReady} />
      </Grid>
      <Grid item>
        <PlayerListBoard playerList={convPlayerList(playerList)} height="80vh"/>
      </Grid>
    </Grid>
  );
}

Matching.propTypes = {
  playerName: PropTypes.string.isRequired,
  setStateId: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setGameInfo: PropTypes.func.isRequired,
};

export default Matching;
