'use strict'

const userModel = require('../models/user.js');
const superagent = require('superagent');

const Data = {};

//======API ROUTES=====================

// -- Here we write the functions for our routes and call them as functions in server.js

Data.getUserInfo = async(request, response) => {
  const userEmail = request.query.email;
  const user = await userModel.findOne({ email: userEmail });
  if (user === null) {
    response.send('user not in DB');
  } else {
    response.status(200).json(user);
  };
};

Data.createUser = async(request, response) => {
  const userEmail = request.body.email;
  const exists = await userModel.exists({ email: userEmail });
  if (exists) {
    response.status(200).send('user in DB');
  } else {
    const user = {
      email: request.body.email,
      name: request.body.name,
    };
    const newUser = new userModel(user);
    await newUser.save();
    response.status(200).send(`${newUser.name} has been added to the DB`);
  };
};

Data.getAllActivites = async(request, response) => {
  const url = `https://developer.nps.gov/api/v1/activities?api_key=${process.env.NPS_API_KEY}`;
  superagent
    .get(url)
    .then(results => {
      const activities = results.body.data;
      response.status(200).send(activities);
    })
    .catch((err) => {
      console.log('NPS API Error');
      response.status(404).send('NPS API Error');
    });
};

Data.getAllParks = async(request, response) => {
  const maxResults = 500;
  const url = `https://developer.nps.gov/api/v1/parks?limit=${maxResults}&api_key=${process.env.NPS_API_KEY}`;
  superagent
  .get(url)
  .then(results => {
    // TODO can we write something here to get only the needed data? like park names? to speed up the API response on the front end.
    const parks = results.body.data;
    response.status(200).send(parks);
  })
  .catch((err) => {
    console.log('NPS API Error');
    response.status(404).send('NPS API Error');
  });
};

Data.getOnePark = async(request, response) => {
  const stateCode = request.params.state;
  const parkCode = request.params.park;
  const url = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&parkCode=${parkCode}&api_key=${process.env.NPS_API_KEY}`;
  superagent
  .get(url)
  .then(results => {
    const park = results.body.data;
    response.status(200).send(park);
  })
  .catch((err) => {
    console.log('NPS API Error');
    response.status(404).send('NPS API Error');
  });
};

//-----NOTE: This will return parks if "states" field includes the stateCode being queried for. This because some parks are in multiple states. Often times these are historic monuments - like WWII memorials, or the Lewis & Clark Trail park which extends from Pittsburgh to Astoria, passing through many states.
Data.getParksByState = async(request, response) => {
  const maxResults = 100;
  const stateCode = request.params.state;
  const url = `https://developer.nps.gov/api/v1/parks?limit=${maxResults}&stateCode=${stateCode}&api_key=${process.env.NPS_API_KEY}`;
  superagent
  .get(url)
  .then(results => {
    const parks = results.body.data;
    response.status(200).send(parks);
  })
  .catch((err) => {
    console.log('NPS API Error');
    response.status(404).send('NPS API Error');
  });
};

Data.getCampgroundsByState = async(request, response) => {
  const maxResults = 200;
  const stateCode = request.params.state;
  const url = `https://developer.nps.gov/api/v1/campgrounds?limit=${maxResults}&stateCode=${stateCode}&api_key=${process.env.NPS_API_KEY}`;
  superagent
  .get(url)
  .then(results => {
    const campgrounds = results.body.data;
    response.status(200).send(campgrounds);
  })
  .catch((err) => {
    console.log('NPS API Error');
    response.status(404).send('NPS API Error');
  });
};

Data.getParksByActivity = async(request, response) => {
  console.log('PARAMS', request.params);
  const activityID = request.params.activity;
  const url = `https://developer.nps.gov/api/v1/activities/parks?id=${activityID}&api_key=${process.env.NPS_API_KEY}`;
  superagent
  .get(url)
  .then(results => {
    const parks = results.body.data;
    response.status(200).send(parks);
  })
  .catch((err) => {
    console.log('NPS API Error');
    response.status(404).send('NPS API Error');
  });
};


module.exports = Data;
