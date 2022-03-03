const express = require('express');

const router = express.Router();
const costScrapper = require("../Scrapper/costScrapper");

// Get all Min Max price Product 
router.get('/', async (req, res) => {

	let name = req.query.name;

	console.log("Req from client")

	if (name) {
		costScrapper(name).then(dataObj => {

			res.json(dataObj)
	
		}).catch(console.error)	}
		else{
			res.json({ status: 'error', error: 'pls provide product name' })
	}


});



module.exports = router;