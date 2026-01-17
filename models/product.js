const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex'
  },
  movement: String
});


module.exports = mongoose.model('Product', productSchema);
