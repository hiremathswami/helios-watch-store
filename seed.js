const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/watchstore')

  .then(async () => {
    const Rohan7385 = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'rohanhiremathswami73@gmail.com.com',
      password: Rohan7385,
      isAdmin: true
    });
    console.log('✅ Admin user created!');
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
