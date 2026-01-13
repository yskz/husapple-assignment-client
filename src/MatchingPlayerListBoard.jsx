import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((_theme) => ({
  root: {
    width: '100vw',
  },
  rootArea: {
    width: '100%',
  },
  listGrid: {
  },
  list: {
    minWidth: '35em',
    overflow: 'auto',
    backgroundColor: '#f0f0f0',
  },
}));

function MatchingPlayerListBoard(props) {
  const classes = useStyles();
  const playerItems = props.playerList.map(v => {
    return (
      <ListItem key={v.id}>
        <ListItemText primary={v.name} />
      </ListItem>
    );
  });
  const listHeightProps = props.height ? { height: props.height } : {}
  return (
    <Grid className={classes.root} container direction="row" justify="center" alignItems="center">
      <Box className={classes.rootArea}>
        <Grid item>
          <Grid className={classes.listGrid} container direction="row" justify="center" alignItems="center">
            <List className={classes.list} dense={true} style={{...listHeightProps}}>
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
