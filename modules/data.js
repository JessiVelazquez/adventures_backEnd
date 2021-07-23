'use strict'

const userModel = require('../models/user.js');
const superagent = require('superagent');

const Data = {};

//======API ROUTES=====================

Data.getUserInfo = async(request, response) => {
  const userEmail = request.query.email;
  console.log('req object', request.query);
  const user = await userModel.findOne({ email: userEmail });
  console.log('USER', user);
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



module.exports = Data;
