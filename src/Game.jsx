import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InfoBoard from './InfoBoard';
import MyPlayerCardField from './MyPlayerCardField';
import PointCardField from './PointCardField';
import PlayerCardField from './PlayerCardField';
import Result, { PlayerResult } from './GameResult';
import AppStateId from './AppState';
import ISessionManager from './SessionManager';
import { GameInterface } from './Session';
import { GameInfo as _gameInfo } from './protocol';
const GameInfo = _gameInfo.GameInfo;

const useStyles = makeStyles((_theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#004000',
  },
  infoBoardBox: {
  },
  myPlayerCardFieldBox: {
    position: 'absolute',
    bottom: 0,
  },
  scoreAndOtherPlayerBox: {
    overflow: 'auto',
    overflowX: 'hidden',
    minHeight: '7em',
    maxHeight: 'calc(100vh - 8.8em)',
  },
}));

const unexpectedErrorText = '想定外のエラーが発生しました';
const infoMessages = {
  bidding: '出すカードを選んでください',
  waitFinishTurn: '他のプレイヤーを待っています',
  draw: 'このターンはドローです',
  finishGame: 'ゲーム終了',
  lastStanding: '他プレイヤーが居なくなったためゲーム終了',
}

function getMyPlayerCardField(disableSelect, procSelect, gameInfo) {
  const myPlayer = gameInfo.myPlayer;
  const bidNumbers = [...myPlayer.usedCards];
  if (myPlayer.bidCard !== null) {
    bidNumbers.push(myPlayer.bidCard);
  }
  const props = {
    name: myPlayer.name,
    numbers: myPlayer.myCards,
    bidNumbers: bidNumbers,
    scores: myPlayer.pointCards
  };
  return <MyPlayerCardField {...props} disableSelect={disableSelect} procSelect={procSelect} />;
}

function getPointCardField(gameInfo) {
  return <PointCardField numbers={gameInfo.pointCards} openCount={gameInfo.openPointCardCount} />;
}

function getPlayerCardFields(gameInfo) {
  const isBidCardOpen = gameInfo.isBidCardOpen;
  const getPlayerCardField = (player) => {
    const numbers = [...player.usedCards];
    const bid = player.bidCard !== null;
    if (bid) {
      numbers.push(player.bidCard);
    }
    return <PlayerCardField key={player.id} name={player.name} numbers={numbers} scores={player.pointCards} openNumber={!bid || isBidCardOpen} />
  }
  return gameInfo.players.map(p => getPlayerCardField(p));
}

function updateOtherPlayersBidCard(gameInfo, playerId) {
  const playerIndex = gameInfo.players.findIndex(p => p.id === playerId);
  if (playerIndex < 0) return gameInfo;
  const info = gameInfo.clone(); // ステート内のデータを直にいじらないように
  const player = info.players[playerIndex];
  player.bidCard = 0; // チート防止
  return info;
}

function removePlayer(gameInfo, playerId) {
  const playerIndex = gameInfo.players.findIndex(p => p.id === playerId);
  if (playerIndex < 0) return gameInfo;
  const info = gameInfo.clone(); // ステート内のデータを直にいじらないように
  info.players.splice(playerIndex, 1);
  return info;
}

function createPlayerResults(gameInfo) {
  return [gameInfo.myPlayer, ...gameInfo.players].map((player) => {
    const score = player.pointCards.reduce((acc, cur) => acc + cur, 0);
    return new PlayerResult(player.name, score);
  });
}

