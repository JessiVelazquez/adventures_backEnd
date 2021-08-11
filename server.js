'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const Data = require('./modules/data.js');
const PORT = process.env.PORT || 3002;

//ROUTES FUNCTION CALLS=============

// -- Here we tell Express what to do with each http request type to each endpoint
// -- Could be a different one for each http request type for each endpoint
// -- ON FRONT END - send axios.get/post/put.del requests to these endpoints, passing in the params which will become request.body.email or request.params._whatecer_ | See display.js in genre room front end.

app.get('/user', Data.getUserInfo); //gets user by passing auth0 email in on front end axios call
app.post('/user', Data.createUser); //creates user if user not in DB on front end axios call
app.get('/activities', Data.getAllActivites); //list of activities
app.get('/activities/parks/:activity', Data.getParksByActivity); //gets parks that feature a specific activity
app.get('/parks', Data.getAllParks); //gets all parks - need to build in query params??
app.get('/parks/:state', Data.getParksByState); //gets parks by stateCode
app.get('/parks/:state/:park', Data.getOnePark); //gets one park 
app.get('/campgrounds/:state', Data.getCampgroundsByState); //gets campgrounds by stateCode
// more go here TODO

app.get('/', (request, response) => {
  response.send('Hello World');
});

app.use('*', (request, response) => {
  response.status(404).send('These are not the droids you are looking for');
});

//DB CONNECTION===========

const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require('mongoose');

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to the database');
});

app.listen(PORT, () => console.log('Listening on port', PORT));

