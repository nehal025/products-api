//Product api
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Get all Productor product by id
router.get('/', async (req, res) => {
	let title=req.query.title;
	var query={};
	
	if(title){
		query["title"]=title;
	}
	const q = await Product.find(query);
	console.log("Req from client")
	res.json(q)
	});

// Create new restarurnt
router.post('/', async (req, res) => {
	const newProduct = new Product(req.body);	
	const savedProduct = await newProduct.save();
	res.json(savedProduct);
});

module.exports = router;