'use strict'

const userModel = require('../models/user.js');
const superagent = require('superagent');

const Data = {};

//======API ROUTES=====================

// -- Here we right the functions for the route function calls on server.js

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
    const parks = results.body.data;
    response.status(200).send(parks);
  })
  .catch((err) => {
    console.log('NPS API Error');
    response.status(404).send('NPS API Error');
  });
};

Data.getOnePark = async(request, response) => {
  console.log('req params', request.params); // NOT GETTING REQ.PARAMS??
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

//-----Why does this return some parks with non-matching stateCode?? - because the stateCode sent as query param is also listed in the "states" field from the API???
Data.getParksByState = async(request, response) => {
  console.log('test');
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


module.exports = Data;
