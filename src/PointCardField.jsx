import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { PointCard } from './GameCard';

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
  const openCount = ('openCount' in props) ? props.openCount : 1;
  const numbers = props.numbers;
  const pointCards = (numbers.length > 0) ? getPointCards(numbers, openCount) : <div />;
  return (
    <Grid container direction="row" alignItems="center" sx={{ width: '100vw', minHeight: '5em', justifyContent: 'flex-start' }}>
      {pointCards}
    </Grid>
  );
}

PointCardField.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  openCount: PropTypes.number,
};

export default PointCardField;
