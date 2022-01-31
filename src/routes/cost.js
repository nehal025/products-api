const express = require('express');

const router = express.Router();
const costScrapper = require("../costScrapper");

// Get all Min Max price Product 
router.get('/', async (req, res) => {

	let name = req.query.name;
	var query = {};

	console.log("Req from client")

	if (name) {
		query["name"] = name;
	}

	costScrapper(name).then(dataObj => {

		res.json(dataObj)

	}).catch(console.error)


});



module.exports = router;