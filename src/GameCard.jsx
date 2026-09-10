import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid, Grow } from '@mui/material';

function GameCard(props) {
  const pointCard = ('pointCard' in props) ? props.pointCard : false;
  const open = ('open' in props) ? props.open : true;
  const half = ('half' in props) ? props.half : false;
  const number = props.number;

  const contentSx = {
    padding: '0.2em',
  };
  const gridSx = half ? { minWidth: '1.6em', minHeight: '3.8em' } : { minWidth: '2.8em', minHeight: '3.8em' };
  const gridSxMerged = { justifyContent: 'center', alignItems: 'center', ...gridSx };
  const textSx = pointCard
    ? (number < 0 ? { color: '#ff0000', padding: 0 } : { color: '#0000ff', padding: 0 })
    : { color: '#000000', padding: 0 };

  if (pointCard) {
    contentSx.backgroundColor = open ? undefined : '#9090ff';
  } else {
    contentSx.backgroundColor = open ? undefined : '#b0b0b0';
  }

  const numTypography = open ? <Typography sx={textSx} display="inline">{number}</Typography> : <div />;
  return (
    <Grow in={true}>
      <Card sx={{ margin: '0.1em' }}>
        <CardContent sx={contentSx}>
          <Grid container direction="row" sx={gridSxMerged}>
            {numTypography}
          </Grid>
        </CardContent>
      </Card>
    </Grow>
  );
}

GameCard.propTypes = {
  pointCard: PropTypes.bool,
  number: PropTypes.number.isRequired,
  open: PropTypes.bool,
  half: PropTypes.bool,
};


export function PlayerCard(props) {
  return <GameCard {...props} pointCard={false} />
}

PlayerCard.propTypes = {
  number: PropTypes.number.isRequired,
  open: PropTypes.bool,
  half: PropTypes.bool,
};

export function PointCard(props) {
  return <GameCard {...props} pointCard={true} />
}

PointCard.propTypes = {
  number: PropTypes.number.isRequired,
  open: PropTypes.bool,
  half: PropTypes.bool,
};
