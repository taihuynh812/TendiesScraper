const express = require('express'); // web framework
const fetch = require('node-fetch'); // for making AJAX requests
const path = require('path');
const finnhub = require('finnhub')
require('dotenv').config(); 

const app = express();

app.use(express.static('dist')); 

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/dist/index.html`);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening at localhost:${PORT}`);
});


const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY // Replace this
const finnhubClient = new finnhub.DefaultApi()

function fetchCompany(ticker){
    finnhubClient.companyProfile2({'symbol': `${ticker}`}, (error, data, response) => {
        return (data)
    });
}

function fetchTickerInfo(ticker){
    const url = (`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${api_key.apiKey}`)
    const fetch_api = fetch(url)
        .then(res => res.json())
        .then(data => console.log(data))
}

fetchTickerInfo("MSFT")