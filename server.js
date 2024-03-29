const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/forecast/:lat,:lng', (req, res) => {
  axios.get(`https://api.darksky.net/forecast/09b2001e4b878941580a9e3460cb83e4/${req.params.lat},${req.params.lng}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error)
    })
});

app.get('/api/zip/:zipcode', (req, res) => {
  axios.get(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${req.params.zipcode}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error)
    })
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));