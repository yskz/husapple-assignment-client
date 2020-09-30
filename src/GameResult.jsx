import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Grid, Button } from '@material-ui/core';

export class PlayerResult {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
  },
  resultListRowRank: {
  },
  resultListRowName: {
    minWidth: '10em',
  },
  resultListRowScore: {
  },
  nextGameButtonContainer: {
    marginTop: '1em',
  },
}));

function createListItem(classes, key, result) {
  return (
    <TableRow key={key}>
      <TableCell className={classes.resultListRowRank} align="center">{result.rank}</TableCell>
      <TableCell className={classes.resultListRowName} align="left">{result.name}</TableCell>
      <TableCell className={classes.resultListRowScore} align="right">{result.score}</TableCell>
    </TableRow>
  );
}

function GameResult(props) {
  const classes = useStyles();
  const [disableButton, setDisableButton] = useState(false);
  const results = []; // props.playerResultsから表示用としてランクでソートしたリストを作成する
  const listItems = results.map((v, i) => { return createListItem(classes, i, v); });
  const procClickButton = () => {
    if (!disableButton) {
      setDisableButton(true);
      props.procNextGame();
    }
  }
  return (
    <div className="GameResult">
      <Card className={classes.root}>
        <CardHeader title="ゲーム結果" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ランク</TableCell>
                  <TableCell align="center">名前</TableCell>
                  <TableCell align="center">スコア</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listItems}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container direction="row" justify="center" alignItems="center" className={classes.nextGameButtonContainer}>
            <Grid item>
              <Button variant="contained" disabled={disableButton} color="primary" onClick={procClickButton}>もう一度プレイする</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

GameResult.propTypes = {
  playerResults: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
  })).isRequired,
  procNextGame: PropTypes.func.isRequired,
};

export default GameResult;
