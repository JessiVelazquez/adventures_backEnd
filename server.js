'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const Data = require('./modules/data.js');
const PORT = process.env.PORT || 3002;

// RESOURCES =============

// -- Here we tell Express what to do with each http request type to each endpoint
// -- Could be a different one for each http request type for each endpoint
// -- ON FRONT END - send axios http requests to these endpoints, passing in the params which will become request.body.email or request.params._whatever_ | See display.js in genre room front end.

// USERS
// gets user by passing auth0 email in on API call from front end
app.get('/user', Data.getUserInfo); 
// creates user if user not in DB
app.post('/user', Data.createUser); 

// TRIPS
// creates a trip
app.post('/trips', Data.createTrip);
// gets trips by user
app.get('/trips', Data.getUserTrips);

// ACTIVITIES
// list of activities
app.get('/activities', Data.getAllActivites);
// gets parks that feature a specific activity
app.get('/activities/parks/:activity', Data.getParksByActivity);

// PARKS
// gets all parks - need to build in query params??
app.get('/parks', Data.getAllParks);
// gets parks by stateCode
app.get('/parks/:state', Data.getParksByState);
// gets one park
app.get('/parks/:state/:park', Data.getOnePark);


// LODGING
// gets campgrounds by stateCode
app.get('/campgrounds/:state', Data.getCampgroundsByState);


app.get('/', (request, response) => {
  response.send('Connected to Adventures Back End - Node.js Server');
});

app.use('*', (request, response) => {
  response.status(404).send('404 - Connection Error');
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

