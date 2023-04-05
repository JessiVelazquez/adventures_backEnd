'use strict';

const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {type: Object, required: true},
  park: {type: Object, required: true}
  // TODO add date via date picker
});

const Trip = mongoose.model('trip', tripSchema);

module.exports = Trip;
