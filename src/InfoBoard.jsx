import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';

function InfoBoard(props) {
  const text = (props.text && props.text.length > 0) ? props.text : null;
  const textTypography = text ? <Typography sx={{ color: '#ffffff' }}>{text}</Typography> : <div />;
  return (
    <Grid container direction="row" alignItems="center" sx={{ width: '100vw', height: '2.5em', backgroundColor: '#606060', justifyContent: 'center' }}>
      {textTypography}
    </Grid>
  );
}

InfoBoard.propTypes = {
  text: PropTypes.string,
};

export default InfoBoard;
