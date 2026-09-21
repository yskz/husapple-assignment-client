import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { BidGrid, ScoreGrid } from './PlayerCardField';
import { PlayerCard } from './GameCard';

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
  const disableSelect = ('disableSelect' in props) ? props.disableSelect : false;
  const procSelect = !disableSelect && ('procSelect' in props) ? props.procSelect : null;
  const numbers = props.numbers;
  const cards = (numbers.length > 0) ? getHandCards(numbers, procSelect) : <div />;
  return (
    <Grid container direction="row" alignItems="center" sx={{ minHeight: '5em', justifyContent: 'flex-start' }}>
      {cards}
    </Grid>
  );
}

HandGrid.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  disableSelect: PropTypes.bool,
  procSelect: PropTypes.func,
};


function MyPlayerCardField(props) {
  const handProps = { numbers: props.numbers };
  if ('disableSelect' in props) {
    handProps.disableSelect = props.disableSelect;
  }
  if ('procSelect' in props) {
    handProps.procSelect = props.procSelect;
  }
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
            <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'flex-start' }}>
              <Grid item sx={{ marginRight: '4em' }}>
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
