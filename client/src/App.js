import React, { useState, useEffect } from 'react';
import './App.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { LinearProgress } from '@material-ui/core';
import ForecastListItem from './Components/ForecastListItem'
import LiveTemperature from './Components/LiveTemperature';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import SearchBar from './Components/SearchBar';
import Panel from './Components/Panel';
import Snackbar from '@material-ui/core/Snackbar';
import SnackBarContentWrapper from './Components/SnackBarContentWrapper'
import TemperatureGraph from './Components/TemperatureGraph';

const useStyles = makeStyles(theme => ({
  theme: {
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff'
  },
  root: {
    flexGrow: 1,
    height: '100vh',
    width: '100vw'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  subtitle: {
    marginBottom: '20px',
  },
  padded: {
    padding: theme.spacing(3, 2)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  paperTheme: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#ffffff',
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  loader: {
    display: 'block',
    margin: 'auto'
  },
  grow: {
    flexGrow: 1,
  }
}));

const ColorLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#667eea',
  },
  barColorPrimary: {
    backgroundColor: '#764ba2',
  },
})(LinearProgress);

export default function App() {

  const [appName, changeAppName] = useState('WeatherHub')
  const [city, updateCity] = useState('Sykesville, MD')
  const [forecast, updateForecast] = useState({})
  const [lat, updateLat] = useState(39.39667)
  const [lng, updateLng] = useState(-76.965)
  const [loaded, updateLoaded] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);

  //SnackBar Open/Close
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackVar, setSnackVar] = useState('error')
  const [snackMsg, setSnackMsg] = useState('default message')

  const classes = useStyles();
  const open = Boolean(anchorEl);

  useEffect(() => {
    updateLoaded(false)
    axios.get(`/api/forecast/${lat},${lng}`)
      .then(res => {
        updateForecast(res.data)
      })
      .catch(error => {
        console.log("Oops... " + error)
      })
  }, [lat, lng])

  useEffect(() => {
    if (forecast.currently != undefined) {
      updateLoaded(true)
    } else {
      console.log("Forecast is undefined.")
    }
  }, [forecast])

  const searchCallback = search => {
    if (!search) {
      handleSnackOpen('error', 'Invalid search, please try again.')
    } else {
      axios.get(`/api/zip/${search}`)
      .then(response => {
        var data = response.data

        if (data.records[0] != undefined) {
          updateCity(data.records[0].fields.city + ", " + data.records[0].fields.state)
          updateLat(data.records[0].fields.latitude)
          updateLng(data.records[0].fields.longitude)
        } else {
          handleSnackOpen('error', `Zip-code not found: ${search}`);
        }
      })
    }
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleSnackOpen = (variant, message) => {
    setSnackVar(variant)
    setSnackMsg(message)
    setSnackOpen(true)
  }
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (address) => {
    handleClose()
  };

  if (!loaded) {
    return(
      <div className={classes.root}>
        <AppBar className={classes.theme} position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6">
              {appName}
            </Typography>
          </Toolbar>
        </AppBar>
        <ColorLinearProgress />
      </div>
    )
  } else {
    return (
      <div className={classes.root}>

        <AppBar className={classes.theme} position="static">
            <Toolbar>
              <Typography className={classes.title} variant="h6">
                {appName}
              </Typography>
              <SearchBar searchListener={searchCallback} />
              <div className={classes.grow} />
              <IconButton
                edge="end"
                aria-label="display more actions"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleMenuClick}>Metric</MenuItem>
                <MenuItem onClick={handleMenuClick}>Imperial</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

        <Container className={classes.padded} maxWidth="lg">
          <Grid container direction='row' spacing={2}>

            <Grid item xs={12} md={4}>
              <Grid container direction='column' spacing={2}>
  
                <Grid item>
                  <Paper className={classes.paperTheme}>
                    <LiveTemperature currently={forecast.currently} />
                  </Paper>
                </Grid>
  
                <Grid item>
                  <Paper className={classes.paper}>
                    <Grid container direction='column' alignItems='flex-start'>
                      <Grid item>
                        <Typography variant='h5'>
                          7 Day Forecast
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant='body1' className={classes.subtitle}>
                          {forecast.daily.summary}
                        </Typography>
                      </Grid>
                      {
                        forecast.daily != undefined ? 
                        forecast.daily.data.map((day) => 
                        <ForecastListItem key={day.time} day={day} />)
                        : null
                      }
                    </Grid>
                  </Paper>
                </Grid>
  
              </Grid>
            </Grid>
            <Grid item xs={12} md={8}>

              <Grid container direction='column' spacing={2}>

                <Grid item>
                  <Panel data={forecast} icon='loc' variant='current-forecast-details' title={city} />
                </Grid>

                <Grid item>
                  <TemperatureGraph title="7 Day Temperature Graph" daily={forecast.daily} />
                </Grid>

              </Grid>
              
            </Grid>

          </Grid>
        </Container>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackOpen}
          autoHideDuration={3000}
          onClose={handleSnackClose}
        >
          <SnackBarContentWrapper
            onClose={handleSnackClose}
            variant={snackVar}
            message={snackMsg}
          />
        </Snackbar>
        
      </div>
    );
  }
}
