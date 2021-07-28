const express = require('express'); // web framework
const fetch = require('node-fetch'); // for making AJAX requests
const path = require('path');

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