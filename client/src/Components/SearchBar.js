import React from 'react'
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles, fade } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
}));


function SearchBar(props) {

  const regex = /^\d{5}$/
  const classes = useStyles();

  const sendCallback = event => {
      if (event.key === 'Enter') {
        if (regex.test(event.target.value)) {
          props.searchListener(event.target.value)
        } else {
          props.searchListener(0);
        }
      }
  }

  return (
      <div className={classes.search}>
          <div className={classes.searchIcon}>
              <SearchIcon />
          </div>
          <InputBase
          placeholder="Search…"
          onKeyPress={sendCallback}
          classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          />
      </div>
  )
}

export default SearchBar
