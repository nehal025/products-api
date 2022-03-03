const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	img: String,
	info:String,	
	price: String,
}, {
	versionKey: false 
});

const Product = new mongoose.model("Product", ProductSchema)
module.exports = Product;
