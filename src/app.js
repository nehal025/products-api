require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const cron = require('node-cron');

var port = process.env.PORT || 3000;

// Create express app
const app = express();


// Database
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
	
})
	.then(() => {
		console.log("Connected to MongoDB database...");
	})
	.catch((e) => {
		console.log("Connection falied...")
	});


// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
	res.send("Hello,from server");
});

const products = require('./routes/products');
app.use('/products', products);

const cost = require('./routes/cost');
app.use('/cost', cost);


const adminRouter = require('./routes/admin.router');
app.use('/admin', adminRouter);

// Starting server

app.listen(port, console.log(`Listening on port ${port}`));




const ping = () => request('https://blind-product-detection.herokuapp.com', (error, response, body) => {

	console.log('Preventing server from down')
	console.log('error:', error);
	console.log('statusCode:', response && response.statusCode);
	console.log('body:', body);

});


cron.schedule('*/20 * * * *', function () {
	var today = new Date();
	var time = today.getHours();
	
		if( time<14|| time>19){
			ping();
		}
		

});