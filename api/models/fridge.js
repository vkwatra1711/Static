const mongoose = require('mongoose');
module.exports = mongoose.model('Fridge', new mongoose.Schema({
id: String,
 storeId:String,
 fridgeId:Number,
 fridgename: String,
}));