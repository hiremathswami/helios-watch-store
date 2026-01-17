const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/watchstore')

  .then(async () => {
    const Rohan7385 = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: '.admin@gmail.com',
      password: admin7385,
      isAdmin: true
    });
    console.log('Admin user created!');
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
