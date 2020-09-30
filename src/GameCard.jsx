import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Grid, Grow } from '@material-ui/core';

const useGameCardStyles = makeStyles((theme) => ({
  root: {
    margin: '0.1em',
  },
  pointOpenContent: {
    padding: '0.2em',
    "&:last-child": {
      paddingBottom: '0.2em',
    },
  },
  pointCloseContent: {
    backgroundColor: '#9090ff',
    padding: '0.2em',
    "&:last-child": {
      paddingBottom: '0.2em',
    },
  },
  cardOpenContent: {
    padding: '0.2em',
    "&:last-child": {
      paddingBottom: '0.2em',
    },
  },
  cardCloseContent: {
    backgroundColor: '#b0b0b0',
    padding: '0.2em',
    "&:last-child": {
      paddingBottom: '0.2em',
    },
  },
  fullGrid: {
    minWidth: '2.8em',
    minHeight: '3.8em',
  },
  halfGrid: {
    minWidth: '1.6em',
    minHeight: '3.8em',
  },
  pointPlusText: {
    color: '#0000ff',
    padding: '0',
  },
  pointMinusText: {
    color: '#ff0000',
    padding: '0',
  },
  cardText: {
    color: '#000000',
    padding: '0',
  },
  test: {
    color: '#ff0000',
    backgroundColor: '#00ff00',
    padding: '0',
  },
}));

function GameCard(props) {
  const classes = useGameCardStyles();
  const pointCard = ('pointCard' in props) ? props.pointCard : false;
  const open = ('open' in props) ? props.open : true;
  const half = ('half' in props) ? props.half : false;
  const number = props.number;
  const contentClass = pointCard ? (open ? classes.pointOpenContent : classes.pointCloseContent) : (open ? classes.cardOpenContent : classes.cardCloseContent);
  const gridClass = half ? classes.halfGrid : classes.fullGrid;
  const textClass = pointCard ? ((number < 0) ? classes.pointMinusText : classes.pointPlusText) : classes.cardText;
  const numTypography = open ? <Typography className={textClass} display="inline">{number}</Typography> : <div />;
  return (
    <Grow in={true}>
      <Card className={classes.root}>
        <CardContent className={contentClass}>
          <Grid container direction="row" justify="center" alignItems="center" className={gridClass}>
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
