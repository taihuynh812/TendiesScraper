const express = require('express'); // web framework
const fetch = require('node-fetch'); // for making AJAX requests
const path = require('path');
const bodyParser = require('body-parser')
const finnhub = require('finnhub')
const request = require('request')
require('dotenv').config(); 

const app = express();

app.use(express.static('dist')); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/dist/index.html`);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening at localhost:${PORT}`);
});

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY 
const finnhubClient = new finnhub.DefaultApi()

app.get('/tickerinfo/:ticker', (req,res, next) => {
    finnhubClient.companyProfile2({'symbol': `${req.params.ticker}`}, (error, data, response) => {
        if (error){
            return error
        }
        res.json(data)
    });
})

app.get('/tickertrend/:ticker', (req,res, next) => {
    finnhubClient.recommendationTrends(req.params.ticker, (error, data, response) => {
        if (error){
            return error
        }
        res.json(data)
    });
})
