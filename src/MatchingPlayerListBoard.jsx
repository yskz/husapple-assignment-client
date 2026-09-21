import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, List, ListItem, ListItemText } from '@mui/material';

function MatchingPlayerListBoard(props) {
  const playerItems = props.playerList.map(v => {
    return (
      <ListItem key={v.id}>
        <ListItemText primary={v.name} />
      </ListItem>
    );
  });
  const listHeightProps = props.height ? { height: props.height } : {}
  return (
    <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'center', width: '100vw' }}>
      <Box sx={{ width: '100%' }}>
        <Grid item>
          <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'center' }}>
            <List dense={true} sx={{ minWidth: '35em', overflow: 'auto', backgroundColor: '#f0f0f0' }} style={{...listHeightProps}}>
              {playerItems}
            </List>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

MatchingPlayerListBoard.propTypes = {
  height: PropTypes.string,
  playerList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isSelf: PropTypes.bool.isRequired,
  })).isRequired,
};

export default MatchingPlayerListBoard;
