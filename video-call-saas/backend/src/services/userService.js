const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  findUserByEmail,
};// we using this because it is a good practice to separate business logic from controllers 
//if we use this in multiple controllers then we can reuse this function
//otherwise using this in controller make it complex if we have many functions
// we can add more functions here for user-related business logic