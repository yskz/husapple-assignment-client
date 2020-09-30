import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '2.5em',
    backgroundColor: '#606060',
  },
  text: {
    color: '#ffffff',
  },
}));

function InfoBoard(props) {
  const classes = useStyles();
  const text = (props.text && props.text.length > 0) ? props.text : null;
  const textTypography = text ? <Typography className={classes.text}>{text}</Typography> : <div />;
  return (
    <Grid container direction="row" justify="center" alignItems="center" className={classes.root}>
      {textTypography}
    </Grid>
  );
}

InfoBoard.propTypes = {
  text: PropTypes.string,
};

export default InfoBoard;
