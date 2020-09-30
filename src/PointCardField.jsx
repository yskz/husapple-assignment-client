import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { PointCard } from './GameCard';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    minHeight: '5em',
  },
}));

function getPointCards(numbers, openCount) {
  return numbers.map((v, i) => {
    const open = i < openCount;
    return (
      <Grid item key={`pc_${v}_${i}_${open ? '1' : '0'}`}>
        <PointCard number={v} open={open} half={!open} />
      </Grid>
    );
  });
}

function PointCardField(props) {
  const classes = useStyles();
  const openCount = ('openCount' in props) ? props.openCount : 1;
  const numbers = props.numbers;
  const pointCards = (numbers.length > 0) ? getPointCards(numbers, openCount) : <div />;
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center" className={classes.root}>
      {pointCards}
    </Grid>
  );
}

PointCardField.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  openCount: PropTypes.number,
};

export default PointCardField;
