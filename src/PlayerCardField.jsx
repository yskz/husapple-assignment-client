import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { PlayerCard, PointCard } from './GameCard';

const useScoreGridStyles = makeStyles((_theme) => ({
  root: {
    minHeight: '5em',
  },
  cards: {
  },
  score: {
    marginLeft: '0.2em',
  },
  scoreGrid: {
    minWidth: '4em',
  },
  scoreTextPlus: {
    color: '#ffffff',
  },
  scoreTextMinus: {
    color: '#ff0000',
  },
}));

function getScoreCards(scores) {
  return scores.map((v, i) => {
    return <PointCard number={v} open={true} half={true} key={`sc_${i}_${v}`} />
  });
}

export function ScoreGrid(props) {
  const classes = useScoreGridStyles();
  const scores = props.scores;
  const score = scores.reduce((a, v) => { return a + v; }, 0);
  const scoreCards = (scores.length > 0) ? getScoreCards(scores) : <div />;
  return (
    <Grid container direction="row" justify="space-between" alignItems="center" className={classes.root}>
      <Grid item>
        <Grid container direction="row-reverse" justify="flex-end" alignItems="center" className={classes.cards}>
          {scoreCards}
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" justify="flex-end" alignItems="center" className={classes.score}>
          <Grid item>
            <Grid container direction="row" justify="flex-end" alignItems="center">
              <Grid item className={classes.scoreGrid}>
                <Typography className={(score < 0) ? classes.scoreTextMinus : classes.scoreTextPlus}>{score}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

ScoreGrid.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
};


const useBidGridStyles = makeStyles((_theme) => ({
  root: {
    minHeight: '5em',
  },
}));

function getBidCards(numbers, open) {
  const lastIndex = numbers.length - 1;
  return numbers.map((v, i) => {
    const half = i !== lastIndex;
    const isOpen = half || open;
    return <PlayerCard number={v} open={isOpen} half={half} key={`pc_${i}_${v}_${half ? 1 : 0}_${open ? 1 : 0}`} />;
  });
}

export function BidGrid(props) {
  const classes = useBidGridStyles();
  const open = ('openNumber' in props) ? props.openNumber : true;
  const numbers = props.numbers;
  const cards = (numbers.length > 0) ? getBidCards(numbers, open) : <div />
  return (
    <Grid container direction="row-reverse" justify="flex-start" alignItems="center" className={classes.root}>
      {cards}
    </Grid>
  );
}

BidGrid.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  openNumber: PropTypes.bool,
};


const useStyles = makeStyles((_theme) => ({
  root: {
    minHeight: '7em',
  },
  nameText: {
    color: '#ffffff',
    marginLeft: '1.8em',
    padding: 0,
    fontSize: '0.8em',
  },
  info: {
    width: '100vw',
    paddingLeft: '1.0em',
    paddingRight: '1.0em',
    minHeight: '5em',
  },
}));

function PlayerCardField(props) {
  const classes = useStyles();
  return (
    <Grid container direction="column" justify="flex-start" alignItems="flex-start">
      <Grid item>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Typography className={classes.nameText}>{props.name}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" justify="space-between" alignItems="center" className={classes.info} >
          <Grid item>
            <BidGrid numbers={props.numbers} openNumber={props.openNumber} />
          </Grid>
          <Grid item>
            <ScoreGrid scores={props.scores} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

PlayerCardField.propTypes = {
  name: PropTypes.string.isRequired,
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
  openNumber: PropTypes.bool,
};

export default PlayerCardField;
