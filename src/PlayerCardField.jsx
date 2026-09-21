import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { PlayerCard, PointCard } from './GameCard';

function getScoreCards(scores) {
  return scores.map((v, i) => {
    return <PointCard number={v} open={true} half={true} key={`sc_${i}_${v}`} />
  });
}

export function ScoreGrid(props) {
  const scores = props.scores;
  const score = scores.reduce((a, v) => { return a + v; }, 0);
  const scoreCards = (scores.length > 0) ? getScoreCards(scores) : <div />;
  const scoreTextSx = (score < 0) ? { color: '#ff0000' } : { color: '#ffffff' };
  return (
    <Grid container direction="row" alignItems="center" sx={{ minHeight: '5em', justifyContent: 'space-between' }}>
      <Grid item>
        <Grid container direction="row-reverse" alignItems="center" sx={{ justifyContent: 'flex-end' }}>
          {scoreCards}
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center" sx={{ marginLeft: '0.2em', justifyContent: 'flex-end' }}>
          <Grid item>
            <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'flex-end' }}>
              <Grid item sx={{ minWidth: '4em' }}>
                <Typography sx={scoreTextSx}>{score}</Typography>
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


function getBidCards(numbers, open) {
  const lastIndex = numbers.length - 1;
  return numbers.map((v, i) => {
    const half = i !== lastIndex;
    const isOpen = half || open;
    return <PlayerCard number={v} open={isOpen} half={half} key={`pc_${i}_${v}_${half ? 1 : 0}_${open ? 1 : 0}`} />;
  });
}

export function BidGrid(props) {
  const open = ('openNumber' in props) ? props.openNumber : true;
  const numbers = props.numbers;
  const cards = (numbers.length > 0) ? getBidCards(numbers, open) : <div />
  return (
    <Grid container direction="row-reverse" alignItems="center" sx={{ minHeight: '5em', justifyContent: 'flex-start' }}>
      {cards}
    </Grid>
  );
}

BidGrid.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  openNumber: PropTypes.bool,
};


function PlayerCardField(props) {
  return (
    <Grid container direction="column" alignItems="flex-start" sx={{ minHeight: '7em', justifyContent: 'flex-start' }}>
      <Grid item>
        <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'flex-start' }}>
          <Typography sx={{ color: '#ffffff', marginLeft: '1.8em', padding: 0, fontSize: '0.8em' }}>{props.name}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center" sx={{ width: '100vw', paddingLeft: '1.0em', paddingRight: '1.0em', minHeight: '5em', justifyContent: 'space-between' }}>
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
