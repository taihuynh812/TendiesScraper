const axios = require('axios')

async function fetch(ticker){
    // debugger
    await axios.get(`/tickerinfo/MSFT`)
        .then(res => {
            console.log(res)
            return res
        })
        .catch(err => console.log(err))
}

fetch("MSFT")