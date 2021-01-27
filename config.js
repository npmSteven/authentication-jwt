require('dotenv').config();

module.exports = {
  db: {
    url: process.env.DB_URL,
  },
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
  }
};
