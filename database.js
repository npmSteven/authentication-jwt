const mongoose = require('mongoose');

module.exports.connectDb = async () => {
  await mongoose.connect('mongodb://localhost/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
