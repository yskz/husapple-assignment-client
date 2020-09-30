import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { BidGrid, ScoreGrid } from './PlayerCardField';
import { PlayerCard } from './GameCard';

const useHandGridStyles = makeStyles((theme) => ({
  root: {
    minHeight: '5em',
  },
}));

function getHandCards(numbers, procSelect) {
  return numbers.map((v, i) => {
    const procClick = () => {
      if (procSelect) {
        procSelect(v);
      }
    }
    return (
      <div onClick={procClick} key={`hc_${i}_${v}`}>
        <PlayerCard number={v} open={true} half={false} />
      </div>
    );
  });
}

export function HandGrid(props) {
  const classes = useHandGridStyles();
  const disableSelect = ('disableSelect' in props) ? props.disableSelect : false;
  const procSelect = !disableSelect && ('procSelect' in props) ? props.procSelect : null;
  const numbers = props.numbers;
  const cards = (numbers.length > 0) ? getHandCards(numbers, procSelect) : <div />;
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center" className={classes.root}>
      {cards}
    </Grid>
  );
}

HandGrid.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  disableSelect: PropTypes.bool,
  procSelect: PropTypes.func,
};


const useStyles = makeStyles((theme) => ({
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
  handGrid: {
    marginRight: '4em',
  },
}));

function MyPlayerCardField(props) {
  const classes = useStyles();
  const handProps = { numbers: props.numbers };
  if ('disableSelect' in props) {
    handProps.disableSelect = props.disableSelect;
  }
  if ('procSelect' in props) {
    handProps.procSelect = props.procSelect;
  }
  return (
    <Grid container direction="column" justify="flex-start" alignItems="flex-start">
      <Grid item>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Typography className={classes.nameText}>{props.name}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" justify="space-between" alignItems="center" className={classes.info}>
          <Grid item>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item className={classes.handGrid}>
                <HandGrid {...handProps} />
              </Grid>
              <Grid item>
                <BidGrid numbers={props.bidNumbers} openNumber={true} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <ScoreGrid scores={props.scores} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

MyPlayerCardField.propTypes = {
  name: PropTypes.string.isRequired,
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  bidNumbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  scores: PropTypes.arrayOf(PropTypes.number).isRequired,
  disableSelect: PropTypes.bool,
  procSelect: PropTypes.func,
};

export default MyPlayerCardField;
