const express = require('express'); // web framework
const fetch = require('node-fetch'); // for making AJAX requests
const bodyParser = require('body-parser')
const finnhub = require('finnhub')
const axios = require('axios')
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

const marketstackAPI = process.env.MARKETSTACK_API_KEY

function getYesterdaysDate() {
    var date = new Date();
    date.setDate(date.getDate()-1);
    return  date.getFullYear() + '-' + ("0" + (date.getMonth()+1)).slice(-2) + '-' + ("0" + (date.getDate())).slice(-2)
}

function sevenDaysAgo(){
    var date = new Date();
    date.setDate(date.getDate()-8);
    return  date.getFullYear() + '-' + ("0" + (date.getMonth()+1)).slice(-2) + '-' + ("0" + (date.getDate())).slice(-2)
}

const yesterday = getYesterdaysDate()
const aWeekAgo = sevenDaysAgo()

app.get("/price/:ticker", (req, res, next) => {
    const url = `http://api.marketstack.com/v1/eod?access_key=${marketstackAPI}&symbols=${req.params.ticker}&date_from=${aWeekAgo}&date_to=${yesterday}`
    axios.get(url)
        .then(response => {
            res.json(response.data)
        })
        .catch(err => {
            res.send(err)
        });
})

