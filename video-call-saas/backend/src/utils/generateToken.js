import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
//here we are using JWT to generate a token for the user
//the token is signed with the user id and the JWT secret
//the token is valid for 30 days

// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
//this command is used to generate a random string of 64 characters
//this string is used as a JWT secret
//this string is stored in the .env file
//this string is used to sign the JWT token
//this string is used to verify the JWT token



export default generateToken;