function GameMain(props) {
  const classes = useStyles();
  const [infoText, setInfoText] = useState(infoMessages.bidding);
  const [gameInfo, setGameInfo] = useState(props.gameInfo);
  const [dispGameInfo, setDispGameInfo] = useState(null);
  const refGameFinished = useRef(false);
  const [disableSelectCard, _setDisableSelectCard] = useState(false);
  const refDispResultCleanupCallback = useRef(null);
  const isGameFinished = () => refGameFinished.current;
  const setGameFinished = (flag) => {
    refGameFinished.current = flag;
  }
  const getDispResultCleanupCallBack = () => refDispResultCleanupCallback.current;
  const clearDispResultCleanupCallback = () => {
    const callback = getDispResultCleanupCallBack();
    if (callback) {
      window.clearTimeout(callback);
      refDispResultCleanupCallback.current = null;
    }
  }
  const setDispResultCleanupCallback = (callback, time) => {
    clearDispResultCleanupCallback();
    window.setTimeout(callback, time);
    refDispResultCleanupCallback.current = callback;
  }
  const setDisableSelectCard = (num) => {
    const sessionManager = ISessionManager.getInstance();
    const curSession = sessionManager.getSession();
    if (!curSession) {
      console.error("error : not found session.");
      setErrorMessage(unexpectedErrorText);
      return; // cleanupするべきリソースが存在しない
    }
    if (curSession.bidCard(gameInfo.turnNum, num)) {
      const info = gameInfo.clone();
      const myPlayer = info.myPlayer;
      myPlayer.myCards = myPlayer.myCards.filter(v => v !== num);
      myPlayer.bidCard = num;
      setInfoText(infoMessages.waitFinishTurn);
      setGameInfo(info);
      _setDisableSelectCard(true);
    }
  }

  const setErrorMessage = props.setErrorMessage;
  const procLeavePlayer = (playerId) => {
    setGameInfo(removePlayer(gameInfo, playerId));
  }
  const procTurnStart = (gameInfo) => {
    setGameInfo(gameInfo);
  };
  const procBidCardOtherPlayer = (turnNum, playerId) => {
    if (gameInfo.turnNum === turnNum) {
      setGameInfo(updateOtherPlayersBidCard(gameInfo, playerId));
    }
  };
  const procTurnFinish = (gameInfo) => {
    setDispGameInfo(gameInfo);
    const winnerCurrentTurn = gameInfo.winnerCurrentTurn;
    let infoText;
    if (winnerCurrentTurn) {
      infoText = winnerCurrentTurn.isDraw() ? infoMessages.draw : `このターンの勝者は${winnerCurrentTurn.playerName}です`
    } else {
      infoText = ''; // ここに来ることはないはず
    }
    setInfoText(infoText);
    const procCleanup = () => {
      const gameFinished = isGameFinished();
      setInfoText(gameFinished ? infoMessages.finishGame : infoMessages.bidding);
      setDispGameInfo(null);
      _setDisableSelectCard(gameFinished);
      if (gameFinished) {
        props.setPlayerResults(createPlayerResults(gameInfo));
      }
    }
    setDispResultCleanupCallback(procCleanup, 4000);
  };
  const procGameFinish = (gameInfo) => {
    if (gameInfo.players.length <= 0) {
      setInfoText(infoMessages.lastStanding);
      const procCleanup = () => {
        props.setPlayerResults(createPlayerResults(gameInfo));
      }
      setDispResultCleanupCallback(procCleanup);
    }
    _setDisableSelectCard(true);
    setGameFinished(true);
    setGameInfo(gameInfo);
    setDispGameInfo(gameInfo);
  }

  useEffect(() => {
    const sessionManager = ISessionManager.getInstance();
    const curSession = sessionManager.getSession();
    if (!curSession) { // ゲーム終了後はセッションがなくなります
      return; // cleanupするべきリソースが存在しない
    }
    curSession.setGameInterface(new GameInterface(procLeavePlayer, procTurnStart, procBidCardOtherPlayer, procTurnFinish, procGameFinish));
    return () => {
      curSession.setGameInterface();
    }
  });

  const curGameInfo = dispGameInfo ? dispGameInfo : gameInfo;
  const infoBoardProps = infoText ? { text: infoText } : {};
  return (
    <div className={classes.root}>
      <div className={classes.infoBoardBox}>
        <InfoBoard {...infoBoardProps} />
      </div>
      <div className={classes.scoreAndOtherPlayerBox}>
        {getPointCardField(curGameInfo)}
        {getPlayerCardFields(curGameInfo)}
      </div>
      <div className={classes.myPlayerCardFieldBox}>
        {getMyPlayerCardField(disableSelectCard, setDisableSelectCard, curGameInfo)}
      </div>
    </div>
  );
}

GameMain.propTypes = {
  playerName: PropTypes.string.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  gameInfo: PropTypes.instanceOf(GameInfo).isRequired,
  setPlayerResults: PropTypes.func.isRequired,
};


function Game(props) {
  const [playerResults, setPlayerResults] = useState(null);
  const procNextGame = () => {
    props.setStateId(AppStateId.inputPlayerName);
  }
  return playerResults ? <Result playerResults={playerResults} procNextGame={procNextGame} /> : <GameMain {...props} setPlayerResults={setPlayerResults} />
}

Game.propTypes = {
  playerName: PropTypes.string.isRequired,
  setStateId: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  gameInfo: PropTypes.instanceOf(GameInfo).isRequired,
};

export default Game;
